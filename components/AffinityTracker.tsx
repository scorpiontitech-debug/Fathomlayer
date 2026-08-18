"use client";

import { useEffect } from 'react';
import { useAffinityStore } from '@/store/useAffinityStore';

interface AffinityTrackerProps {
  categorySlug: string;
  weight?: number;
}

export function AffinityTracker({ categorySlug, weight = 1 }: AffinityTrackerProps) {
  const incrementAffinity = useAffinityStore((state) => state.incrementAffinity);

  useEffect(() => {
    if (categorySlug) {
      incrementAffinity(categorySlug, weight);
    }
  }, [categorySlug, weight, incrementAffinity]);

  return null; // This is a logic-only component
}
