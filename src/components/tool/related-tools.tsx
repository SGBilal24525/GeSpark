import { ToolCard } from '@/components/tool-card';
import type { tools } from '@/lib/tools';

type RelatedToolsProps = {
  relatedTools: (typeof tools);
};

export function RelatedTools({ relatedTools }: RelatedToolsProps) {
  if (relatedTools.length === 0) return null;

  return (
    <section className="bg-gray-50/50 dark:bg-gray-900/20 py-16 px-8 -mx-8 mt-16">
        <div className="container mx-auto">
            <h2 className="mb-10 text-center font-headline text-2xl font-bold">Related Tools</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                ))}
            </div>
        </div>
    </section>
  );
}
