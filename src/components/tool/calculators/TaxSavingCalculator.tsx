
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Receipt, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type TaxSavingResult = {
  taxBefore: number;
  taxAfter: number;
  taxSaved: number;
  savingPercentage: number;
};

const calculateTaxSaving = (income: number, deductions: number, taxRate: number): TaxSavingResult => {
    if (income <= 0 || taxRate <= 0) {
        return { taxBefore: 0, taxAfter: 0, taxSaved: 0, savingPercentage: 0 };
    }
    const taxBefore = income * (taxRate / 100);
    const taxableIncomeAfter = Math.max(0, income - deductions);
    const taxAfter = taxableIncomeAfter * (taxRate / 100);
    const taxSaved = taxBefore - taxAfter;
    const savingPercentage = taxBefore > 0 ? (taxSaved / taxBefore) * 100 : 0;
    
    return { taxBefore, taxAfter, taxSaved, savingPercentage };
};

const TaxSavingResultDisplay = ({ result }: { result: TaxSavingResult | null }) => {
    if (!result || result.taxSaved <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your tax saving results will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const chartData = [
        { name: 'Tax Paid', value: result.taxAfter },
        { name: 'Tax Saved', value: result.taxSaved }
    ];

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Tax Saving Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">You Saved</p>
                    <p className="text-4xl font-bold text-green-500">
                        {result.taxSaved.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                     <p className="text-sm text-green-600 font-semibold">{result.savingPercentage.toFixed(1)}% of your tax</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tax Before Saving</p>
                        <p className="text-xl font-semibold text-destructive">
                            {result.taxBefore.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                    <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Tax After Saving</p>
                        <p className="text-xl font-semibold text-primary">
                            {result.taxAfter.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Tax Paid vs. Saved</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                               <Cell key={`cell-0`} fill={'hsl(var(--destructive))'} />
                               <Cell key={`cell-1`} fill={'hsl(var(--chart-2))'} />
                            </Pie>
                            <Tooltip formatter={(value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })} />
                            <legend content={() => (
                                <div className="flex justify-center items-center gap-4 text-xs mt-2">
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-destructive"></span> Tax Paid</div>
                                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Tax Saved</div>
                                </div>
                            )} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export function TaxSavingCalculator() {
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

  const [tsIncome, setTsIncome] = useState<number|undefined>();
  const [tsDeductions, setTsDeductions] = useState<number|undefined>();
  const [tsTaxRate, setTsTaxRate] = useState<number|undefined>();
  const [taxSavingResult, setTaxSavingResult] = useState<TaxSavingResult|null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (tsIncome && tsDeductions !== undefined && tsTaxRate !== undefined) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateTaxSaving(tsIncome, tsDeductions, tsTaxRate);
                  setTaxSavingResult(result);
              });
            });
        } else {
            startTransition(() => {
                setTaxSavingResult(null);
            });
        }
    }
  }, [tsIncome, tsDeductions, tsTaxRate, isClient]);
  
  const handleTaxSavingReset = () => {
      setTsIncome(undefined);
      setTsDeductions(undefined);
      setTsTaxRate(undefined);
      setTaxSavingResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Financial Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tsIncome" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Annual Income ($)</Label>
                            <Input id="tsIncome" type="number" value={tsIncome || ''} onChange={e => setTsIncome(parseFloat(e.target.value) || undefined)} placeholder="e.g., 45000" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="tsDeductions" className="flex items-center gap-2"><Receipt className="h-5 w-5" />Total Investments & Deductions ($)</Label>
                            <Input id="tsDeductions" type="number" value={tsDeductions || ''} onChange={e => setTsDeductions(parseFloat(e.target.value) || undefined)} placeholder="e.g., 8000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tsTaxRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Tax Rate (%)</Label>
                            <Input id="tsTaxRate" type="number" value={tsTaxRate || ''} onChange={e => setTsTaxRate(parseFloat(e.target.value) || undefined)} placeholder="e.g., 20" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleTaxSavingReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <TaxSavingResultDisplay result={taxSavingResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
