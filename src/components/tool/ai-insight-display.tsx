
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { generateToolInsight } from '@/ai/flows/generate-tool-insight';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export const AiInsightDisplay = ({ toolName }: { toolName: string }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchInsight = () => {
    startTransition(async () => {
      setInsight(null);
      try {
        const result = await generateToolInsight({ toolName });
        setInsight(result.insight);
      } catch (error) {
        console.error("Failed to generate AI insight:", error);
        setInsight("Could not load an insight at this time. Please try again later.");
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        {!insight && !isPending && (
          <Button onClick={fetchInsight} disabled={isPending} className="w-full">
            Generate Explanation
          </Button>
        )}
        {insight && (
          <Button variant="ghost" size="sm" onClick={fetchInsight} disabled={isPending} className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className={cn('h-4 w-4', isPending && 'animate-spin')} />
            Regenerate
          </Button>
        )}
      </div>

      <div className="prose prose-sm dark:prose-invert text-muted-foreground mt-4">
        {isPending ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : (
          insight && (
            <ul>
              {insight.split('\n').filter(line => line.startsWith('* ')).map((line, index) => (
                <li key={index}>{line.substring(2)}</li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
};
