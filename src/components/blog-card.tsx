
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

type BlogPost = Tool & {
    blogTitle: string;
    blogDescription: string;
    blogImage: string;
    blogImageHint: string;
    blogSlug: string;
};

type BlogCardProps = {
    post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Card key={post.slug} className="group flex flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <div className="overflow-hidden">
                <Image
                    src={post.blogImage}
                    alt={post.blogTitle}
                    data-ai-hint={post.blogImageHint}
                    width={600}
                    height={400}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            </div>
            <CardHeader>
                <CardDescription className="font-semibold text-primary">{post.category}</CardDescription>
                <CardTitle>{post.blogTitle}</CardTitle>
                <CardDescription className="pt-2 text-muted-foreground line-clamp-3">{post.blogDescription}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex justify-end">
                <Button asChild variant="link" className="p-0 text-primary">
                <Link href={`/blog/${post.blogSlug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
