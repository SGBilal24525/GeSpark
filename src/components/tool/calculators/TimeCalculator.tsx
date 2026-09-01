
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

type TimeCalculationResult = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
};

const calculateTime = (
    time1: { h: number; m: number; s: number },
    time2: { h: number; m: number; s: number },
    operation: 'add' | 'subtract' | 'duration'
): TimeCalculationResult => {
    const time1Seconds = (time1.h || 0) * 3600 + (time1.m || 0) * 60 + (time1.s || 0);
    const time2Seconds = (time2.h || 0) * 3600 + (time2.m || 0) * 60 + (time2.s || 0);

    let totalSeconds = 0;
    if (operation === 'add') {
        totalSeconds = time1Seconds + time2Seconds;
    } else if (operation === 'subtract') {
        totalSeconds = Math.abs(time1Seconds - time2Seconds);
    } else { // duration
        totalSeconds = Math.abs(time1Seconds - time2Seconds);
    }

    if (totalSeconds < 0) totalSeconds = 0;

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return {
        days,
        hours,
        minutes,
        seconds,
        totalHours: totalSeconds / 3600,
        totalMinutes: totalSeconds / 60,
        totalSeconds
    };
};

const TimeCalculatorResultDisplay = ({ result }: { result: TimeCalculationResult | null }) => {
    if (!result || result.totalSeconds === 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your result will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const formats = [
        {
            label: "Detailed Duration",
            value: `${result.days > 0 ? `${result.days}d ` : ''}${String(result.hours).padStart(2, '0')}:${String(result.minutes).padStart(2, '0')}:${String(result.seconds).padStart(2, '0')}`
        },
        {
            label: "Total Hours",
            value: `${result.totalHours.toFixed(2)} hours`
        },
        {
            label: "Total Minutes",
            value: `${result.totalMinutes.toFixed(2)} minutes`
        },
        {
            label: "Total Seconds",
            value: `${result.totalSeconds.toLocaleString()} seconds`
        },
    ]

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Calculated Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {formats.map((format, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">{format.label}</p>
                        <p className="font-bold text-xl text-primary">{format.value}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export function TimeCalculator() {
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

  const [timeMode, setTimeMode] = useState<'add' | 'subtract' | 'duration'>('duration');
  const [time1, setTime1] = useState({ h: '', m: '', s: '' });
  const [time2, setTime2] = useState({ h: '', m: '', s: '' });
  const [timeResult, setTimeResult] = useState<TimeCalculationResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleTimeInputChange = (timeIndex: 1 | 2, field: 'h' | 'm' | 's', value: string) => {
    const setter = timeIndex === 1 ? setTime1 : setTime2;
    setter(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (isClient) {
        const t1 = {
            h: parseInt(time1.h) || 0,
            m: parseInt(time1.m) || 0,
            s: parseInt(time1.s) || 0,
        };
        const t2 = {
            h: parseInt(time2.h) || 0,
            m: parseInt(time2.m) || 0,
            s: parseInt(time2.s) || 0,
        };
        if ((t1.h || t1.m || t1.s) || (t2.h || t2.m || t2.s)) {
          performCalculation(() => {
            startTransition(() => {
                const result = calculateTime(t1, t2, timeMode);
                setTimeResult(result);
            });
          });
        } else {
            setTimeResult(null);
        }
    }
  }, [time1, time2, timeMode, isClient]);
  
  const handleTimeReset = () => {
    setTime1({ h: '', m: '', s: '' });
    setTime2({ h: '', m: '', s: '' });
    setTimeResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card className="w-full">
                     <CardHeader>
                        <CardTitle className="font-headline text-2xl">Calculate Time</CardTitle>
                        <Tabs defaultValue="duration" onValueChange={(val) => setTimeMode(val as any)} className="w-full pt-4">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="add">Add</TabsTrigger>
                                <TabsTrigger value="subtract">Subtract</TabsTrigger>
                                <TabsTrigger value="duration">Duration</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4 rounded-lg border p-4">
                            <Label>{timeMode === 'duration' ? 'Start Time' : 'Time 1'}</Label>
                            <div className="flex items-center gap-2">
                                <Input type="number" value={time1.h} onChange={e => handleTimeInputChange(1, 'h', e.target.value)} placeholder="HH" min="0" />
                                <span>:</span>
                                <Input type="number" value={time1.m} onChange={e => handleTimeInputChange(1, 'm', e.target.value)} placeholder="MM" min="0" max="59" />
                                <span>:</span>
                                <Input type="number" value={time1.s} onChange={e => handleTimeInputChange(1, 's', e.target.value)} placeholder="SS" min="0" max="59" />
                            </div>
                        </div>
                        <div className="space-y-4 rounded-lg border p-4">
                             <Label>{timeMode === 'duration' ? 'End Time' : 'Time 2'}</Label>
                             <div className="flex items-center gap-2">
                                <Input type="number" value={time2.h} onChange={e => handleTimeInputChange(2, 'h', e.target.value)} placeholder="HH" min="0" />
                                <span>:</span>
                                <Input type="number" value={time2.m} onChange={e => handleTimeInputChange(2, 'm', e.target.value)} placeholder="MM" min="0" max="59" />
                                <span>:</span>
                                <Input type="number" value={time2.s} onChange={e => handleTimeInputChange(2, 's', e.target.value)} placeholder="SS" min="0" max="59" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleTimeReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                 <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <TimeCalculatorResultDisplay result={timeResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
