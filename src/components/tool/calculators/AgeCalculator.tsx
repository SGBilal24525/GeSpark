
'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { intervalToDuration, differenceInSeconds, differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Copy, Share2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type AgeResult = {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMonths: number;
    totalWeeks: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
    totalSeconds: number;
};

const calculateAge = (birthDate: Date): AgeResult => {
  const now = new Date();
  if (!birthDate || birthDate > now) {
    return { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMonths: 0, totalWeeks: 0, totalDays: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0 };
  }
  const duration = intervalToDuration({ start: birthDate, end: now });
  const totalSeconds = differenceInSeconds(now, birthDate);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = differenceInDays(now, birthDate);
  const totalWeeks = differenceInWeeks(now, birthDate);
  const totalMonths = differenceInMonths(now, birthDate);

  return {
    years: duration.years || 0,
    months: duration.months || 0,
    weeks: duration.weeks || 0,
    days: duration.days || 0,
    hours: duration.hours || 0,
    minutes: duration.minutes || 0,
    seconds: duration.seconds || 0,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
  };
};

const AgeResultDisplay = ({ result, onReset }: { result: AgeResult | null; onReset: () => void; }) => {
    if (!result || result.totalSeconds <= 0) return null;
    
    const formats = [
        { id: "result_1", label: "1️⃣ Detailed Age (Years → Seconds)", values: [result.years, result.months, result.weeks, result.days, result.hours, result.minutes, result.seconds], units: ["years", "months", "weeks", "days", "hours", "minutes", "seconds"]},
        { id: "result_2", label: "2️⃣ Months → Seconds", values: [result.totalMonths, result.days, result.hours, result.minutes, result.seconds], units: ["months", "days", "hours", "minutes", "seconds"]},
        { id: "result_3", label: "3️⃣ Weeks → Seconds", values: [result.totalWeeks, result.days, result.hours, result.minutes, result.seconds], units: ["weeks", "days", "hours", "minutes", "seconds"]},
        { id: "result_4", "label": "4️⃣ Days → Seconds", values: [result.totalDays, result.hours, result.minutes, result.seconds], units: ["days", "hours", "minutes", "seconds"]},
        { id: "result_5", label: "5️⃣ Hours → Seconds", values: [result.totalHours, result.minutes, result.seconds], units: ["hours", "minutes", "seconds"]},
        { id: "result_6", label: "6️⃣ Minutes → Seconds", values: [result.totalMinutes, result.seconds], units: ["minutes", "seconds"]},
        { id: "result_7", label: "7️⃣ Seconds Only", values: [result.totalSeconds], units: ["seconds"]},
    ];

    const { toast } = useToast();

    const getResultsAsString = () => {
        let text = `My Age Calculation (from GeSpark):\n`;
        formats.forEach(f => {
            text += `\n- ${f.label}:\n`;
            text += f.values.map((v, i) => `${(v || 0).toLocaleString()} ${f.units[i]}`).join(", ");
            text += "\n";
        });
        return text;
    };

    const copyToClipboard = () => {
        const textToCopy = getResultsAsString();
        navigator.clipboard.writeText(textToCopy);
        toast({ title: "Copied to Clipboard!", description: "Age calculation results have been copied." });
    };

    const shareResults = () => {
        const textToCopy = getResultsAsString();
        if (navigator.share) {
            navigator.share({
                title: 'My Age Calculation from GeSpark',
                text: textToCopy,
                url: window.location.href,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(textToCopy + `\n\nCalculated at: ${window.location.href}`);
             toast({ title: "Link Copied!", description: "Share this link with others." });
        }
    }

    return (
         <Card className="rounded-2xl shadow-md w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold font-headline">Your Age Results</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy Results">
                            <Copy className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={shareResults} aria-label="Share Results">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onReset} aria-label="Reset Results">
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {formats.map((format) => (
                    <div key={format.id} id={format.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="text-xs font-semibold text-muted-foreground mb-2">{format.label}</p>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-base">
                            {format.values.map((value, i) => (
                                <div key={i} className="flex items-baseline">
                                    <span className="font-bold text-primary text-lg">{(value || 0).toLocaleString()}</span>
                                    <span className="text-xs ml-1 text-muted-foreground">{format.units[i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
};


export function AgeCalculator() {
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
  
  const [dob, setDob] = useState<Date | undefined>();
  const [tob, setTob] = useState<string>('00:00');
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const ageIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => {
        if (ageIntervalRef.current) clearInterval(ageIntervalRef.current);
    };
  }, []);
  
  const startAgeCalculation = () => {
    if (ageIntervalRef.current) clearInterval(ageIntervalRef.current);
    
    if (dob && isClient) {
      performCalculation(() => {
        const [h, m] = tob.split(':');
        const fullDob = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate(), parseInt(h), parseInt(m));
        
        if (fullDob > new Date()) {
          setAgeResult(null);
          return;
        }
        
        const calculateAndUpdate = () => setAgeResult(calculateAge(fullDob));
        calculateAndUpdate(); // Initial calculation
        ageIntervalRef.current = setInterval(calculateAndUpdate, 1000); // Update every second
      });
    }
  };

  const handleAgeReset = () => {
    startTransition(() => {
        if (ageIntervalRef.current) {
            clearInterval(ageIntervalRef.current);
            ageIntervalRef.current = null;
        }
        setDob(undefined);
        setTob('00:00');
        setAgeResult(null);
    });
  };

  useEffect(() => {
      if (dob) {
        startAgeCalculation();
      } else {
        handleAgeReset();
      }
  }, [dob, tob, isClient]);

    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Birth Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Select Date of Birth</Label>
                            <DatePicker name="dob" selected={dob} onSelect={(date) => startTransition(() => setDob(date))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tob" className="flex items-center gap-2"><Clock className="h-5 w-5"/> Select Time (Optional)</Label>
                            <Input id="tob" name="tob" type="time" value={tob} onChange={(e) => startTransition(() => setTob(e.target.value))} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleAgeReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        {ageResult && ageResult.totalSeconds > 0 ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <AgeResultDisplay result={ageResult} onReset={handleAgeReset} />
                            </motion.div>
                        ) : (
                            <Card className="rounded-2xl flex items-center justify-center h-[500px] border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <p>Your age results will appear here in real-time.</p>
                                </div>
                            </Card>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
