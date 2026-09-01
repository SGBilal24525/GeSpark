
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, CalendarDays, Percent } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type SavingGoalResult = {
    monthlyContribution: number;
    totalContributions: number;
    totalInterest: number;
};

const calculateSavingGoal = (
    goal: number,
    months: number,
    annualRate: number,
    startBalance: number = 0
): SavingGoalResult => {
    if (goal <= startBalance || months <= 0) {
        return { monthlyContribution: 0, totalContributions: 0, totalInterest: 0 };
    }
    
    const r = annualRate / 100 / 12; // monthly interest rate
    
    let pmt: number; // monthly contribution
    
    if (r === 0) {
        pmt = (goal - startBalance) / months;
    } else {
        const futureValueStart = startBalance * Math.pow(1 + r, months);
        pmt = (goal - futureValueStart) * r / (Math.pow(1 + r, months) - 1);
    }
    
    const totalContributions = pmt * months;
    const totalInterest = goal - startBalance - totalContributions;

    return {
        monthlyContribution: pmt,
        totalContributions,
        totalInterest,
    };
};

const SavingGoalResultDisplay = ({ result }: { result: SavingGoalResult | null }) => {
    if (!result || result.monthlyContribution <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your saving plan will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Your Saving Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Required Monthly Contribution</p>
                    <p className="text-4xl font-bold text-primary">
                        {result.monthlyContribution.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Contributions</p>
                        <p className="text-2xl font-semibold">
                            {result.totalContributions.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                     <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                        <p className="text-2xl font-semibold">
                            {result.totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function SavingGoalCalculator() {
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

  const [savingGoalAmount, setSavingGoalAmount] = useState<number | undefined>();
  const [savingGoalMonths, setSavingGoalMonths] = useState<number | undefined>();
  const [savingGoalReturnRate, setSavingGoalReturnRate] = useState<number | undefined>();
  const [savingGoalResult, setSavingGoalResult] = useState<SavingGoalResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (savingGoalAmount && savingGoalMonths && savingGoalReturnRate !== undefined) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateSavingGoal(savingGoalAmount, savingGoalMonths, savingGoalReturnRate);
                  setSavingGoalResult(result);
              });
            });
        } else {
            startTransition(() => {
                setSavingGoalResult(null);
            });
        }
    }
  }, [savingGoalAmount, savingGoalMonths, savingGoalReturnRate, isClient]);

  const handleSavingGoalReset = () => {
      setSavingGoalAmount(undefined);
      setSavingGoalMonths(undefined);
      setSavingGoalReturnRate(undefined);
      setSavingGoalResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Enter Your Saving Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="savingGoalAmount" className="flex items-center gap-2"><Landmark className="h-5 w-5" />Goal Amount ($)</Label>
                        <Input id="savingGoalAmount" type="number" value={savingGoalAmount || ''} onChange={e => setSavingGoalAmount(parseFloat(e.target.value) || undefined)} placeholder="e.g., 10000" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="savingGoalMonths" className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Months to Save</Label>
                        <Input id="savingGoalMonths" type="number" value={savingGoalMonths || ''} onChange={e => setSavingGoalMonths(parseInt(e.target.value) || undefined)} placeholder="e.g., 18" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="savingGoalReturnRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Expected Annual Return (%)</Label>
                        <Input id="savingGoalReturnRate" type="number" value={savingGoalReturnRate || ''} onChange={e => setSavingGoalReturnRate(parseFloat(e.target.value) || undefined)} placeholder="e.g., 6" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSavingGoalReset} variant="outline" className="w-full">Reset</Button>
                </CardFooter>
            </Card>
            <div className="sticky top-24">
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <SavingGoalResultDisplay result={savingGoalResult} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        </div>
    );
}
