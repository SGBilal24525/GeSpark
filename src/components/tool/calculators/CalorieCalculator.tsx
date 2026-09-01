
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type CalorieResult = {
  bmr: number;
  maintenance: number;
  goals: {
    lose: number;
    gain: number;
  };
};

const calculateCalories = (
  gender: 'male' | 'female',
  age: number,
  height: number,
  weight: number,
  activityLevel: number
): CalorieResult => {
  if (age <= 0 || height <= 0 || weight <= 0) {
    return { bmr: 0, maintenance: 0, goals: { lose: 0, gain: 0 } };
  }

  // Mifflin-St Jeor Formula
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  
  bmr = Math.round(bmr);
  const maintenance = Math.round(bmr * activityLevel);

  return {
    bmr,
    maintenance,
    goals: {
      lose: maintenance - 500,
      gain: maintenance + 500,
    },
  };
};

const CalorieResultDisplay = ({ result }: { result: CalorieResult | null }) => {
  if (!result || result.bmr <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[400px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your calorie needs will appear here.</p>
        </div>
      </Card>
    );
  }
  
  const results = [
      { label: 'Lose Weight', value: result.goals.lose, color: 'text-orange-500' },
      { label: 'Maintain Weight', value: result.maintenance, color: 'text-green-500' },
      { label: 'Gain Weight', value: result.goals.gain, color: 'text-blue-500' },
  ]

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
        <CardHeader>
            <CardTitle className="font-headline text-2xl">Your Daily Calorie Needs</CardTitle>
            <CardDescription>Based on the Mifflin-St Jeor formula.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Your Basal Metabolic Rate (BMR) is</p>
                <p className="font-bold text-3xl text-primary">{result.bmr.toLocaleString()} kcal / day</p>
                <p className="text-xs text-muted-foreground">Calories your body burns at rest.</p>
            </div>
            
            <div className='space-y-4'>
                 {results.map(r => (
                    <div key={r.label} className="p-4 border rounded-lg">
                        <p className="text-sm font-semibold">{r.label}</p>
                        <p className={`font-bold text-2xl ${r.color}`}>{r.value.toLocaleString()} kcal / day</p>
                    </div>
                 ))}
            </div>
        </CardContent>
    </Card>
  );
};

export function CalorieCalculator() {
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

  const [calorieGender, setCalorieGender] = useState<'male' | 'female'>('male');
  const [calorieAge, setCalorieAge] = useState<number | undefined>();
  const [calorieHeight, setCalorieHeight] = useState<number | undefined>();
  const [calorieWeight, setCalorieWeight] = useState<number | undefined>();
  const [calorieHeightUnit, setCalorieHeightUnit] = useState('cm');
  const [calorieWeightUnit, setCalorieWeightUnit] = useState('kg');
  const [activityLevel, setActivityLevel] = useState(1.55);
  const [calorieResult, setCalorieResult] = useState<CalorieResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (calorieAge && calorieHeight && calorieWeight) {
            performCalculation(() => {
              let heightInCm = calorieHeight;
              if (calorieHeightUnit === 'ft') {
                  heightInCm = calorieHeight * 30.48;
              }

              let weightInKg = calorieWeight;
              if (calorieWeightUnit === 'lb') {
                  weightInKg = calorieWeight * 0.453592;
              }

              startTransition(() => {
                  const result = calculateCalories(calorieGender, calorieAge, heightInCm, weightInKg, activityLevel);
                  setCalorieResult(result);
              });
            });
        } else {
            startTransition(() => {
                setCalorieResult(null);
            });
        }
    }
  }, [calorieGender, calorieAge, calorieHeight, calorieWeight, calorieHeightUnit, calorieWeightUnit, activityLevel, isClient]);

  const handleCalorieReset = () => {
      setCalorieGender('male');
      setCalorieAge(undefined);
      setCalorieHeight(undefined);
      setCalorieWeight(undefined);
      setActivityLevel(1.55);
      setCalorieResult(null);
  };
    
  const activityLevels = [
    { label: 'Sedentary (little/no exercise)', value: 1.2 },
    { label: 'Lightly active (1–3 days/wk)', value: 1.375 },
    { label: 'Moderately active (3–5 days/wk)', value: 1.55 },
    { label: 'Very active (6–7 days/wk)', value: 1.725 },
    { label: 'Extra active (physical job/athlete)', value: 1.9 },
  ];
     return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <RadioGroup defaultValue="male" value={calorieGender} onValueChange={(val) => setCalorieGender(val as 'male' | 'female')} className="flex items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calorieAge">Age (years)</Label>
                            <Input id="calorieAge" type="number" value={calorieAge || ''} onChange={e => setCalorieAge(parseInt(e.target.value) || undefined)} placeholder="e.g., 28" />
                        </div>
                        <div className="space-y-2">
                        <Label>Height</Label>
                        <div className="flex items-center gap-2">
                                <Input type="number" value={calorieHeight || ''} onChange={e => setCalorieHeight(parseFloat(e.target.value) || undefined)} className="flex-grow"/>
                                <Tabs value={calorieHeightUnit} onValueChange={setCalorieHeightUnit} className="w-auto">
                                <TabsList className="grid grid-cols-2 w-[100px] h-10 p-1">
                                    <TabsTrigger value="cm" className="h-full">cm</TabsTrigger>
                                    <TabsTrigger value="ft" className="h-full">ft</TabsTrigger>
                                </TabsList>
                                </Tabs>
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label>Weight</Label>
                        <div className="flex items-center gap-2">
                                <Input type="number" value={calorieWeight || ''} onChange={e => setCalorieWeight(parseFloat(e.target.value) || undefined)} className="flex-grow"/>
                                <Tabs value={calorieWeightUnit} onValueChange={setCalorieWeightUnit} className="w-auto">
                                <TabsList className="grid grid-cols-2 w-[100px] h-10 p-1">
                                    <TabsTrigger value="kg" className="h-full">kg</TabsTrigger>
                                    <TabsTrigger value="lb" className="h-full">lb</TabsTrigger>
                                </TabsList>
                                </Tabs>
                        </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Activity Level</Label>
                            <Select value={String(activityLevel)} onValueChange={(val) => setActivityLevel(parseFloat(val))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {activityLevels.map(level => (
                                        <SelectItem key={level.value} value={String(level.value)}>{level.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleCalorieReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <CalorieResultDisplay result={calorieResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
     );
}
