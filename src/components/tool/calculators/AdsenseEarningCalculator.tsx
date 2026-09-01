
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Eye, Pointer, BarChart, Lightbulb, ArrowRight } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { generateToolInsight } from '@/ai/flows/generate-tool-insight';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

type AdsenseResult = {
  daily: number;
  monthly: number;
  yearly: number;
};

const calculateAdsense = (
  pageViews: number,
  ctr: number,
  cpc: number,
  adsPerPaage: number
): AdsenseResult => {
  if (pageViews <= 0 || ctr <= 0 || cpc <= 0) {
    return { daily: 0, monthly: 0, yearly: 0 };
  }
  const clicks = pageViews * (ctr / 100) * (adsPerPaage || 1);
  const daily = clicks * cpc;
  const monthly = daily * 30;
  const yearly = daily * 365;

  return { daily, monthly, yearly };
};

const AdsenseResultDisplay = ({ result }: { result: AdsenseResult | null }) => {
  if (!result || result.daily <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed bg-background/30">
        <div className="text-center text-muted-foreground">
          <p>Your estimated earnings will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-xl w-full h-full bg-gradient-to-br from-indigo-50/80 to-blue-50/80 dark:from-gray-900/80 dark:via-indigo-900/50 dark:to-purple-950/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Estimated Earnings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-background/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Daily</p>
          <p className="font-bold text-3xl text-primary">
            {result.daily.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="p-4 bg-background/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Monthly</p>
          <p className="font-bold text-3xl text-primary/80">
            {result.monthly.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="p-4 bg-background/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Yearly</p>
          <p className="font-bold text-3xl text-primary/70">
            {result.yearly.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const AiExplanation = () => {
    const [insight, setInsight] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            try {
                const result = await generateToolInsight({ toolName: "AdSense Earning Calculator" });
                setInsight(result.insight);
            } catch (error) {
                console.error("Failed to generate AI insight:", error);
                setInsight("Could not load an insight at this time.");
            }
        });
    }, []);

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    How The Formula Works
                </CardTitle>
                <CardDescription>An AI-powered explanation of the math behind AdSense earnings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="prose prose-sm dark:prose-invert text-muted-foreground">
                    {isPending ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    ) : (
                    insight && (
                        <ul>
                        {insight.split('\n').filter(line => line.startsWith('* ')).map((line, index) => (
                            <li key={index}>{line.substring(2)}</li>
                        ))}
                        </ul>
                    )
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export function AdsenseEarningCalculator() {
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

  const [pageViews, setPageViews] = useState<number | undefined>();
  const [ctr, setCtr] = useState<number | undefined>();
  const [cpc, setCpc] = useState<number | undefined>();
  const [adsPerPage, setAdsPerPage] = useState<number | undefined>();
  const [adsenseResult, setAdsenseResult] = useState<AdsenseResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (pageViews && ctr && cpc) {
        performCalculation(() => {
          startTransition(() => {
            const result = calculateAdsense(pageViews, ctr, cpc, adsPerPage || 1);
            setAdsenseResult(result);
          });
        });
      } else {
        startTransition(() => {
          setAdsenseResult(null);
        });
      }
    }
  }, [pageViews, ctr, cpc, adsPerPage, isClient]);

  const handleReset = () => {
    setPageViews(undefined);
    setCtr(undefined);
    setCpc(undefined);
    setAdsPerPage(undefined);
    setAdsenseResult(null);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Card className="border-primary/20 shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Enter Your Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pageViews" className="flex items-center gap-2"><Eye className="h-5 w-5" />Daily Page Views</Label>
              <Input id="pageViews" type="number" value={pageViews || ''} onChange={(e) => setPageViews(parseFloat(e.target.value) || undefined)} placeholder="e.g., 10,000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctr" className="flex items-center gap-2"><Pointer className="h-5 w-5" />Click-Through Rate (CTR %)</Label>
              <Input id="ctr" type="number" value={ctr || ''} onChange={(e) => setCtr(parseFloat(e.target.value) || undefined)} placeholder="e.g., 2.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpc" className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Cost Per Click (CPC in $)</Label>
              <Input id="cpc" type="number" value={cpc || ''} onChange={(e) => setCpc(parseFloat(e.target.value) || undefined)} placeholder="e.g., 0.15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adsPerPage" className="flex items-center gap-2"><BarChart className="h-5 w-5" />Ad Impressions per Page (Optional)</Label>
              <Input id="adsPerPage" type="number" value={adsPerPage || ''} onChange={(e) => setAdsPerPage(parseInt(e.target.value) || undefined)} placeholder="e.g., 3" />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReset} variant="outline" className="w-full">Reset</Button>
          </CardFooter>
        </Card>
        <div className="sticky top-24">
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <AdsenseResultDisplay result={adsenseResult} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AiExplanation />
    </div>
  );
}
