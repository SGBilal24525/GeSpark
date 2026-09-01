
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Copy, Upload, Mic, Download, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStory, type GenerateStoryOutput } from '@/ai/flows/story-generator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';

const StoryResultDisplay = ({ result, isPending }: { result: GenerateStoryOutput | null, isPending: boolean }) => {
    if (isPending) {
        return <Skeleton className="h-64 w-full" />;
    }

    if (!result) {
        return (
            <Card className="rounded-2xl flex items-center justify-center h-full min-h-[400px] border-dashed">
                <div className="text-center text-muted-foreground">
                    <p>Your transcribed text will appear here.</p>
                </div>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transcription Result</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea value={result.story} readOnly className="min-h-[300px] bg-muted/50" />
                 <div className="flex gap-2 mt-4">
                    <Button variant="outline"><Copy className="mr-2 h-4 w-4" /> Copy</Button>
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export function StoryGenerator() {
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

  const [storyPrompt, setStoryPrompt] = useState('');
  const [storyResult, setStoryResult] = useState<GenerateStoryOutput | null>(null);

  const handleStoryGeneration = () => {
      if (!storyPrompt) {
          toast({ variant: "destructive", title: "Input Required", description: "Please enter a prompt to generate a story." });
          return;
      }
      performCalculation(() => {
        startTransition(async () => {
            setStoryResult(null);
            try {
                const result = await generateStory({ prompt: storyPrompt });
                setStoryResult(result);
            } catch (error) {
                console.error("Failed to generate story:", error);
                toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate a story. Please try again." });
            }
        });
      });
  };
    
    return (
        <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">AI Story Generator</CardTitle>
                        <p className="text-sm text-muted-foreground">This is a placeholder for the Voice-to-Text converter. Enter a prompt to generate a story.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="story-prompt">Enter a prompt</Label>
                            <Textarea 
                                id="story-prompt"
                                value={storyPrompt}
                                onChange={(e) => setStoryPrompt(e.target.value)}
                                placeholder="e.g., A lost astronaut on a colorful planet..."
                                className="min-h-[150px]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleStoryGeneration} disabled={isPending} className="w-full">
                                {isPending ? 'Generating...' : <><Mic className="mr-2 h-4 w-4" /> Start Recording</>}
                            </Button>
                            <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
                        </div>
                         <div className="rounded-lg bg-muted p-4 mt-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>00:00</span>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    <span>Recording...</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" disabled><Pause className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" disabled><Play className="h-4 w-4" /></Button>
                                </div>
                            </div>
                            <div className="h-20 w-full bg-background/50 mt-2 flex items-center justify-center text-xs text-muted-foreground rounded-md">
                                Waveform Placeholder
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="sticky top-24">
                     <AnimatePresence>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <StoryResultDisplay result={storyResult} isPending={isPending} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
