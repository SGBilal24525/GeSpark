
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { tools, type Tool } from '@/lib/tools';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredTools = tools.filter((tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredTools);
  }, [searchQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-9 p-0"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search tools</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Tools</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a calculator or converter..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px]">
            {searchResults.length > 0 ? (
              <div className="space-y-2 py-2">
                {searchResults.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="block rounded-md p-2 hover:bg-accent"
                    onClick={handleLinkClick}
                  >
                    <p className="font-semibold">{tool.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              searchQuery.trim() && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              )
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
