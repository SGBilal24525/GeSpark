
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Banknote, Percent, Users } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type TipResult = {
    totalTip: number;
    totalAmount: number;
    perPerson: number;
}

const calculateTip = (bill: number, tipPercent: number, people: number): TipResult => {
    if (bill <= 0 || tipPercent < 0 || people <= 0) {
        return { totalTip: 0, totalAmount: 0, perPerson: 0 };
    }
    const totalTip = bill * (tipPercent / 100);
    const totalAmount = bill + totalTip;
    const perPerson = totalAmount / people;
    return {
        totalTip,
        totalAmount,
        perPerson,
    };
};

const TipResultDisplay = ({ result }: { result: TipResult | null }) => {
    if (!result || result.totalAmount <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your tip results will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl shadow-md w-full h-full bg-primary/5">
            <CardContent className="p-6 text-center space-y-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Tip</p>
                    <p className="text-4xl font-bold text-primary">
                        {result.totalTip.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-semibold">
                            {result.totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                     <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Per Person</p>
                        <p className="text-2xl font-semibold">
                            {result.perPerson.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function TipCalculator() {
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

  const [billAmount, setBillAmount] = useState<number | undefined>();
  const [tipPercent, setTipPercent] = useState('15');
  const [customTip, setCustomTip] = useState<number | undefined>();
  const [people, setPeople] = useState<number | undefined>();
  const [tipResult, setTipResult] = useState<TipResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
      if (isClient) {
          if (billAmount && (tipPercent || customTip) && people) {
              performCalculation(() => {
                startTransition(() => {
                    const finalTipPercent = tipPercent === 'custom' ? (customTip || 0) : parseFloat(tipPercent);
                    const result = calculateTip(billAmount, finalTipPercent, people);
                    setTipResult(result);
                });
              });
          } else {
              startTransition(() => {
                  setTipResult(null);
              });
          }
      }
  }, [billAmount, tipPercent, customTip, people, isClient]);

  const handleTipReset = () => {
    setBillAmount(undefined);
    setTipPercent('15');
    setCustomTip(undefined);
    setPeople(undefined);
    setTipResult(null);
  };
    
  const tipPresets = ['10', '15', '20', '25'];
     return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Bill Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="billAmount" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Bill Amount ($)</Label>
                            <Input id="billAmount" type="number" value={billAmount || ''} onChange={e => setBillAmount(parseFloat(e.target.value) || undefined)} placeholder="e.g., 120.50" />
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Percent className="h-5 w-5" />Tip Percentage</Label>
                            <Tabs value={tipPercent} onValueChange={setTipPercent} className="w-full">
                                <TabsList className="grid w-full grid-cols-5 h-auto">
                                    {tipPresets.map(preset => <TabsTrigger key={preset} value={preset}>{preset}%</TabsTrigger>)}
                                    <TabsTrigger value="custom">Custom</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            {tipPercent === 'custom' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                                    <Input type="number" value={customTip || ''} onChange={e => setCustomTip(parseFloat(e.target.value) || undefined)} placeholder="Enter custom tip %" />
                                </motion.div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="people" className="flex items-center gap-2"><Users className="h-5 w-5" />Split Between</Label>
                            <Input id="people" type="number" value={people || ''} onChange={e => setPeople(parseInt(e.target.value) || undefined)} placeholder="e.g., 4" min="1" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleTipReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <TipResultDisplay result={tipResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
     );
}
