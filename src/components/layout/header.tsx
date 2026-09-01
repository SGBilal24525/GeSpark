
"use client";

import Link from 'next/link';
import { ArrowLeft, Menu, Sparkles, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn, formatSlug } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchDialog } from './search-dialog';
import { useAuth } from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'Tools' },
  { href: '/how-it-works', label: 'How it Works' },
  { href: '/features', label: 'Features' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const closeSheet = () => setSheetOpen(false);

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  const isToolPage = pathname.startsWith('/tools/') && pathname.length > '/tools/'.length;
  const slug = isToolPage ? pathname.split('/').pop() : '';
  const toolName = slug ? formatSlug(slug) : '';

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-border/40 bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <div className="container mx-auto flex h-full max-w-screen-xl items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <span className="text-2xl font-extrabold font-headline">
              GeSpark
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
            {isToolPage ? (
              <h1 className="text-lg font-semibold text-foreground">{toolName}</h1>
            ) : (
              <nav className="hidden gap-8 text-sm md:flex">
                  {navLinks.map((link) => (
                      <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                          "font-medium text-foreground/70 transition-colors hover:text-secondary",
                          pathname === link.href && "text-foreground"
                      )}
                      >
                      {link.label}
                      </Link>
                  ))}
              </nav>
            )}
        </div>


        <div className="flex items-center justify-end space-x-2">
          <SearchDialog />
          <ThemeToggle />
          {user ? (
             <Button variant="ghost" onClick={handleLogout} className="hidden rounded-full sm:inline-flex">
               <LogOut className="mr-2 h-4 w-4" /> Logout
             </Button>
          ) : (
            isToolPage ? (
              <Button variant="ghost" asChild className="hidden rounded-full sm:inline-flex">
                <Link href="/tools"><ArrowLeft className="mr-2 h-4 w-4" /> All Tools</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden rounded-full sm:inline-flex">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="hidden rounded-full sm:inline-flex">
                  <Link href="/signup">Try Free Tools</Link>
                </Button>
              </>
            )
          )}

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-full w-full p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-[72px] items-center justify-between border-b px-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                    <Sparkles className="h-7 w-7 text-primary" />
                    <span className="text-2xl font-extrabold font-headline">GeSpark</span>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close Menu</span>
                    </Button>
                  </SheetTrigger>
                </div>
                <div className="flex flex-grow flex-col items-center justify-center gap-8">
                    <nav className="flex flex-col items-center gap-6">
                    {isToolPage ? (
                      <Link href="/tools" className="text-2xl font-medium" onClick={closeSheet}>
                        <ArrowLeft className="mr-2 inline h-6 w-6" /> All Tools
                      </Link>
                    ) : (
                      navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                              "text-2xl font-medium text-foreground/80 transition-colors hover:text-secondary",
                              pathname === link.href && "text-foreground"
                          )}
                          onClick={closeSheet}
                          >
                          {link.label}
                        </Link>
                      ))
                    )}
                    </nav>
                    {!isToolPage && (
                      <div className="flex flex-col gap-4 w-full max-w-xs">
                          {user ? (
                             <Button onClick={() => { handleLogout(); closeSheet(); }} size="lg" className="rounded-full">
                               <LogOut className="mr-2 h-5 w-5" /> Logout
                             </Button>
                          ) : (
                            <>
                              <Button asChild size="lg" className="rounded-full">
                                  <Link href="/signup" onClick={closeSheet}>Try Free Tools</Link>
                              </Button>
                              <Button variant="outline" asChild size="lg" className="rounded-full">
                                  <Link href="/login" onClick={closeSheet}>Login</Link>
                              </Button>
                            </>
                          )}
                      </div>
                    )}
                    <div className="absolute bottom-8">
                      <ThemeToggle />
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
