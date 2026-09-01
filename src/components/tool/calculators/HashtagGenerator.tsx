
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Copy, Lightbulb, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateHashtags, type GenerateHashtagsOutput } from '@/ai/flows/hashtag-generator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const HashtagResultDisplay = ({ result, isPending }: { result: GenerateHashtagsOutput | null, isPending: boolean }) => {
    const { toast } = useToast();

    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[400px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your generated hashtags will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const handleCopy = () => {
        const textToCopy = result.hashtags.join(' ');
        navigator.clipboard.writeText(textToCopy);
        toast({ title: "Hashtags Copied!", description: "All hashtags have been copied to your clipboard." });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 font-headline text-xl">
                           <Hash className="h-6 w-6 text-primary" />
                            Generated Hashtags
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy hashtags">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {result.hashtags.map((tag, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium cursor-pointer hover:bg-primary/20">
                                    {tag}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                        AI Strategy
                    </CardTitle>
                    <CardDescription>How these hashtags were chosen.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export function HashtagGenerator() {
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
  
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtagResult, setHashtagResult] = useState<GenerateHashtagsOutput | null>(null);

  const handleHashtagGeneration = () => {
      if (!hashtagInput) {
          toast({ variant: "destructive", title: "Input Required", description: "Please enter some text to generate hashtags." });
          return;
      }
      performCalculation(() => {
        startTransition(async () => {
            setHashtagResult(null);
            try {
                const result = await generateHashtags({ text: hashtagInput });
                setHashtagResult(result);
            } catch (error) {
                console.error("Failed to generate hashtags:", error);
                toast({ variant: "destructive", title: "Generation Failed", description: "The AI could not generate hashtags. Please try again." });
            }
        });
      });
  };
  
  const handleHashtagReset = () => {
      setHashtagInput('');
      setHashtagResult(null);
  };

    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">AI Hashtag Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="hashtag-input">Post Content or Topic</Label>
                            <Textarea 
                                id="hashtag-input" 
                                value={hashtagInput}
                                onChange={e => setHashtagInput(e.target.value)}
                                placeholder="e.g., Just finished a great workout at the gym and feeling amazing!"
                                className="min-h-[250px]"
                            />
                        </div>
                        <Button onClick={handleHashtagGeneration} disabled={isPending} className="w-full">
                            {isPending ? 'Generating...' : 'Generate Hashtags'}
                        </Button>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleHashtagReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                 <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                           <HashtagResultDisplay result={hashtagResult} isPending={isPending} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
