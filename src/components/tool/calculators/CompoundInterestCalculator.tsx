
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Banknote, Percent, CalendarDays, TrendingUp } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type CompoundInterestResult = {
    futureValue: number;
    totalProfit: number;
    roi: number;
};

const calculateCompoundInterest = (
    principal: number,
    annualRate: number,
    years: number,
    compoundingFrequency: number
): CompoundInterestResult => {
    if (principal <= 0 || annualRate < 0 || years <= 0) {
        return { futureValue: principal, totalProfit: 0, roi: 0 };
    }
    const rate = annualRate / 100;
    const futureValue = principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * years);
    const totalProfit = futureValue - principal;
    const roi = (totalProfit / principal) * 100;
    return { futureValue, totalProfit, roi };
};

const CompoundInterestResultDisplay = ({ result, principal }: { result: CompoundInterestResult | null, principal: number | undefined }) => {
    if (!result || !principal || result.futureValue <= principal) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your investment growth will appear here.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Investment Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Future Value</p>
                    <p className="font-bold text-4xl text-primary">
                        {result.futureValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Principal</p>
                        <p className="font-semibold text-lg">{principal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Profit</p>
                        <p className="font-semibold text-lg">{result.totalProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className="font-semibold text-lg">{result.roi.toFixed(2)}%</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function CompoundInterestCalculator() {
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

  const [ciPrincipal, setCiPrincipal] = useState<number | undefined>();
  const [ciInterestRate, setCiInterestRate] = useState<number | undefined>();
  const [ciYears, setCiYears] = useState<number | undefined>();
  const [compoundingFrequency, setCompoundingFrequency] = useState('1');
  const [ciResult, setCiResult] = useState<CompoundInterestResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (ciPrincipal && ciInterestRate && ciYears) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateCompoundInterest(ciPrincipal, ciInterestRate, ciYears, parseInt(compoundingFrequency));
                  setCiResult(result);
              });
            });
        } else {
            startTransition(() => {
                setCiResult(null);
            });
        }
    }
  }, [ciPrincipal, ciInterestRate, ciYears, compoundingFrequency, isClient]);

  const handleCiReset = () => {
      setCiPrincipal(undefined);
      setCiInterestRate(undefined);
      setCiYears(undefined);
      setCompoundingFrequency('1');
      setCiResult(null);
  };
    
  const compoundingFrequencies = [
    { label: 'Annually', value: '1' },
    { label: 'Semi-Annually', value: '2' },
    { label: 'Quarterly', value: '4' },
    { label: 'Monthly', value: '12' },
    { label: 'Weekly', value: '52' },
    { label: 'Daily', value: '365' },
  ];
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Investment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="ciPrincipal" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Initial Investment ($)</Label>
                            <Input id="ciPrincipal" type="number" value={ciPrincipal || ''} onChange={e => setCiPrincipal(parseFloat(e.target.value) || undefined)} placeholder="e.g., 10000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ciInterestRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Annual Interest Rate (%)</Label>
                            <Input id="ciInterestRate" type="number" value={ciInterestRate || ''} onChange={e => setCiInterestRate(parseFloat(e.target.value) || undefined)} placeholder="e.g., 6.5" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ciYears" className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Time Period (Years)</Label>
                            <Input id="ciYears" type="number" value={ciYears || ''} onChange={e => setCiYears(parseInt(e.target.value) || undefined)} placeholder="e.g., 10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="compoundingFrequency" className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Compounding Frequency</Label>
                            <Select value={compoundingFrequency} onValueChange={setCompoundingFrequency}>
                                <SelectTrigger id="compoundingFrequency"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {compoundingFrequencies.map(freq => (
                                        <SelectItem key={freq.value} value={freq.value}>{freq.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleCiReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <CompoundInterestResultDisplay result={ciResult} principal={ciPrincipal} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
