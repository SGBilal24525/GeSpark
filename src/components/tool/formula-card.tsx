
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Tool } from "@/lib/tools";

type FormulaCardProps = {
    formula: NonNullable<Tool['formula']>;
}

export function FormulaCard({ formula }: FormulaCardProps) {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Formula
                </CardTitle>
                <CardDescription>The math behind this calculator.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 rounded-md bg-muted p-4 text-center font-mono text-sm text-foreground">
                    {formula.string}
                </div>
                <div className="space-y-2 text-sm">
                    <h4 className="font-semibold">Where:</h4>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                        {Object.entries(formula.variables).map(([key, value]) => (
                            <li key={key}>
                                <span className="font-mono font-semibold text-foreground">{key}</span>: {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
