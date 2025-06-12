import { useMemo } from 'react';

export default function useSortedFilteredRecipes(recipes, sortType, filter) {
  return useMemo(() => {
    const filtered = recipes.filter(r => {
      if (!filter) return true;
      const word = filter.toLowerCase();
      if (r.title.toLowerCase().includes(word)) return true;
      // if (r.description.includes(word)) return true;
      // if (r.instructions.includes(word)) return true;
      if (!isNaN(Number(filter))) {
        if (r.cookTime === Number(filter)) return true;
        if (r.ingredientCount === Number(filter)) return true;
      }
      return false;
    });

    return [...filtered].sort((a, b) => {
      if (sortType === "cookTimeAsc") return a.cookTime - b.cookTime;
      if (sortType === "cookTimeDesc") return b.cookTime - a.cookTime;
      if (sortType === "ingredientCountAsc") return a.ingredientCount - b.ingredientCount;
      if (sortType === "ingredientCountDesc") return b.ingredientCount - a.ingredientCount;
      return 0;
    });
  }, [recipes, sortType, filter]);
}