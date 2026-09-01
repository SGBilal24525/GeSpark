
"use client";

import Link from 'next/link';
import { Sparkles, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const PinterestIcon = () => (
    <span className="font-bold text-lg h-5 w-5 flex items-center justify-center">P</span>
  );

  return (
    <footer className="relative mt-16 overflow-hidden rounded-t-3xl border-t border-white/10 bg-opacity-60 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 text-gray-800 shadow-[0_-8px_20px_rgba(0,0,0,0.1)] backdrop-blur-lg dark:from-gray-900/70 dark:via-purple-900/70 dark:to-indigo-950/70 dark:text-gray-200">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)]"></div>
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
                {/* About Column */}
                <div className="space-y-4">
                <Link href="/" className="inline-flex items-center justify-center space-x-2 md:justify-start">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold font-headline text-gray-900 dark:text-white">GeSpark</span>
                </Link>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    Your smart AI companion for all calculators, converters, and productivity tools — designed to make complex tasks simple.
                </p>
                <div className="flex items-center justify-center space-x-4 md:justify-start">
                    <a href="https://web.facebook.com/gepardweb/" aria-label="Facebook" className="text-gray-500 transition-transform duration-300 hover:scale-125 hover:text-primary" target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-5 w-5" />
                    </a>
                    <a href="https://www.instagram.com/gepardweb/" aria-label="Instagram" className="text-gray-500 transition-transform duration-300 hover:scale-125 hover:text-primary" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a href="https://www.pinterest.com/gepardwebs/" aria-label="Pinterest" className="text-gray-500 transition-transform duration-300 hover:scale-125 hover:text-primary" target="_blank" rel="noopener noreferrer">
                        <PinterestIcon />
                    </a>
                </div>
                </div>

                {/* Quick Links Column */}
                <div>
                <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-gray-900 dark:text-white">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Home</Link></li>
                    <li><Link href="/tools" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Tools</Link></li>
                    <li><Link href="/how-it-works" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">How it Works</Link></li>
                    <li><Link href="/features" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Features</Link></li>
                </ul>
                </div>

                {/* Support Column */}
                <div>
                <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-gray-900 dark:text-white">Support</h3>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/blog" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Blogs</Link></li>
                    <li><Link href="/about" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">About</Link></li>
                    <li><Link href="/contact" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Contact</Link></li>
                </ul>
                </div>

                {/* Legal Column */}
                <div>
                <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-gray-900 dark:text-white">Legal</h3>
                <ul className="space-y-3 text-sm">
                    <li><Link href="/terms" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Terms & Conditions</Link></li>
                    <li><Link href="/privacy-policy" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Privacy Policy</Link></li>
                    <li><Link href="/refund-policy" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Refund Policy</Link></li>
                    <li><Link href="/disclaimer" className="relative inline-block text-muted-foreground after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-secondary after:transition-all after:duration-300 hover:text-foreground hover:after:w-full">Disclaimer</Link></li>
                </ul>
                </div>
            </div>

            <div className="mt-12 space-y-6 text-center">
                <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transition-transform duration-300 hover:scale-105 dark:from-purple-600 dark:to-blue-600">
                    <Link href="/signup">Join Waitlist</Link>
                </Button>
            </div>
            
            {/* Copyright Bar */}
            <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-muted-foreground">
                <span>© {year || new Date().getFullYear()} <span className="font-semibold text-gray-700 dark:text-gray-300">GeSpark</span>. All rights reserved.</span>
                <span className="mx-2">|</span>
                <span className="transition-opacity duration-300 hover:opacity-70">Powered by <a href="https://gepardtech.com" target="_blank" rel="noopener" className="font-semibold text-primary hover:underline">
                Gepard Tech
                </a>.</span>
            </div>
        </div>
    </footer>
  );
}
