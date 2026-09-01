
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bolt, DollarSign, Banknote, Percent } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type ElectricityBillResult = {
  totalBill: number;
  baseCost: number;
  taxAmount: number;
  averageCostPerDay: number;
};

const calculateElectricityBill = (
  units: number,
  rate: number,
  fixedCharges: number,
  tax: number
): ElectricityBillResult => {
  if (units <= 0 || rate <= 0) {
    return { totalBill: 0, baseCost: 0, taxAmount: 0, averageCostPerDay: 0 };
  }

  const baseCost = units * rate;
  const costWithFixed = baseCost + (fixedCharges || 0);
  const taxAmount = costWithFixed * ((tax || 0) / 100);
  const totalBill = costWithFixed + taxAmount;
  const averageCostPerDay = totalBill / 30; // Assuming monthly billing period

  return { totalBill, baseCost, taxAmount, averageCostPerDay };
};

const ElectricityBillResultDisplay = ({ result }: { result: ElectricityBillResult | null }) => {
  if (!result || result.totalBill <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your electricity bill estimate will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Estimated Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Your Total Estimated Bill</p>
            <p className="font-bold text-4xl text-primary">
                {result.totalBill.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div>
                <p className="text-xs text-muted-foreground">Base Cost</p>
                <p className="font-semibold text-md">{result.baseCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">Tax & Surcharges</p>
                <p className="font-semibold text-md">{result.taxAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">Average Cost/Day</p>
                <p className="font-semibold text-md">{result.averageCostPerDay.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ElectricityBillCalculator() {
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

  const [unitsConsumed, setUnitsConsumed] = useState<number | undefined>();
  const [ratePerUnit, setRatePerUnit] = useState<number | undefined>();
  const [fixedCharges, setFixedCharges] = useState<number | undefined>();
  const [taxSurcharge, setTaxSurcharge] = useState<number | undefined>();
  const [electricityBillResult, setElectricityBillResult] = useState<ElectricityBillResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (unitsConsumed && ratePerUnit) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateElectricityBill(unitsConsumed, ratePerUnit, fixedCharges || 0, taxSurcharge || 0);
                  setElectricityBillResult(result);
              });
            });
        } else {
            startTransition(() => {
                setElectricityBillResult(null);
            });
        }
    }
  }, [unitsConsumed, ratePerUnit, fixedCharges, taxSurcharge, isClient]);
  
  const handleElectricityBillReset = () => {
      setUnitsConsumed(undefined);
      setRatePerUnit(undefined);
      setFixedCharges(undefined);
      setTaxSurcharge(undefined);
      setElectricityBillResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Bill Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="units" className="flex items-center gap-2"><Bolt className="h-5 w-5" />Units Consumed (kWh)</Label>
                            <Input id="units" type="number" value={unitsConsumed || ''} onChange={e => setUnitsConsumed(parseFloat(e.target.value) || undefined)} placeholder="e.g., 350" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rate" className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Rate per Unit ($/kWh)</Label>
                            <Input id="rate" type="number" value={ratePerUnit || ''} onChange={e => setRatePerUnit(parseFloat(e.target.value) || undefined)} placeholder="e.g., 0.15" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fixedCharges" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Fixed Charges ($) (Optional)</Label>
                            <Input id="fixedCharges" type="number" value={fixedCharges || ''} onChange={e => setFixedCharges(parseFloat(e.target.value) || undefined)} placeholder="e.g., 10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tax" className="flex items-center gap-2"><Percent className="h-5 w-5" />Tax or Surcharge (%) (Optional)</Label>
                            <Input id="tax" type="number" value={taxSurcharge || ''} onChange={e => setTaxSurcharge(parseFloat(e.target.value) || undefined)} placeholder="e.g., 5" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleElectricityBillReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <ElectricityBillResultDisplay result={electricityBillResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
