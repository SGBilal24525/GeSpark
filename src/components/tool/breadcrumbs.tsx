
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { tools } from '@/lib/tools';

type BreadcrumbsProps = {
  tool: (typeof tools)[number];
};

export function Breadcrumbs({ tool }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground pt-8">
      <Link href="/" className="hover:text-secondary">Home</Link>
      <ChevronRight className="mx-2 h-4 w-4" />
      <Link href="/tools" className="hover:text-secondary">Tools</Link>
      <ChevronRight className="mx-2 h-4 w-4" />
      <span className="font-medium text-foreground">{tool.name}</span>
    </nav>
  );
}
