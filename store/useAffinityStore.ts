import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AffinityState {
  categoryWeights: Record<string, number>;
  incrementAffinity: (categorySlug: string, weight?: number) => void;
  getTopAffinity: () => string | null;
}

export const useAffinityStore = create<AffinityState>()(
  persist(
    (set, get) => ({
      categoryWeights: {},
      
      incrementAffinity: (categorySlug: string, weight = 1) => set((state) => {
        const currentWeight = state.categoryWeights[categorySlug] || 0;
        return {
          categoryWeights: {
            ...state.categoryWeights,
            [categorySlug]: currentWeight + weight
          }
        };
      }),

      getTopAffinity: () => {
        const weights = get().categoryWeights;
        const entries = Object.entries(weights);
        if (entries.length === 0) return null;
        
        // Sort by weight descending
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0]; // Return the category slug with highest weight
      }
    }),
    {
      name: 'fathom-affinity-storage', // name of the item in the storage (must be unique)
    }
  )
);
