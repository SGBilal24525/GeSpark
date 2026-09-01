
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { format, getUnixTime } from 'date-fns';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import type { Tool } from '@/lib/tools';

type DateFormatResult = {
    convertedDate: string;
}

const DateFormatResultDisplay = ({ result, onCopy }: { result: DateFormatResult | null, onCopy: (text:string)=>void }) => {
    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your converted date will appear here.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Converted Date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <Input readOnly value={result.convertedDate} className="bg-muted/50 font-mono text-lg h-12" />
                <Button onClick={()=>onCopy(result.convertedDate)} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                </Button>
            </CardContent>
        </Card>
    );
}

export function DateFormatConverter({ tool }: { tool: Tool }) {
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
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

  const [dateInput, setDateInput] = useState<Date | undefined>(undefined);
  const [dateFormat, setDateFormat] = useState('MM/dd/yyyy');
  const [dateFormatResult, setDateFormatResult] = useState<DateFormatResult | null>(null);

  useEffect(() => {
    setIsClient(true);
    setDateInput(new Date());
  }, []);

  useEffect(() => {
    if (isClient) {
        if (dateInput) {
            performCalculation(() => {
              startTransition(() => {
                  let converted = '';
                  try {
                      switch (dateFormat) {
                          case 'Unix Timestamp (seconds)':
                              converted = getUnixTime(dateInput).toString();
                              break;
                          case 'ISO 8601':
                              converted = dateInput.toISOString();
                              break;
                          case 'RFC 2822':
                              converted = dateInput.toUTCString();
                              break;
                           case 'SQL DateTime':
                              converted = format(dateInput, 'yyyy-MM-dd HH:mm:ss');
                              break;
                          default:
                              converted = format(dateInput, dateFormat);
                              break;
                      }
                      setDateFormatResult({ convertedDate: converted });
                  } catch (error) {
                      setDateFormatResult(null);
                      toast({ variant: 'destructive', title: 'Invalid Date Format', description: 'The chosen format is not valid.'});
                  }
              });
            });
        } else {
            setDateFormatResult(null);
        }
    }
  }, [dateInput, dateFormat, isClient, toast]);

  const handleDateCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied to Clipboard!', description: 'Converted date has been copied.' });
  };

  const handleDateReset = () => {
      setDateInput(undefined);
      setDateFormatResult(null);
  };

  const outputFormats = tool.inputs.find(i => i.id === 'outputFormat')?.options || [];
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter a Date</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <DatePicker name="date" selected={dateInput} onSelect={(date) => setDateInput(date)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Output Format</Label>
                             <Select value={dateFormat} onValueChange={setDateFormat}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {outputFormats.map(format => (
                                        <SelectItem key={format} value={format}>{format}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleDateReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <DateFormatResultDisplay result={dateFormatResult} onCopy={handleDateCopy} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
