/**
 * MiniProject WebLab - Storage & State Management
 * Handles localStorage persistence for favorites, completed tasks,
 * recently opened assignments, and user theme preferences.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'weblab_storage_v1';

  const defaultState = {
    favorites: [],
    completed: [],
    recent: [], // array of { id, timestamp }
    theme: 'dark' // 'dark' | 'light'
  };

  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { ...defaultState };
      const parsed = JSON.parse(data);
      return {
        favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        recent: Array.isArray(parsed.recent) ? parsed.recent : [],
        theme: parsed.theme === 'light' ? 'light' : 'dark'
      };
    } catch (e) {
      console.warn('MiniProject Storage: failed to load state from localStorage', e);
      return { ...defaultState };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Dispatch custom event for cross-component reactive updates
      window.dispatchEvent(new CustomEvent('weblab:statechange', { detail: state }));
    } catch (e) {
      console.warn('MiniProject Storage: failed to save state to localStorage', e);
    }
  }

  let currentState = loadState();

  const Storage = {
    getState() {
      return { ...currentState };
    },

    // Favorites
    isFavorite(id) {
      return currentState.favorites.includes(id);
    },

    toggleFavorite(id) {
      if (this.isFavorite(id)) {
        currentState.favorites = currentState.favorites.filter(item => item !== id);
      } else {
        currentState.favorites.push(id);
      }
      saveState(currentState);
      return this.isFavorite(id);
    },

    getFavorites() {
      return [...currentState.favorites];
    },

    // Completion Tracking
    isCompleted(id) {
      return currentState.completed.includes(id);
    },

    toggleCompleted(id) {
      if (this.isCompleted(id)) {
        currentState.completed = currentState.completed.filter(item => item !== id);
      } else {
        currentState.completed.push(id);
      }
      saveState(currentState);
      return this.isCompleted(id);
    },

    getCompleted() {
      return [...currentState.completed];
    },

    // Recently Opened
    recordAccess(id) {
      const now = Date.now();
      // Remove existing occurrence
      const filtered = currentState.recent.filter(item => item.id !== id);
      // Prepend to top (most recent first)
      filtered.unshift({ id, timestamp: now });
      // Limit to 10 entries
      currentState.recent = filtered.slice(0, 10);
      saveState(currentState);
    },

    getRecent() {
      return [...currentState.recent];
    },

    clearRecent() {
      currentState.recent = [];
      saveState(currentState);
    },

    // Theme Management
    getTheme() {
      return currentState.theme;
    },

    setTheme(theme) {
      currentState.theme = theme === 'light' ? 'light' : 'dark';
      saveState(currentState);
      return currentState.theme;
    },

    toggleTheme() {
      const next = currentState.theme === 'dark' ? 'light' : 'dark';
      return this.setTheme(next);
    },

    // Reset everything
    resetAll() {
      currentState = { ...defaultState };
      saveState(currentState);
    }
  };

  window.MiniProject = window.MiniProject || {};
  window.MiniProject.Storage = Storage;
})();
