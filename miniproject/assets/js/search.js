/**
 * MiniProject WebLab - Search & Filter Engine
 * Multi-criteria search, categorization, and sorting
 */

(function () {
  'use strict';

  const Search = {
    /**
     * Filter assignments based on query, category, tech tag, and view mode
     */
    filter(assignments, options = {}) {
      const {
        query = '',
        category = 'all',
        technology = 'all',
        sortBy = 'order-asc',
        favoritesOnly = false,
        completedOnly = false,
        recentOnly = false
      } = options;

      const Storage = window.MiniProject.Storage;
      const cleanQuery = query.trim().toLowerCase();

      return assignments
        .filter(item => {
          // Special view filters
          if (favoritesOnly && !Storage.isFavorite(item.id)) return false;
          if (completedOnly && !Storage.isCompleted(item.id)) return false;
          if (recentOnly) {
            const recents = Storage.getRecent().map(r => r.id);
            if (!recents.includes(item.id)) return false;
          }

          // Category filter
          if (category !== 'all' && item.category !== category) {
            return false;
          }

          // Technology filter
          if (technology !== 'all' && !item.technologies.includes(technology)) {
            return false;
          }

          // Text Search matching
          if (cleanQuery) {
            const titleMatch = item.title.toLowerCase().includes(cleanQuery);
            const fileMatch = item.filename.toLowerCase().includes(cleanQuery);
            const pathMatch = item.relPath.toLowerCase().includes(cleanQuery);
            const catMatch = item.category.toLowerCase().includes(cleanQuery);
            const descMatch = item.description.toLowerCase().includes(cleanQuery);
            const techMatch = item.technologies.some(t => t.toLowerCase().includes(cleanQuery));
            const conceptMatch = item.concepts.some(c => c.toLowerCase().includes(cleanQuery));

            if (!titleMatch && !fileMatch && !pathMatch && !catMatch && !descMatch && !techMatch && !conceptMatch) {
              return false;
            }
          }

          return true;
        })
        .sort((a, b) => {
          if (recentOnly) {
            const recents = Storage.getRecent();
            const idxA = recents.findIndex(r => r.id === a.id);
            const idxB = recents.findIndex(r => r.id === b.id);
            return (idxA >= 0 ? idxA : 999) - (idxB >= 0 ? idxB : 999);
          }

          switch (sortBy) {
            case 'title-asc':
              return a.title.localeCompare(b.title);
            case 'title-desc':
              return b.title.localeCompare(a.title);
            case 'category':
              return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
            case 'order-desc':
              return b.order - a.order;
            case 'order-asc':
            default:
              return a.order - b.order;
          }
        });
    }
  };

  window.MiniProject = window.MiniProject || {};
  window.MiniProject.Search = Search;
})();
