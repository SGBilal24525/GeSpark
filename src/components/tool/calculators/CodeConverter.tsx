
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import type { Tool } from '@/lib/tools';
import { Copy, Lightbulb, Code, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { convertCode, type ConvertCodeOutput } from '@/ai/flows/code-converter';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const CodeConverterResultDisplay = ({ result, isPending, onCopy }: { result: ConvertCodeOutput | null, isPending: boolean, onCopy: (text: string) => void }) => {

    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[400px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your converted code will appear here.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 font-headline text-xl">
                            <Code className="h-6 w-6 text-primary" />
                            Converted Code
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => onCopy(result.convertedCode)} aria-label="Copy code">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code>{result.convertedCode}</code></pre>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <BookOpen className="h-6 w-6 text-primary" />
                        Syntax Comparison
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.syntaxComparison.replace(/\|/g, ' | ') }} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                        AI Explanation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export function CodeConverter({ tool }: { tool: Tool }) {
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

  const [sourceCode, setSourceCode] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Python');
  const [targetLanguage, setTargetLanguage] = useState('JavaScript');
  const [codeConverterResult, setCodeConverterResult] = useState<ConvertCodeOutput | null>(null);

  const handleCodeConversion = () => {
    if (!sourceCode || !sourceLanguage || !targetLanguage) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select both languages and enter some code to convert.",
        });
        return;
    }

    performCalculation(() => {
      startTransition(async () => {
          setCodeConverterResult(null);
          try {
              const result = await convertCode({ sourceCode, sourceLanguage, targetLanguage });
              setCodeConverterResult(result);
          } catch (error) {
              console.error("Failed to convert code:", error);
              toast({
                  variant: "destructive",
                  title: "Conversion Failed",
                  description: "The AI could not convert the code. Please try again.",
              });
          }
      });
    });
  };

  const handleCodeCopy = (text: string) => {
    if (text) {
        navigator.clipboard.writeText(text);
        toast({ title: "Code Copied!", description: "The converted code has been copied to your clipboard." });
    }
  };

  const handleCodeReset = () => {
      setSourceCode('');
      setCodeConverterResult(null);
  };
    
  const languageOptions = tool.inputs.find(i => i.id === 'sourceLanguage')?.options || [];

  return (
      <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Convert Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="sourceLanguage">From</Label>
                              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                                  <SelectTrigger id="sourceLanguage"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {languageOptions.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="targetLanguage">To</Label>
                              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                                  <SelectTrigger id="targetLanguage"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {languageOptions.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="sourceCode">Source Code</Label>
                          <Textarea 
                              id="sourceCode" 
                              value={sourceCode}
                              onChange={e => setSourceCode(e.target.value)}
                              placeholder="print('Hello, World!')"
                              className="min-h-[200px] font-mono text-sm"
                          />
                      </div>
                      <Button onClick={handleCodeConversion} disabled={isPending} className="w-full">
                          {isPending ? 'Converting...' : 'Convert Code'}
                      </Button>
                  </CardContent>
                  <CardFooter>
                       <Button onClick={handleCodeReset} variant="outline" className="w-full">Reset</Button>
                  </CardFooter>
              </Card>
               <div className="sticky top-24">
                  <AnimatePresence>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                         <CodeConverterResultDisplay result={codeConverterResult} isPending={isPending} onCopy={handleCodeCopy} />
                      </motion.div>
                  </AnimatePresence>
              </div>
          </div>
      </div>
  );
}
