import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Search, Calculator } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
          How GeSpark Works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A simple, intuitive process to get the calculations and conversions you need in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">1. Find Your Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Browse our categories or use the search bar to quickly find the calculator or converter you need.</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Calculator className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">2. Input Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Enter your numbers into the clearly labeled fields. Our intuitive forms guide you through the process.</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">3. Get Instant Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your results are calculated instantly and displayed clearly. No waiting, no complicated steps.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
