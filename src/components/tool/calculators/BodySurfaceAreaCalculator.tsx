
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import type { Tool } from '@/lib/tools';

type BsaResult = {
    bsa: number;
};

const calculateBsa = (height: number, weight: number, heightUnit: 'cm' | 'in' | 'ft', weightUnit: 'kg' | 'lb', formula: 'Mosteller' | 'DuBois' | 'Haycock'): BsaResult => {
    if (height <= 0 || weight <= 0) {
        return { bsa: 0 };
    }

    let h = height;
    if (heightUnit === 'in') {
        h *= 2.54; // inches to cm
    } else if (heightUnit === 'ft') {
        h *= 30.48; // feet to cm
    }
    const w = weightUnit === 'kg' ? weight : weight * 0.453592;

    let bsa = 0;
    if (formula === 'Mosteller') {
        bsa = Math.sqrt((h * w) / 3600);
    } else if (formula === 'DuBois') {
        bsa = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
    } else if (formula === 'Haycock') {
        bsa = 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378);
    }

    return { bsa: parseFloat(bsa.toFixed(2)) };
};

const BsaResultDisplay = ({ result }: { result: BsaResult | null }) => {
    if (!result || result.bsa <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your BSA result will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">BSA Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                 <p className="font-bold text-5xl text-primary">{result.bsa} m²</p>
                 <p className="text-muted-foreground mt-2">A typical BSA for an adult is 1.7 m².</p>
            </CardContent>
        </Card>
    );
};

export function BodySurfaceAreaCalculator({ tool }: { tool: Tool }) {
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

  const [bsaHeight, setBsaHeight] = useState<number | undefined>();
  const [bsaWeight, setBsaWeight] = useState<number | undefined>();
  const [bsaHeightUnit, setBsaHeightUnit] = useState<'cm' | 'in' | 'ft'>('cm');
  const [bsaWeightUnit, setBsaWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [bsaFormula, setBsaFormula] = useState<'Mosteller' | 'DuBois' | 'Haycock'>('Mosteller');
  const [bsaResult, setBsaResult] = useState<BsaResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (bsaHeight && bsaWeight) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateBsa(bsaHeight, bsaWeight, bsaHeightUnit, bsaWeightUnit, bsaFormula);
                  setBsaResult(result);
              });
            });
        } else {
            setBsaResult(null);
        }
    }
  }, [bsaHeight, bsaWeight, bsaHeightUnit, bsaWeightUnit, bsaFormula, isClient]);

  const handleBsaReset = () => {
    setBsaHeight(undefined);
    setBsaWeight(undefined);
    setBsaHeightUnit('cm');
    setBsaWeightUnit('kg');
    setBsaFormula('Mosteller');
    setBsaResult(null);
  };
    
    const formulaOptions = tool.inputs.find(i => i.id === 'formula')?.options || [];
    const heightUnitOptions = tool.inputs.find(i => i.id === 'height')?.units || ['cm', 'in', 'ft'];

    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Measurements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Height</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={bsaHeight || ''} onChange={e => setBsaHeight(parseFloat(e.target.value) || undefined)} className="flex-grow" placeholder="e.g., 170" />
                                <Tabs value={bsaHeightUnit} onValueChange={(val) => setBsaHeightUnit(val as 'cm' | 'in' | 'ft')} className="w-auto">
                                    <TabsList className="grid grid-cols-3 w-[150px] h-10 p-1">
                                        {heightUnitOptions.map(unit => (
                                          <TabsTrigger key={unit} value={unit} className="h-full">{unit}</TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Weight</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={bsaWeight || ''} onChange={e => setBsaWeight(parseFloat(e.target.value) || undefined)} className="flex-grow" placeholder="e.g., 70" />
                                <Tabs value={bsaWeightUnit} onValueChange={(val) => setBsaWeightUnit(val as 'kg' | 'lb')} className="w-auto">
                                    <TabsList className="grid grid-cols-2 w-[100px] h-10 p-1">
                                        <TabsTrigger value="kg" className="h-full">kg</TabsTrigger>
                                        <TabsTrigger value="lb" className="h-full">lb</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Formula</Label>
                            <Select value={bsaFormula} onValueChange={(val) => setBsaFormula(val as 'Mosteller' | 'DuBois' | 'Haycock')}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {formulaOptions.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleBsaReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <BsaResultDisplay result={bsaResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
