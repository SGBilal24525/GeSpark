
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Copy, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { convertEmoji, type EmojiConverterOutput } from '@/ai/flows/emoji-converter';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const EmojiConverterResultDisplay = ({ result, isPending, onCopy }: { result: EmojiConverterOutput | null, isPending: boolean, onCopy: (text: string) => void }) => {
    if (isPending) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[300px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your conversion will appear here.</p>
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
                            Converted Output
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => onCopy(result.convertedText)} aria-label="Copy translation">
                            <Copy className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Textarea value={result.convertedText} readOnly className="min-h-[100px] bg-muted/50 text-lg" />
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
                     <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.explanation}</p>
                </CardContent>
            </Card>
        </div>
    );
};

export function EmojiConverter() {
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

  const [emojiInput, setEmojiInput] = useState('');
  const [emojiMode, setEmojiMode] = useState<'toText' | 'toEmoji'>('toEmoji');
  const [emojiResult, setEmojiResult] = useState<EmojiConverterOutput | null>(null);

  const handleEmojiConversion = () => {
      if (!emojiInput) {
          toast({ variant: "destructive", title: "Input Required", description: "Please enter some text or emojis to convert." });
          return;
      }
      performCalculation(() => {
        startTransition(async () => {
            setEmojiResult(null);
            try {
                const result = await convertEmoji({ text: emojiInput, mode: emojiMode });
                setEmojiResult(result);
            } catch (error) {
                console.error("Failed to convert emoji/text:", error);
                toast({ variant: "destructive", title: "Conversion Failed", description: "The AI could not process your input. Please try again." });
            }
        });
      });
  };

  const handleEmojiReset = () => {
      setEmojiInput('');
      setEmojiResult(null);
  };

  const handleEmojiCopy = (text: string) => {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied to Clipboard!" });
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Emoji ↔ Text Converter</CardTitle>
                        <Tabs defaultValue="toEmoji" onValueChange={(val) => setEmojiMode(val as any)} className="w-full pt-4">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="toEmoji">Text to Emoji</TabsTrigger>
                                <TabsTrigger value="toText">Emoji to Text</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="emoji-input">
                                {emojiMode === 'toEmoji' ? 'Enter your message' : 'Paste or type emojis'}
                            </Label>
                            <Textarea 
                                id="emoji-input" 
                                value={emojiInput}
                                onChange={e => setEmojiInput(e.target.value)}
                                placeholder={emojiMode === 'toEmoji' ? "e.g., I'm feeling awesome!" : "e.g., 😂❤️🔥"}
                                className="min-h-[200px]"
                            />
                        </div>
                        <Button onClick={handleEmojiConversion} disabled={isPending} className="w-full">
                            {isPending ? 'Converting...' : 'Convert'}
                        </Button>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleEmojiReset} variant="outline" className="w-full">Reset</Button>
                    </CardFooter>
                </Card>
                 <div className="sticky top-24">
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                           <EmojiConverterResultDisplay result={emojiResult} isPending={isPending} onCopy={handleEmojiCopy} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
