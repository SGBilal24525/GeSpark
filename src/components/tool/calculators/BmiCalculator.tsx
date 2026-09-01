
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

type BmiResult = {
    bmi: number;
    category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' | 'Extremely Obese' | 'N/A';
    idealRange: [number, number];
};

const calculateBmi = (height: number, weight: number, heightUnit: string, weightUnit: string): BmiResult => {
    if (height <= 0 || weight <= 0) {
        return { bmi: 0, category: 'N/A', idealRange: [0,0] };
    }

    let heightInMeters = height;
    if (heightUnit === 'cm') {
        heightInMeters /= 100;
    } else if (heightUnit === 'ft') {
        heightInMeters *= 0.3048; // convert feet to meters
    }

    let weightInKg = weight;
    if (weightUnit === 'lb') {
        weightInKg *= 0.453592;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category: BmiResult['category'] = 'N/A';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi >= 18.5 && bmi < 25) category = 'Normal';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30 && bmi < 35) category = 'Obese';
    else if (bmi >= 35) category = 'Extremely Obese';

    const idealLower = 18.5 * (heightInMeters * heightInMeters);
    const idealUpper = 24.9 * (heightInMeters * heightInMeters);

    return {
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        idealRange: [parseFloat(idealLower.toFixed(1)), parseFloat(idealUpper.toFixed(1))]
    };
};

const BmiResultDisplay = ({ result }: { result: BmiResult | null }) => {
    if (!result || result.bmi <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-[500px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your BMI result will appear here.</p>
                </div>
            </Card>
        );
    }

    const categories = [
        { name: 'Underweight', range: '< 18.5', color: 'bg-blue-400' },
        { name: 'Normal', range: '18.5–24.9', color: 'bg-green-500' },
        { name: 'Overweight', range: '25–29.9', color: 'bg-yellow-400' },
        { name: 'Obese', range: '30–34.9', color: 'bg-orange-500' },
        { name: 'Extremely Obese', range: '≥ 35', color: 'bg-red-600' },
    ];
    
    const categoryColors = {
        'Underweight': 'text-blue-500',
        'Normal': 'text-green-500',
        'Overweight': 'text-yellow-500',
        'Obese': 'text-orange-500',
        'Extremely Obese': 'text-red-500',
        'N/A': 'text-gray-500',
    };

    const bmiPercent = Math.min(Math.max((result.bmi - 15) / (40 - 15) * 100, 0), 100);

    return (
        <Card className="rounded-2xl shadow-md w-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Your BMI Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center">
                    <p className="text-muted-foreground">Your BMI is</p>
                    <p className={`font-bold text-6xl ${categoryColors[result.category]}`}>{result.bmi}</p>
                    <p className={`font-semibold text-lg ${categoryColors[result.category]}`}>{result.category}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-center">BMI Scale</h3>
                    <div className="relative w-full h-8 rounded-full overflow-hidden flex">
                        {categories.map(c => (
                            <div key={c.name} className={`h-full ${c.color}`} style={{ flexGrow: c.name === 'Underweight' ? 3.5 : c.name === 'Normal' ? 6.5 : c.name === 'Overweight' ? 5 : c.name === 'Obese' ? 5 : 5}} />
                        ))}
                         <div className="absolute top-0 h-full flex items-center" style={{ left: `calc(${bmiPercent}% - 8px)` }}>
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-primary ring-2 ring-white" />
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>35</span>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-muted-foreground">Your ideal weight range is</p>
                    <p className="font-semibold text-lg">{result.idealRange[0]} kg – {result.idealRange[1]} kg</p>
                </div>
            </CardContent>
        </Card>
    );
};

export function BmiCalculator() {
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

  const [bmiGender, setBmiGender] = useState('Male');
  const [bmiAge, setBmiAge] = useState<number | undefined>();
  const [bmiHeight, setBmiHeight] = useState<number | undefined>();
  const [bmiWeight, setBmiWeight] = useState<number | undefined>();
  const [bmiHeightUnit, setBmiHeightUnit] = useState('cm');
  const [bmiWeightUnit, setBmiWeightUnit] = useState('kg');
  const [bmiResult, setBmiResult] = useState<BmiResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
      if (isClient) {
          if (bmiHeight && bmiWeight) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateBmi(bmiHeight, bmiWeight, bmiHeightUnit, bmiWeightUnit);
                  setBmiResult(result);
              });
            });
          } else {
              setBmiResult(null);
          }
      }
  }, [bmiHeight, bmiWeight, bmiHeightUnit, bmiWeightUnit, isClient]);
  

  const handleBmiHeightUnitChange = (unit: string) => {
    const newHeight = unit === 'cm' ? parseFloat((bmiHeight ?? 0 * 30.48).toFixed(1)) : parseFloat(((bmiHeight ?? 0) / 30.48).toFixed(1));
    setBmiHeight(newHeight || undefined);
    setBmiHeightUnit(unit);
  }

  const handleBmiWeightUnitChange = (unit: string) => {
    const newWeight = unit === 'kg' ? parseFloat(((bmiWeight ?? 0) * 0.453592).toFixed(1)) : parseFloat(((bmiWeight ?? 0) / 0.453592).toFixed(1));
    setBmiWeight(newWeight || undefined);
    setBmiWeightUnit(unit);
  }

  const handleBmiReset = () => {
    setBmiAge(undefined);
    setBmiHeight(undefined);
    setBmiWeight(undefined);
    setBmiResult(null);
  };
  
     return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Gender</Label>
                                <Select value={bmiGender} onValueChange={setBmiGender}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" value={bmiAge || ''} onChange={e => setBmiAge(parseInt(e.target.value) || undefined)} placeholder="e.g., 25" />
                            </div>
                        </div>
                        <div className="space-y-2">
                        <Label>Height</Label>
                        <div className="flex items-center gap-2">
                                <Input type="number" value={bmiHeight || ''} onChange={e => setBmiHeight(parseFloat(e.target.value) || undefined)} className="flex-grow"/>
                                <Tabs value={bmiHeightUnit} onValueChange={handleBmiHeightUnitChange} className="w-auto">
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
                                <Input type="number" value={bmiWeight || ''} onChange={e => setBmiWeight(parseFloat(e.target.value) || undefined)} className="flex-grow"/>
                                <Tabs value={bmiWeightUnit} onValueChange={handleBmiWeightUnitChange} className="w-auto">
                                <TabsList className="grid grid-cols-2 w-[100px] h-10 p-1">
                                    <TabsTrigger value="kg" className="h-full">kg</TabsTrigger>
                                    <TabsTrigger value="lb" className="h-full">lb</TabsTrigger>
                                </TabsList>
                                </Tabs>
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleBmiReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <BmiResultDisplay result={bmiResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
     );
}
