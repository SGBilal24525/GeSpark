
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tools } from '@/lib/tools';
import { ToolCard } from '@/components/tool-card';
import { useState } from 'react';
import { motion } from 'framer-motion';

const AdSlotPlaceholder = () => (
  <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-8 text-center text-gray-400 dark:border-gray-700">
    <p className="font-medium">Advertisement / Sponsor Space</p>
  </div>
);

export function ToolsSection() {
  const calculators = tools.filter((tool) => tool.category === 'Calculators');
  const converters = tools.filter((tool) => tool.category === 'Converters');
  const [activeTab, setActiveTab] = useState('calculators');

  const renderToolsWithAds = (toolList: typeof tools) => {
    const items = [];
    for (let i = 0; i < toolList.length; i++) {
      items.push(<ToolCard key={toolList[i].slug} tool={toolList[i]} />);
      if ((i + 1) > 0 && (i + 1) % 8 === 0) {
        items.push(<AdSlotPlaceholder key={`ad-${i}`} />);
      }
    }
    return items;
  };

  return (
    <section id="tools" className="container mx-auto px-8 py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          Explore Our Tools
        </h2>
      </div>

      <Tabs defaultValue="calculators" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mx-auto mb-12 grid w-full max-w-md grid-cols-2 bg-transparent p-0">
          <TabsTrigger value="calculators" className="relative data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground">
            Calculators
            {activeTab === 'calculators' && (
              <motion.div layoutId="active-tab-underline" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </TabsTrigger>
          <TabsTrigger value="converters" className="relative data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground">
            Converters
            {activeTab === 'converters' && (
              <motion.div layoutId="active-tab-underline" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="calculators">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderToolsWithAds(calculators)}
          </div>
        </TabsContent>
        <TabsContent value="converters">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {renderToolsWithAds(converters)}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
