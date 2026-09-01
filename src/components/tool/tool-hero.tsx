
'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import type { Tool } from '@/lib/tools';
import { useToast } from '@/hooks/use-toast';
import { getIconForTool } from '@/lib/icons';

type ToolHeroProps = {
  tool: Tool;
};

export function ToolHero({ tool }: ToolHeroProps) {
    const { toast } = useToast();
    const Icon = getIconForTool(tool.slug);
    
    const shareTool = () => {
        if (navigator.share) {
            navigator.share({
                title: `${tool.name} on GeSpark`,
                text: `Check out this ${tool.name} on GeSpark!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
             navigator.clipboard.writeText(window.location.href);
             toast({ title: "Link Copied!", description: "Tool URL copied to your clipboard." });
        }
    }

  return (
    <section className="relative mx-auto mt-4 max-w-screen-md py-16 text-center">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={shareTool}>
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share Tool</span>
        </Button>
      </div>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
        {tool.name === 'Age Calculator' ? 'Age Calculator — Calculate Your Exact Age in Seconds' : tool.name}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {tool.slug === 'age-calculator' ? 'Find your exact age in years, months, weeks, days, hours, minutes, and seconds — powered by our personal AI engine.' : tool.description}
      </p>
    </section>
  );
}
