
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Percent, CalendarDays } from 'lucide-react';
import { EmiResultChart } from '@/components/tool/emi-result-chart';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type EmiResult = {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    amortization: { month: number; principal: number; interest: number; balance: number; }[];
};

const calculateEmi = (principal: number, annualRate: number, tenureMonths: number): EmiResult => {
    if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) {
        return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, amortization: [] };
    }

    const monthlyRate = annualRate / 12 / 100;
    const n = tenureMonths;

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    const amortization: EmiResult['amortization'] = [];
    for (let i = 1; i <= n; i++) {
        const interest = balance * monthlyRate;
        const principalPaid = monthlyPayment - interest;
        balance -= principalPaid;
        amortization.push({
            month: i,
            principal: principalPaid,
            interest: interest,
            balance: balance < 0.01 ? 0 : balance,
        });
    }

    return { 
        monthlyPayment, 
        totalInterest, 
        totalPayment,
        amortization
    };
};

const EmiResultDisplay = ({ result }: { result: EmiResult | null; }) => {
    if (!result || result.monthlyPayment <= 0) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-[500px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your mortgage results will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const chartData = [
        { name: 'Principal', value: result.totalPayment - result.totalInterest },
        { name: 'Interest', value: result.totalInterest }
    ];

    return (
        <Card className="rounded-2xl shadow-md w-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Mortgage Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Your Monthly Payment</p>
                    <p className="font-bold text-4xl text-primary">
                        {result.monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Interest</p>
                        <p className="font-semibold text-lg">
                           {result.totalInterest.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Payment</p>
                        <p className="font-semibold text-lg">
                            {result.totalPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Principal vs. Interest</h3>
                    <EmiResultChart data={chartData} />
                </div>
            </CardContent>
        </Card>
    );
};

export function MortgageCalculator() {
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
  
  const [loanAmount, setLoanAmount] = useState<number | undefined>();
  const [interestRate, setInterestRate] = useState<number | undefined>();
  const [tenure, setTenure] = useState<number | undefined>();
  const [tenureUnit, setTenureUnit] = useState('Years');
  const [emiResult, setEmiResult] = useState<EmiResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
      if (isClient) {
          if(loanAmount && interestRate && tenure) {
            performCalculation(() => {
              startTransition(() => {
                  const tenureInMonths = tenureUnit === 'Years' ? tenure * 12 : tenure;
                  const result = calculateEmi(loanAmount, interestRate, tenureInMonths);
                  setEmiResult(result);
              });
            });
          } else {
            startTransition(() => {
                setEmiResult(null);
            });
          }
      }
  }, [loanAmount, interestRate, tenure, tenureUnit, isClient]);

  const handleEmiReset = () => {
      setLoanAmount(undefined);
      setInterestRate(undefined);
      setTenure(undefined);
      setEmiResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Loan Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="loanAmount" className="flex items-center gap-2"><Home className="h-5 w-5" />Loan Amount ($)</Label>
                            <Input id="loanAmount" type="number" value={loanAmount || ''} onChange={e => setLoanAmount(parseFloat(e.target.value) || undefined)} placeholder="e.g., 250000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="interestRate" className="flex items-center gap-2"><Percent className="h-5 w-5" />Annual Interest Rate (%)</Label>
                            <Input id="interestRate" type="number" value={interestRate || ''} onChange={e => setInterestRate(parseFloat(e.target.value) || undefined)} placeholder="e.g., 4.5" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tenure" className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Loan Term</Label>
                            <div className="flex items-center gap-2">
                                    <Input id="tenure" type="number" value={tenure || ''} onChange={e => setTenure(parseInt(e.target.value) || undefined)} placeholder="e.g., 20" className="flex-grow"/>
                                    <Tabs value={tenureUnit} onValueChange={setTenureUnit} className="w-auto">
                                    <TabsList className="grid grid-cols-2 w-[150px] h-10 p-1">
                                        <TabsTrigger value="Years" className="h-full">Years</TabsTrigger>
                                        <TabsTrigger value="Months" className="h-full">Months</TabsTrigger>
                                    </TabsList>
                                    </Tabs>
                        </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleEmiReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <EmiResultDisplay result={emiResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
       </div>
    );
}
