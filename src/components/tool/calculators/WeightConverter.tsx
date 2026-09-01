
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import type { Tool } from '@/lib/tools';

type ConversionResult = {
    convertedValue: number;
    unit: string;
};

const conversionFactors: Record<string, Record<string, number>> = {
    'weight': { 'mg': 0.000001, 'g': 0.001, 'kg': 1, 'ton': 1000, 'oz': 0.0283495, 'lb': 0.453592, 'stone': 6.35029 },
};

const calculateConversion = (value: number, from: string, to: string, toolSlug: string): ConversionResult => {
    const slugMap: Record<string, string> = {
        'weight-converter': 'weight',
    };
    const category = slugMap[toolSlug];
    
    if (!category) return { convertedValue: 0, unit: to };

    if (from === to) return { convertedValue: value, unit: to };
    
    const factors = conversionFactors[category];
    if (!factors) return { convertedValue: 0, unit: to };

    const valueInBase = value * (factors[from] || 1);
    const convertedValue = valueInBase / (factors[to] || 1);

    return { convertedValue: parseFloat(convertedValue.toPrecision(6)), unit: to };
};

const GenericResultDisplay = ({ result }: { result: ConversionResult | null }) => {
    if (result === null) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your conversion result will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Conversion Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-5xl font-bold text-primary break-all">
                    {result.convertedValue.toLocaleString()}
                </p>
                 <p className="font-semibold text-muted-foreground">{result.unit}</p>
            </CardContent>
        </Card>
    );
};

export function WeightConverter({ tool }: { tool: Tool }) {
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

  const defaultFrom = tool.inputs.find(i => i.id === 'from-unit')?.options?.[0] || '';
  const defaultTo = tool.inputs.find(i => i.id === 'to-unit')?.options?.[1] || tool.inputs.find(i => i.id === 'to-unit')?.options?.[0] || '';
  const [converterValue, setConverterValue] = useState<number|undefined>();
  const [fromUnit, setFromUnit] = useState<string>(defaultFrom);
  const [toUnit, setToUnit] = useState<string>(defaultTo);
  const [converterResult, setConverterResult] = useState<ConversionResult|null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (converterValue !== undefined && fromUnit && toUnit) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateConversion(converterValue, fromUnit, toUnit, tool.slug);
                  setConverterResult(result);
              });
            });
        } else {
            startTransition(() => {
                setConverterResult(null);
            });
        }
    }
  }, [tool.slug, converterValue, fromUnit, toUnit, isClient]);
  
  const handleConverterSwap = () => {
    startTransition(() => {
        const oldFrom = fromUnit;
        setFromUnit(toUnit);
        setToUnit(oldFrom);
    });
  };

  const handleConverterReset = () => {
      setConverterValue(undefined);
      setFromUnit(defaultFrom);
      setToUnit(defaultTo);
      setConverterResult(null);
  };
  
  useEffect(() => {
      setFromUnit(defaultFrom);
      setToUnit(defaultTo);
      handleConverterReset();
  }, [tool.slug]);

  const units = tool.inputs.find(i => i.id === 'from-unit')?.options || [];
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Value to Convert</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="converterValue">Value</Label>
                            <Input id="converterValue" type="number" value={converterValue === undefined ? '' : converterValue} onChange={e => setConverterValue(e.target.value === '' ? undefined : parseFloat(e.target.value))} placeholder="e.g., 5" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="fromUnit">From</Label>
                                <Select value={fromUnit} onValueChange={setFromUnit}>
                                    <SelectTrigger id="fromUnit"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="self-end pb-2">
                                <Button variant="ghost" size="icon" onClick={handleConverterSwap}>
                                    <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            </div>
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="toUnit">To</Label>
                                <Select value={toUnit} onValueChange={setToUnit}>
                                    <SelectTrigger id="toUnit"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button onClick={handleConverterReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                     <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                           <GenericResultDisplay result={converterResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
