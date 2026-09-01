
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Receipt, Percent } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type TaxResult = {
  taxableIncome: number;
  taxPayable: number;
  netIncome: number;
  effectiveTaxRate: number;
};

const calculateTax = (grossIncome: number, deductions: number, taxRate: number): TaxResult => {
  if (grossIncome <= 0) {
    return { taxableIncome: 0, taxPayable: 0, netIncome: 0, effectiveTaxRate: 0 };
  }
  const taxableIncome = Math.max(0, grossIncome - deductions);
  const taxPayable = taxableIncome * (taxRate / 100);
  const netIncome = grossIncome - taxPayable;
  const effectiveTaxRate = grossIncome > 0 ? (taxPayable / grossIncome) * 100 : 0;

  return { taxableIncome, taxPayable, netIncome, effectiveTaxRate };
};

const TaxResultDisplay = ({ result }: { result: TaxResult | null }) => {
  if (!result || result.netIncome <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your tax breakdown will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Tax Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Net Income (After Tax)</p>
            <p className="font-bold text-4xl text-primary">
                {result.netIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Taxable Income</p>
            <p className="font-semibold text-lg">{result.taxableIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tax Payable</p>
            <p className="font-semibold text-lg">{result.taxPayable.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Effective Rate</p>
            <p className="font-semibold text-lg">{result.effectiveTaxRate.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function TaxCalculator() {
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();
  const router = useRouter();

  const checkUsageLimit = () => {
    if (!user) {
      const usageCount = parseInt(localStorage.getItem('toolUsageCount') || '0', 10);
      if (usageCount >= 3) {
        router.push('/signup');
        return false;
      }
    }
    return true;
  };

  const incrementUsage = () => {
    if (!user) {
      const usageCount = parseInt(localStorage.getItem('toolUsageCount') || '0', 10);
      localStorage.setItem('toolUsageCount', (usageCount + 1).toString());
    }
  };

  const performCalculation = (calcFn: () => void) => {
    if (checkUsageLimit()) {
      calcFn();
      incrementUsage();
    }
  };

  const [taxGrossIncome, setTaxGrossIncome] = useState<number | undefined>();
  const [taxDeductions, setTaxDeductions] = useState<number | undefined>(0);
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [currentTaxRate, setCurrentTaxRate] = useState<number | undefined>();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (taxGrossIncome && taxDeductions !== undefined && currentTaxRate !== undefined) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateTax(taxGrossIncome, taxDeductions, currentTaxRate);
                  setTaxResult(result);
              });
            });
        } else {
            startTransition(() => {
                setTaxResult(null);
            });
        }
    }
  }, [taxGrossIncome, taxDeductions, currentTaxRate, isClient]);

  const handleTaxReset = () => {
      setTaxGrossIncome(undefined);
      setTaxDeductions(0);
      setCurrentTaxRate(undefined);
      setTaxResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Income & Deductions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="taxGrossIncome" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Gross Annual Income ($)</Label>
                            <Input id="taxGrossIncome" type="number" value={taxGrossIncome || ''} onChange={e => setTaxGrossIncome(parseFloat(e.target.value) || undefined)} placeholder="e.g., 80000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxDeductions" className="flex items-center gap-2"><Receipt className="h-5 w-5" />Deductions ($)</Label>
                            <Input id="taxDeductions" type="number" value={taxDeductions || ''} onChange={e => setTaxDeductions(parseFloat(e.target.value) || undefined)} placeholder="e.g., 5000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currentTaxRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Tax Rate (%)</Label>
                            <Input id="currentTaxRate" type="number" value={currentTaxRate || ''} onChange={e => setCurrentTaxRate(parseFloat(e.target.value) || undefined)} placeholder="Tax rate" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleTaxReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <TaxResultDisplay result={taxResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
