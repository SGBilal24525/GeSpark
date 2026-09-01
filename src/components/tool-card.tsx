
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Tool } from '@/lib/tools';
import { getIconForTool } from '@/lib/icons';

type ToolCardProps = {
  tool: Tool;
  className?: string;
};

export function ToolCard({ tool, className }: ToolCardProps) {
  const Icon = getIconForTool(tool.slug);
  return (
    <Card className={cn("group flex flex-col rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl", className)}>
      <CardHeader className="flex-row items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-secondary/10">
          <Icon className="h-7 w-7 text-primary transition-colors group-hover:text-secondary" />
        </div>
        <CardTitle className="flex-1 text-lg font-bold">{tool.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <CardDescription className="line-clamp-2">{tool.description}</CardDescription>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Button asChild variant="outline" className="group w-full rounded-full">
          <Link href={`/tools/${tool.slug}`}>
            Use Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
