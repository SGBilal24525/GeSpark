import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { tools, type Tool } from '@/lib/tools';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getToolBySlug = (slug: string): Tool | undefined => {
  return tools.find((tool) => tool.slug === slug);
};

export const formatSlug = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
