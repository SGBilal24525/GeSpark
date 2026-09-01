
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Percent, Wallet } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type SalaryResult = {
  netSalary: number;
  totalTax: number;
  totalDeductions: number;
};

const calculateSalary = (
  grossSalary: number,
  taxRate: number,
  otherDeductions: number
): SalaryResult => {
  if (grossSalary <= 0) {
    return { netSalary: 0, totalTax: 0, totalDeductions: 0 };
  }
  const totalTax = grossSalary * (taxRate / 100);
  const totalDeductions = otherDeductions;
  const netSalary = grossSalary - totalTax - totalDeductions;
  return { netSalary, totalTax, totalDeductions };
};

const SalaryResultDisplay = ({ result }: { result: SalaryResult | null }) => {
  if (!result || result.netSalary <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your salary breakdown will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Salary Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Net Take-Home Salary (Annual)</p>
            <p className="text-4xl font-bold text-primary">
                {result.netSalary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Tax Paid</p>
                <p className="text-2xl font-semibold">
                    {result.totalTax.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
             <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Other Deductions</p>
                <p className="text-2xl font-semibold">
                    {result.totalDeductions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function SalaryCalculator() {
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

  const [grossSalary, setGrossSalary] = useState<number | undefined>();
  const [taxRate, setTaxRate] = useState<number | undefined>();
  const [otherDeductions, setOtherDeductions] = useState<number | undefined>();
  const [salaryResult, setSalaryResult] = useState<SalaryResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (grossSalary && taxRate !== undefined && otherDeductions !== undefined) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateSalary(grossSalary, taxRate, otherDeductions);
                  setSalaryResult(result);
              });
            });
        } else {
            startTransition(() => {
                setSalaryResult(null);
            });
        }
    }
  }, [grossSalary, taxRate, otherDeductions, isClient]);

  const handleSalaryReset = () => {
      setGrossSalary(undefined);
      setTaxRate(undefined);
      setOtherDeductions(undefined);
      setSalaryResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Salary & Deductions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="grossSalary" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Gross Annual Salary ($)</Label>
                            <Input id="grossSalary" type="number" value={grossSalary || ''} onChange={e => setGrossSalary(parseFloat(e.target.value) || undefined)} placeholder="e.g., 60000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Tax Rate (%)</Label>
                            <Input id="taxRate" type="number" value={taxRate || ''} onChange={e => setTaxRate(parseFloat(e.target.value) || undefined)} placeholder="e.g., 15" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otherDeductions" className="flex items-center gap-2"><Wallet className="h-5 w-5" />Other Deductions (Annual, $)</Label>
                            <Input id="otherDeductions" type="number" value={otherDeductions || ''} onChange={e => setOtherDeductions(parseFloat(e.target.value) || undefined)} placeholder="e.g., 1000" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSalaryReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <SalaryResultDisplay result={salaryResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
