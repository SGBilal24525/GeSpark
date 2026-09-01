
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import type { Tool } from '@/lib/tools';
import { Copy, Lightbulb, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { translateText, type TranslateTextOutput } from '@/ai/flows/language-translator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const LanguageTranslatorResultDisplay = ({ result, isPending, onCopy }: { result: TranslateTextOutput | null, isPending: boolean, onCopy: (text: string) => void }) => {
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
                    <p>Your translation will appear here.</p>
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
                           <Languages className="h-6 w-6 text-primary" />
                            Translated Text
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => onCopy(result.translatedText)} aria-label="Copy translation">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea value={result.translatedText} readOnly className="min-h-[150px] bg-muted/50 text-lg" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                     <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-400" />
                        AI Learning Mode
                    </CardTitle>
                    <CardDescription>Understand the context behind the translation.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export function LanguageTranslator({ tool }: { tool: Tool }) {
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

  const [sourceText, setSourceText] = useState('');
  const [translatorSourceLang, setTranslatorSourceLang] = useState('English');
  const [translatorTargetLang, setTranslatorTargetLang] = useState('Spanish');
  const [translatorResult, setTranslatorResult] = useState<TranslateTextOutput | null>(null);

  const handleTranslation = () => {
      if (!sourceText) {
          toast({ variant: "destructive", title: "Input Required", description: "Please enter text to translate." });
          return;
      }
      performCalculation(() => {
        startTransition(async () => {
            setTranslatorResult(null);
            try {
                const result = await translateText({ sourceText, sourceLanguage: translatorSourceLang, targetLanguage: translatorTargetLang });
                setTranslatorResult(result);
            } catch (error) {
                 console.error("Failed to translate:", error);
                toast({ variant: "destructive", title: "Translation Failed", description: "Could not translate the text. Please try again." });
            }
        });
      });
  };

  const handleTranslatorReset = () => {
      setSourceText('');
      setTranslatorResult(null);
  };

  const handleTranslationCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied to Clipboard!" });
  };
    
  const sourceLangOptions = tool.inputs.find(i => i.id === 'sourceLanguage')?.options || [];
  const targetLangOptions = tool.inputs.find(i => i.id === 'targetLanguage')?.options || [];
  
  return (
      <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card>
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Translate Text</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div className="space-y-2">
                              <Label htmlFor="translatorSourceLang">From</Label>
                              <Select value={translatorSourceLang} onValueChange={setTranslatorSourceLang}>
                                  <SelectTrigger id="translatorSourceLang"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {sourceLangOptions.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="space-y-2">
                              <Label htmlFor="translatorTargetLang">To</Label>
                              <Select value={translatorTargetLang} onValueChange={setTranslatorTargetLang}>
                                  <SelectTrigger id="translatorTargetLang"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {targetLangOptions.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="sourceText">Enter Text</Label>
                          <Textarea 
                              id="sourceText" 
                              value={sourceText}
                              onChange={e => setSourceText(e.target.value)}
                              placeholder="Hello, how are you?"
                              className="min-h-[200px]"
                          />
                      </div>
                      <Button onClick={handleTranslation} disabled={isPending} className="w-full">
                          {isPending ? 'Translating...' : 'Translate'}
                      </Button>
                  </CardContent>
                  <CardFooter>
                       <Button onClick={handleTranslatorReset} variant="outline" className="w-full">Reset</Button>
                  </CardFooter>
              </Card>
               <div className="sticky top-24">
                  <AnimatePresence>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                         <LanguageTranslatorResultDisplay result={translatorResult} isPending={isPending} onCopy={handleTranslationCopy} />
                      </motion.div>
                  </AnimatePresence>
              </div>
          </div>
      </div>
  );
}
