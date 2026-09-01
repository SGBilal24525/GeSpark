
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

type CaseConversionResult = {
    convertedText: string;
    stats: {
        words: number;
        chars: number;
    }
}

const TextCaseResultDisplay = ({ result, onCopy, onReset }: { result: CaseConversionResult | null, onCopy: () => void, onReset: () => void }) => {
    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your converted text will appear here.</p>
                </div>
            </Card>
        );
    }
    return (
        <Card className="rounded-2xl shadow-md w-full h-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline text-2xl">Converted Text</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onCopy}><Copy className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" onClick={onReset}><RotateCcw className="h-5 w-5" /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Textarea value={result.convertedText} readOnly className="min-h-[200px]" />
                <div className="mt-4 text-sm text-muted-foreground flex justify-end gap-4">
                    <span>{result.stats.chars} Characters</span>
                    <span>{result.stats.words} Words</span>
                </div>
            </CardContent>
        </Card>
    );
}

export function TextCaseConverter() {
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

  const [textInput, setTextInput] = useState('');
  const [textCaseResult, setTextCaseResult] = useState<CaseConversionResult | null>(null);

  const handleTextCaseConversion = (caseType: string) => {
      if (!textInput) return;

      performCalculation(() => {
        let convertedText = '';
        switch (caseType) {
            case 'uppercase':
                convertedText = textInput.toUpperCase();
                break;
            case 'lowercase':
                convertedText = textInput.toLowerCase();
                break;
            case 'titlecase':
                convertedText = textInput.toLowerCase().replace(/(^|\s)\S/g, (L) => L.toUpperCase());
                break;
            case 'sentencecase':
                convertedText = textInput.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'capitalizedcase':
                convertedText = textInput.replace(/\b\w/g, char => char.toUpperCase());
                break;
            case 'alternatingcase':
                convertedText = textInput.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
                break;
            default:
                convertedText = textInput;
        }
        
        startTransition(() => {
            setTextCaseResult({
                convertedText,
                stats: {
                    words: textInput.trim().split(/\s+/).filter(Boolean).length,
                    chars: textInput.length,
                }
            });
        });
      });
  };

  const handleTextCaseReset = () => {
      startTransition(() => {
          setTextInput('');
          setTextCaseResult(null);
      });
  };
  
  const handleTextCaseCopy = () => {
      if (textCaseResult) {
          navigator.clipboard.writeText(textCaseResult.convertedText);
          toast({ title: "Copied to Clipboard!" });
      }
  };

  const caseButtons = [
    { label: 'UPPERCASE', caseType: 'uppercase' },
    { label: 'lowercase', caseType: 'lowercase' },
    { label: 'Title Case', caseType: 'titlecase' },
    { label: 'Sentence case', caseType: 'sentencecase' },
    { label: 'Capitalized Case', caseType: 'capitalizedcase' },
    { label: 'aLtErNaTiNg cAsE', caseType: 'alternatingcase' },
  ];
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Enter Text</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type or paste your text here..."
                            className="min-h-[300px]"
                        />
                        <div className="mt-4 flex flex-wrap gap-2">
                            {caseButtons.map(btn => (
                                <Button key={btn.caseType} variant="outline" size="sm" onClick={() => handleTextCaseConversion(btn.caseType)}>
                                    {btn.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                             <TextCaseResultDisplay result={textCaseResult} onCopy={handleTextCaseCopy} onReset={handleTextCaseReset} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
