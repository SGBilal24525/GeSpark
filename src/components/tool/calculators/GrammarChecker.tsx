
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Copy, Lightbulb, FileSignature } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { checkGrammar, type GrammarCheckOutput } from '@/ai/flows/grammar-checker';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const GrammarCheckerResultDisplay = ({ result, isPending }: { result: GrammarCheckOutput | null, isPending: boolean }) => {
    const { toast } = useToast();

    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[400px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your corrected text will appear here.</p>
                </div>
            </Card>
        );
    }
    
    const handleCopy = (text: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            toast({ title: "Text Copied!", description: "The corrected text has been copied to your clipboard." });
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 font-headline text-xl">
                           <FileSignature className="h-6 w-6 text-primary" />
                            Corrected Text
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(result.correctedText)} aria-label="Copy code">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea value={result.correctedText} readOnly className="min-h-[150px] bg-muted/50" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                        AI Explanation
                    </CardTitle>
                    <CardDescription>Understand why the changes were made.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Error Type</TableHead>
                                <TableHead>Original</TableHead>
                                <TableHead>Suggested Fix</TableHead>
                                <TableHead>Explanation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.errors.map((error, index) => (
                                <TableRow key={index}>
                                    <TableCell><span className="font-semibold">{error.errorType}</span></TableCell>
                                    <TableCell><span className="text-destructive line-through">{error.original}</span></TableCell>
                                    <TableCell><span className="text-green-600">{error.suggestedFix}</span></TableCell>
                                    <TableCell>{error.explanation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export function GrammarChecker() {
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

  const [grammarInput, setGrammarInput] = useState('');
  const [grammarResult, setGrammarResult] = useState<GrammarCheckOutput | null>(null);

  const handleGrammarCheck = () => {
      if (!grammarInput) {
          toast({
              variant: "destructive",
              title: "No Text Provided",
              description: "Please enter some text to check.",
          });
          return;
      }

      performCalculation(() => {
        startTransition(async () => {
            setGrammarResult(null);
            try {
                const result = await checkGrammar({ text: grammarInput });
                setGrammarResult(result);
            } catch (error) {
                console.error("Failed to check grammar:", error);
                toast({
                    variant: "destructive",
                    title: "Check Failed",
                    description: "The AI could not process the text. Please try again.",
                });
            }
        });
      });
  };

  const handleGrammarReset = () => {
      setGrammarInput('');
      setGrammarResult(null);
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Check Your Text</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="grammar-input">Paste or type your text here</Label>
                            <Textarea 
                                id="grammar-input" 
                                value={grammarInput}
                                onChange={e => setGrammarInput(e.target.value)}
                                placeholder="She go to school every day."
                                className="min-h-[250px]"
                            />
                        </div>
                        <Button onClick={handleGrammarCheck} disabled={isPending} className="w-full">
                            {isPending ? 'Checking...' : 'Check Grammar'}
                        </Button>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleGrammarReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                 <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                           <GrammarCheckerResultDisplay result={grammarResult} isPending={isPending} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
