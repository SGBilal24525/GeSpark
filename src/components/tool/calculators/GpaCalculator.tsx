
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type Course = {
  id: number;
  credits: number;
  grade: string;
};

type GpaResult = {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
};

const gradeToPoint = (grade: string): number => {
    const gradeMap: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    return gradeMap[grade] ?? 0;
};

const calculateGpa = (courses: Course[]): GpaResult => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
        const credits = course.credits || 0;
        if (credits > 0) {
            totalPoints += gradeToPoint(course.grade) * credits;
            totalCredits += credits;
        }
    });

    if (totalCredits === 0) {
        return { gpa: 0, totalCredits: 0, totalPoints: 0 };
    }

    const gpa = totalPoints / totalCredits;
    return {
        gpa: parseFloat(gpa.toFixed(2)),
        totalCredits,
        totalPoints,
    };
};

const GpaResultDisplay = ({ result }: { result: GpaResult | null }) => {
    if (!result || result.totalCredits === 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your GPA will appear here.</p>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Semester Result</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Your GPA is</p>
                    <p className="text-5xl font-bold text-primary">{result.gpa.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Credits</p>
                        <p className="font-semibold text-lg">{result.totalCredits}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="font-semibold text-lg">{result.totalPoints.toFixed(2)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export function GpaCalculator() {
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

  const [gpaCourses, setGpaCourses] = useState<Course[]>([{ id: 1, credits: 3, grade: 'A' }]);
  const [gpaResult, setGpaResult] = useState<GpaResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        performCalculation(() => {
          startTransition(() => {
              const result = calculateGpa(gpaCourses);
              setGpaResult(result);
          });
        });
    }
  }, [gpaCourses, isClient]);

  const handleGpaCourseChange = (index: number, field: keyof Course, value: any) => {
      const newCourses = [...gpaCourses];
      const course = newCourses[index];
      if (field === 'credits') {
          (course as any)[field] = value ? parseInt(value) : 0;
      } else {
          (course as any)[field] = value;
      }
      setGpaCourses(newCourses);
  };

  const addGpaCourse = () => {
      setGpaCourses([...gpaCourses, { id: Date.now(), credits: 3, grade: 'A' }]);
  };

  const removeGpaCourse = (index: number) => {
      if (gpaCourses.length <= 1) return;
      const newCourses = gpaCourses.filter((_, i) => i !== index);
      setGpaCourses(newCourses);
  };
  
  const handleGpaReset = () => {
      setGpaCourses([{ id: 1, credits: 3, grade: 'A' }]);
      setGpaResult(null);
  };
    
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Your Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {gpaCourses.map((course, index) => (
                            <motion.div 
                                key={course.id}
                                layout
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                            >
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor={`credits-${index}`} className="text-xs">Credits</Label>
                                        <Input
                                            id={`credits-${index}`}
                                            type="number"
                                            value={course.credits || ''}
                                            onChange={e => handleGpaCourseChange(index, 'credits', e.target.value)}
                                            placeholder="e.g., 3"
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                         <Label htmlFor={`grade-${index}`} className="text-xs">Grade</Label>
                                         <Select value={course.grade} onValueChange={value => handleGpaCourseChange(index, 'grade', value)}>
                                             <SelectTrigger id={`grade-${index}`} className="h-9">
                                                 <SelectValue />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 {gradeOptions.map(grade => (
                                                     <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                                 ))}
                                             </SelectContent>
                                         </Select>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeGpaCourse(index)} className="self-end" disabled={gpaCourses.length <= 1}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </motion.div>
                        ))}
                        <Button variant="outline" onClick={addGpaCourse} className="w-full mt-4">
                            <Plus className="h-4 w-4 mr-2" /> Add Course
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleGpaReset} variant="destructive" className="w-full">Reset All</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                           <GpaResultDisplay result={gpaResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
