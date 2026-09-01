
'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Color from 'color';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type ColorResult = {
    hex: string;
    rgb: string;
    hsl: string;
};

const ColorResultDisplay = ({ result, onCopy }: { result: ColorResult | null, onCopy: (text: string) => void }) => {
    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Color conversions will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const colorFormats = [
        { label: 'HEX', value: result.hex },
        { label: 'RGB', value: result.rgb },
        { label: 'HSL', value: result.hsl },
    ];

    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Converted Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {colorFormats.map(format => (
                    <div key={format.label} className="space-y-1">
                        <Label className="text-sm font-semibold">{format.label}</Label>
                        <div className="flex items-center gap-2">
                            <Input readOnly value={format.value} className="bg-muted/50 font-mono" />
                            <Button variant="ghost" size="icon" onClick={() => onCopy(format.value)}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export function ColorConverter() {
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

  const [colorInput, setColorInput] = useState('#1E90FF');
  const [colorResult, setColorResult] = useState<ColorResult | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        performCalculation(() => {
          startTransition(() => {
              const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(colorInput);
              if (isValidHex) {
                  try {
                      const color = Color(colorInput);
                      setColorResult({
                          hex: color.hex(),
                          rgb: color.rgb().string(),
                          hsl: color.hsl().string(),
                      });
                  } catch (e) {
                      setColorResult(null);
                  }
              } else {
                  setColorResult(null);
              }
          });
        });
    }
  }, [colorInput, isClient]);

  const handleColorCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied to Clipboard!', description: `${text} has been copied.` });
  };
    
  const isValidColor = !!colorResult;
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter a Color</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="colorInput" className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Color (HEX)
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="colorInput"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    placeholder="#1E90FF"
                                    className={cn("font-mono", !isValidColor && "border-destructive focus-visible:ring-destructive")}
                                />
                                <div className="relative h-10 w-10 shrink-0">
                                    <div
                                        className="absolute inset-0 w-full h-full rounded-md border"
                                        style={{ backgroundColor: isValidColor ? colorInput : 'transparent' }}
                                    />
                                    <input
                                        type="color"
                                        value={isValidColor ? Color(colorInput).hex() : '#000000'}
                                        onChange={(e) => setColorInput(e.target.value)}
                                        className="h-full w-full cursor-pointer opacity-0"
                                        title="Select a color"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <ColorResultDisplay result={colorResult} onCopy={handleColorCopy} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
