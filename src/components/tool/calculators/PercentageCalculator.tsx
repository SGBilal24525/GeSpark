
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type PercentageResult = {
    result: number;
    explanation: string;
}

const PercentageResultDisplay = ({ result }: { result: PercentageResult | null }) => {
    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your result will appear here.</p>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                 <p className="font-bold text-5xl text-primary">{result.result.toLocaleString()}</p>
                 <p className="text-muted-foreground mt-2">{result.explanation}</p>
            </CardContent>
        </Card>
    );
};

export function PercentageCalculator() {
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

  const [percentMode, setPercentMode] = useState('percentOfY');
  const [val1, setVal1] = useState<number | undefined>();
  const [val2, setVal2] = useState<number | undefined>();
  const [percentResult, setPercentResult] = useState<PercentageResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        const v1 = val1 || 0;
        const v2 = val2 || 0;
        let res: number = 0;
        let expl = '';

        if(v1 > 0 && v2 > 0) {
            performCalculation(() => {
              startTransition(() => {
                  switch(percentMode) {
                      case 'percentOfY':
                          res = (v1 / 100) * v2;
                          expl = `${v1}% of ${v2} is ${res.toLocaleString()}`;
                          break;
                      case 'xIsWhatPercentOfY':
                          res = (v1 / v2) * 100;
                          expl = `${v1} is ${res.toLocaleString()}% of ${v2}`;
                          break;
                      case 'percentChange':
                          res = ((v2 - v1) / v1) * 100;
                          const changeType = res > 0 ? 'increase' : 'decrease';
                          expl = `The change from ${v1} to ${v2} is a ${Math.abs(res).toLocaleString()}% ${changeType}.`;
                          break;
                      case 'applyPercent':
                          res = v1 + (v1 * (v2 / 100));
                          expl = `${v1} with an increase of ${v2}% is ${res.toLocaleString()}`;
                          break;
                  }
                  setPercentResult({ result: parseFloat(res.toFixed(2)), explanation: expl });
              });
            });
        } else {
            startTransition(() => {
                setPercentResult(null);
            });
        }
    }
  }, [percentMode, val1, val2, isClient]);

  const handlePercentageReset = () => {
      setVal1(undefined);
      setVal2(undefined);
      setPercentResult(null);
  }
    
  const modes = [
    { value: 'percentOfY', label: 'X% of Y' },
    { value: 'xIsWhatPercentOfY', label: 'X is what % of Y' },
    { value: 'percentChange', label: '% Change' },
    { value: 'applyPercent', label: 'Apply %' },
  ];
  
  const labels = {
      percentOfY: { val1: 'Percent (%)', val2: 'Of Value' },
      xIsWhatPercentOfY: { val1: 'Value (X)', val2: 'Of Total Value (Y)' },
      percentChange: { val1: 'Old Value', val2: 'New Value' },
      applyPercent: { val1: 'Original Value', val2: 'Percent (%) to apply' },
  };

  return (
      <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <Card className="w-full">
                  <CardHeader>
                      <Tabs defaultValue="percentOfY" onValueChange={setPercentMode} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                              {modes.map(mode => <TabsTrigger key={mode.value} value={mode.value} className="text-xs md:text-sm">{mode.label}</TabsTrigger>)}
                          </TabsList>
                      </Tabs>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <AnimatePresence mode="wait">
                          <motion.div 
                              key={percentMode}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                          >
                              <div className="space-y-2">
                              <Label>{labels[percentMode as keyof typeof labels].val1}</Label>
                              <Input type="number" value={val1 || ''} onChange={e => setVal1(parseFloat(e.target.value) || undefined)} placeholder="e.g., 25" />
                              </div>
                              <div className="space-y-2">
                              <Label>{labels[percentMode as keyof typeof labels].val2}</Label>
                              <Input type="number" value={val2 || ''} onChange={e => setVal2(parseFloat(e.target.value) || undefined)} placeholder="e.g., 200" />
                              </div>
                          </motion.div>
                      </AnimatePresence>
                  </CardContent>
                  <CardFooter>
                      <Button onClick={handlePercentageReset} variant="outline" className="w-full">Reset</Button>
                  </CardFooter>
              </Card>
              <div className="sticky top-24">
                  <AnimatePresence>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                      <PercentageResultDisplay result={percentResult} />
                  </motion.div>
              </AnimatePresence>
              </div>
          </div>
    </div>
  );
}
