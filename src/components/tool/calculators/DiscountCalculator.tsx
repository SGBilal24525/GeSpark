
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote, Tag } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type DiscountResult = {
    finalPrice: number;
    amountSaved: number;
}

const calculateDiscount = (originalPrice: number, discount: number): DiscountResult => {
    if(originalPrice <= 0 || discount < 0) {
        return { finalPrice: originalPrice, amountSaved: 0 };
    }
    const amountSaved = originalPrice * (discount / 100);
    const finalPrice = originalPrice - amountSaved;
    return { finalPrice, amountSaved };
}

const DiscountResultDisplay = ({ result }: { result: DiscountResult | null }) => {
    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your discount results will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl shadow-md w-full h-full bg-primary/5">
            <CardContent className="p-6 text-center space-y-6">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Final Price</p>
                    <p className="text-4xl font-bold text-primary">
                        {result.finalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
                <div className="space-y-1 p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">You Saved</p>
                    <p className="text-2xl font-semibold">
                        {result.amountSaved.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export function DiscountCalculator() {
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

  const [originalPrice, setOriginalPrice] = useState<number | undefined>();
  const [discountPercent, setDiscountPercent] = useState<number | undefined>();
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        if (originalPrice && discountPercent) {
            performCalculation(() => {
              startTransition(() => {
                  const result = calculateDiscount(originalPrice, discountPercent);
                  setDiscountResult(result);
              });
            });
        } else {
            startTransition(() => {
                setDiscountResult(null);
            });
        }
    }
  }, [originalPrice, discountPercent, isClient]);

  const handleDiscountReset = () => {
      setOriginalPrice(undefined);
      setDiscountPercent(undefined);
      setDiscountResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Item Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice" className="flex items-center gap-2"><Banknote className="h-5 w-5" />Original Price ($)</Label>
                            <Input id="originalPrice" type="number" value={originalPrice || ''} onChange={e => setOriginalPrice(parseFloat(e.target.value) || undefined)} placeholder="e.g., 299.99" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discountPercent" className="flex items-center gap-2"><Tag className="h-5 w-5" />Discount (%)</Label>
                            <Input id="discountPercent" type="number" value={discountPercent || ''} onChange={e => setDiscountPercent(parseFloat(e.target.value) || undefined)} placeholder="e.g., 25" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleDiscountReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <DiscountResultDisplay result={discountResult} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
