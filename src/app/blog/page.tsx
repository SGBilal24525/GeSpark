
'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { tools } from '@/lib/tools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogCard } from '@/components/blog-card';

const AdSlotPlaceholder = () => (
  <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-card py-8 text-center text-gray-400 dark:border-gray-700">
    <p className="font-medium">Advertisement / Sponsor Space</p>
  </div>
);

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('calculators');
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = useMemo(() => tools.map(tool => {
    let title = `How the ${tool.name} Works: A Complete Guide`;
    let description = `A deep dive into the functionality of our ${tool.name}, explaining its features and use cases.`;
    let image = `https://picsum.photos/seed/${tool.slug}/600/400`;
    let imageHint = `${tool.name.toLowerCase().split(' ')[0]} illustration`;
    
    if (tool.slug === 'age-calculator') {
        title = "How Our Professional Age Calculator Works — The Complete Guide";
        description = "A deep dive into the technology behind our real-time, AI-powered Age Calculator.";
        image = "https://images.unsplash.com/photo-1711344397160-b23d5deaa012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxjYWxjdWxhdG9yfGVufDB8fHx8MTc2MjE5NzkzNXww&ixlib=rb-4.1.0&q=80&w=1080";
        imageHint = "time passing illustration";
    } else if (tool.slug === 'bmi-calculator') {
        title = "BMI Calculator — Understand Your Body Mass Index and Ideal Weight";
        description = "A comprehensive guide to understanding BMI, how it's calculated, and what it means for your health.";
        image = "https://images.unsplash.com/photo-1650562373852-04c5682ec2e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8Ym9keSUyMG1hc3N8ZW58MHx8fHwxNzYyMTk4MDM5fDA&ixlib=rb-4.1.0&q=80&w=1080";
        imageHint = "health wellness graphic";
    } else if (tool.slug === 'adsense-earning-calculator') {
        title = "How to Calculate AdSense Earnings Accurately (2025 Guide)";
        description = "Learn the formula for calculating AdSense revenue and how to maximize your earnings.";
        image = "https://images.unsplash.com/photo-1622782914767-404fb9ab3f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhZHN8ZW58MHx8fHwxNzYyMTk4MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080";
        imageHint = "digital earning chart";
    }

    return {
      ...tool,
      blogTitle: title,
      blogDescription: description,
      blogImage: image,
      blogImageHint: imageHint,
      blogSlug: tool.blogSlug || `how-${tool.slug}-works`,
    }
  }), []);
  
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => 
      post.blogTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.blogDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [blogPosts, searchQuery]);

  const calculators = useMemo(() => filteredPosts.filter(post => post.category === 'Calculators'), [filteredPosts]);
  const converters = useMemo(() => filteredPosts.filter(post => post.category === 'Converters'), [filteredPosts]);

  const renderPostsWithAds = (postList: typeof filteredPosts) => {
    const items = [];
    for (let i = 0; i < postList.length; i++) {
      items.push(<BlogCard key={postList[i].slug} post={postList[i]} />);
      if ((i + 1) > 0 && (i + 1) % 4 === 0) {
        items.push(<AdSlotPlaceholder key={`ad-${i}`} />);
      }
    }
    return items;
  };

  return (
    <div className="container mx-auto px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">
          Learn, Explore, and Master Smart Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          From AI Calculators to Smart Converters — read how each one works and how it helps you in real life.
        </p>
        <div className="relative mx-auto mt-8 max-w-lg">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search blogs by title or keyword..."
            className="h-12 rounded-full pl-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="calculators" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mx-auto mb-12 grid w-full max-w-md grid-cols-2 bg-transparent p-0">
          <TabsTrigger value="calculators" className="relative data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground">
            Calculators
            {activeTab === 'calculators' && (
              <motion.div layoutId="active-tab-underline-blog" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </TabsTrigger>
          <TabsTrigger value="converters" className="relative data-[state=active]:bg-transparent data-[state=inactive]:text-muted-foreground">
            Converters
            {activeTab === 'converters' && (
              <motion.div layoutId="active-tab-underline-blog" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary" />
            )}
          </TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="calculators" forceMount={activeTab === 'calculators'}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {renderPostsWithAds(calculators)}
                </div>
            </TabsContent>
            <TabsContent value="converters" forceMount={activeTab === 'converters'}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {renderPostsWithAds(converters)}
                </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      {filteredPosts.length === 0 && searchQuery && (
        <div className="py-16 text-center text-muted-foreground">
            <h3 className="text-xl font-semibold">No Results Found</h3>
            <p>Your search for "{searchQuery}" did not match any blog posts.</p>
        </div>
      )}
    </div>
  );
}
