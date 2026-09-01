
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Flame } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type WaterIntakeResult = {
  totalIntake: number;
};

const calculateWaterIntake = (weight: number, activityLevel: 'Low' | 'Moderate' | 'High'): WaterIntakeResult => {
  if (weight <= 0) {
    return { totalIntake: 0 };
  }
  let baseIntake = weight * 35; // ml per kg
  if (activityLevel === 'Moderate') {
    baseIntake += 500;
  } else if (activityLevel === 'High') {
    baseIntake += 1000;
  }
  return { totalIntake: baseIntake };
};

const WaterIntakeResultDisplay = ({ result }: { result: WaterIntakeResult | null }) => {
  if (!result || result.totalIntake <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your water intake needs will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Daily Water Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div>
          <p className="text-4xl font-bold text-primary">
            {result.totalIntake.toLocaleString()} ml
          </p>
          <p className="text-muted-foreground">
            or {(result.totalIntake / 1000).toFixed(2)} Liters
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          This is an estimate. Your needs may vary.
        </p>
      </CardContent>
    </Card>
  );
};

export function WaterIntakeCalculator() {
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
  
  const [waterWeight, setWaterWeight] = useState<number | undefined>();
  const [waterActivityLevel, setWaterActivityLevel] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [waterIntakeResult, setWaterIntakeResult] = useState<WaterIntakeResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (waterWeight) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateWaterIntake(waterWeight, waterActivityLevel);
                  setWaterIntakeResult(result);
              });
            });
        } else {
            startTransition(() => {
                setWaterIntakeResult(null);
            });
        }
    }
  }, [waterWeight, waterActivityLevel, isClient]);

  const handleWaterIntakeReset = () => {
      setWaterWeight(undefined);
      setWaterActivityLevel('Moderate');
      setWaterIntakeResult(null);
  };
    
  const activityLevels = ['Low', 'Moderate', 'High'];
  return (
      <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Enter Your Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="space-y-2">
                          <Label htmlFor="waterWeight" className="flex items-center gap-2"><Users className="h-5 w-5" />Weight (kg)</Label>
                          <Input id="waterWeight" type="number" value={waterWeight || ''} onChange={e => setWaterWeight(parseFloat(e.target.value) || undefined)} placeholder="e.g., 70" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="waterActivityLevel" className="flex items-center gap-2"><Flame className="h-5 w-5" />Activity Level</Label>
                          <Select value={waterActivityLevel} onValueChange={(val) => setWaterActivityLevel(val as 'Low' | 'Moderate' | 'High')}>
                              <SelectTrigger id="waterActivityLevel"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  {activityLevels.map(level => (
                                      <SelectItem key={level} value={level}>{level}</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      </div>
                  </CardContent>
                  <CardFooter>
                      <Button onClick={handleWaterIntakeReset} variant="outline" className="w-full">Reset</Button>
                  </CardFooter>
              </Card>
              <div className="sticky top-24">
                  <AnimatePresence>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                          <WaterIntakeResultDisplay result={waterIntakeResult} />
                      </motion.div>
                  </AnimatePresence>
              </div>
          </div>
      </div>
  );
}
