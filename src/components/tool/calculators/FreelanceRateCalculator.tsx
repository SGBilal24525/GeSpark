
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Clock, Briefcase, Percent } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type FreelanceRateResult = {
    hourlyRate: number;
    projectRate: number;
    annualEquivalent: number;
};

const calculateFreelanceRate = (
    desiredIncome: number,
    weeklyHours: number,
    utilization: number,
    overhead: number
): FreelanceRateResult => {
    if (desiredIncome <= 0 || weeklyHours <= 0) {
        return { hourlyRate: 0, projectRate: 0, annualEquivalent: 0 };
    }
    const billableWeekly = weeklyHours * (utilization / 100);
    if (billableWeekly <= 0) return { hourlyRate: 0, projectRate: 0, annualEquivalent: 0 };
    
    const billableMonthly = billableWeekly * 4.33;
    const baseHourly = desiredIncome / billableMonthly;
    const adjustedHourly = baseHourly / (1 - overhead / 100);
    const projectRate = adjustedHourly * billableMonthly;
    const annualEquivalent = desiredIncome * 12;

    return {
        hourlyRate: adjustedHourly,
        projectRate,
        annualEquivalent
    };
};

const FreelanceResultDisplay = ({ result }: { result: FreelanceRateResult | null }) => {
    if (!result || result.hourlyRate <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your rate results will appear here.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardContent className="p-6 text-center space-y-6">
                 <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Recommended Hourly Rate</p>
                    <p className="text-4xl font-bold text-primary">
                        {result.hourlyRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Monthly Project Rate</p>
                        <p className="text-2xl font-semibold">
                            {result.projectRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                     <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Annual Equivalent</p>
                        <p className="text-2xl font-semibold">
                            {result.annualEquivalent.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function FreelanceRateCalculator() {
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

  const [desiredIncome, setDesiredIncome] = useState<number | undefined>();
  const [weeklyHours, setWeeklyHours] = useState<number | undefined>();
  const [utilization, setUtilization] = useState(70);
  const [overhead, setOverhead] = useState(20);
  const [freelanceResult, setFreelanceResult] = useState<FreelanceRateResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if(desiredIncome && weeklyHours) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateFreelanceRate(desiredIncome, weeklyHours, utilization, overhead);
                  setFreelanceResult(result);
              });
            });
        } else {
            startTransition(() => {
                setFreelanceResult(null);
            });
        }
    }
  }, [desiredIncome, weeklyHours, utilization, overhead, isClient]);

  const handleFreelanceReset = () => {
      setDesiredIncome(undefined);
      setWeeklyHours(undefined);
      setUtilization(70);
      setOverhead(20);
      setFreelanceResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Financials</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="desiredIncome" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Desired Monthly Income ($)</Label>
                            <Input id="desiredIncome" type="number" value={desiredIncome || ''} onChange={e => setDesiredIncome(parseFloat(e.target.value) || undefined)} placeholder="e.g., 3000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weeklyHours" className="flex items-center gap-2"><Clock className="h-5 w-5" />Working Hours per Week</Label>
                            <Input id="weeklyHours" type="number" value={weeklyHours || ''} onChange={e => setWeeklyHours(parseFloat(e.target.value) || undefined)} placeholder="e.g., 30" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="utilization" className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Billable Utilization (%)</Label>
                            <div className='flex items-center gap-4'>
                                <Slider id="utilization" value={[utilization]} onValueChange={([val]) => setUtilization(val)} min={10} max={100} step={5} />
                                <span className="font-mono text-lg">{utilization}%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="overhead" className="flex items-center gap-2"><Percent className="h-5 w-5" />Overhead / Taxes (%)</Label>
                            <div className='flex items-center gap-4'>
                                <Slider id="overhead" value={[overhead]} onValueChange={([val]) => setOverhead(val)} min={0} max={80} step={5} />
                                <span className="font-mono text-lg">{overhead}%</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleFreelanceReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <FreelanceResultDisplay result={freelanceResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
