
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, Banknote } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type ProfitMarginResult = {
  profit: number;
  margin: number;
  markup: number;
};

const calculateProfitMargin = (cost: number, sellingPrice: number): ProfitMarginResult => {
  if (cost <= 0 || sellingPrice <= 0 || sellingPrice < cost) {
    return { profit: 0, margin: 0, markup: 0 };
  }
  const profit = sellingPrice - cost;
  const margin = (profit / sellingPrice) * 100;
  const markup = (profit / cost) * 100;
  return { profit, margin, markup };
};

const ProfitMarginResultDisplay = ({ result }: { result: ProfitMarginResult | null }) => {
  if (!result || result.profit <= 0) {
    return (
      <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
        <div className="text-center text-muted-foreground">
          <p>Your profit details will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md w-full h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Profit Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Net Profit</p>
          <p className="font-bold text-4xl text-primary">
            {result.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="font-semibold text-lg">{result.margin.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Markup</p>
            <p className="font-semibold text-lg">{result.markup.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ProfitMarginCalculator() {
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

  const [pmCostPrice, setPmCostPrice] = useState<number | undefined>();
  const [pmSellingPrice, setPmSellingPrice] = useState<number | undefined>();
  const [pmResult, setPmResult] = useState<ProfitMarginResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (pmCostPrice && pmSellingPrice) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateProfitMargin(pmCostPrice, pmSellingPrice);
                  setPmResult(result);
              });
            });
        } else {
            startTransition(() => {
                setPmResult(null);
            });
        }
    }
  }, [pmCostPrice, pmSellingPrice, isClient]);

  const handlePmReset = () => {
      setPmCostPrice(undefined);
      setPmSellingPrice(undefined);
      setPmResult(null);
  };
    
    return (
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Enter Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pmCostPrice" className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Cost Price ($)
                </Label>
                <Input
                  id="pmCostPrice"
                  type="number"
                  value={pmCostPrice || ''}
                  onChange={(e) => setPmCostPrice(parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., 50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pmSellingPrice" className="flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Selling Price ($)
                </Label>
                <Input
                  id="pmSellingPrice"
                  type="number"
                  value={pmSellingPrice || ''}
                  onChange={(e) => setPmSellingPrice(parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., 80"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePmReset} variant="outline" className="w-full">
                Reset
              </Button>
            </CardFooter>
          </Card>
          <div className="sticky top-24">
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <ProfitMarginResultDisplay result={pmResult} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
}
