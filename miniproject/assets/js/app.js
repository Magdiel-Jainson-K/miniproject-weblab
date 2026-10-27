/**
 * MiniProject WebLab - Main Application Entry Point
 * Orchestrates themes, navigation, mobile drawer, and shortcuts.
 */

(function () {
  'use strict';

  function initApp() {
    const Storage = window.MiniProject.Storage;
    const Dashboard = window.MiniProject.Dashboard;

    // 1. Initialize Theme
    const currentTheme = Storage.getTheme();
    applyTheme(currentTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = Storage.toggleTheme();
        applyTheme(nextTheme);
      });
    }

    // 2. Initialize Dashboard Controller
    Dashboard.init();

    // 3. Setup Navigation & Sidebar Links
    setupSidebarNavigation(Dashboard);

    // 4. Setup Mobile Drawer Toggle
    setupMobileSidebar();

    // 5. Setup Hero Quick Action Buttons
    setupHeroButtons();

    // 6. Global Keyboard Shortcuts
    setupKeyboardShortcuts();

    console.log('🚀 MiniProject WebLab successfully initialized.');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      if (theme === 'light') {
        // Moon icon for light mode (click to switch to dark)
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      } else {
        // Sun icon for dark mode (click to switch to light)
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
      }
    }
  }

  function setupSidebarNavigation(Dashboard) {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Close mobile sidebar if open
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          if (overlay) overlay.classList.remove('active');
        }

        const view = link.getAttribute('data-view');
        const category = link.getAttribute('data-category');

        if (view === 'overview') {
          // Scroll to top overview
          window.scrollTo({ top: 0, behavior: 'smooth' });
          Dashboard.resetFilters();
          return;
        }

        if (view === 'favorites') {
          Dashboard.setSpecialView('favorites');
        } else if (view === 'recent') {
          Dashboard.setSpecialView('recent');
        } else if (view === 'completed') {
          Dashboard.setSpecialView('completed');
        } else if (category) {
          Dashboard.setCategory(category);
          const target = document.getElementById('assignments-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupMobileSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBtn = document.getElementById('sidebar-close-btn');

    function openSidebar() {
      if (sidebar) sidebar.classList.add('mobile-open');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn) toggleBtn.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  }

  function setupHeroButtons() {
    const exploreBtn = document.getElementById('hero-explore-btn');
    const categoriesBtn = document.getElementById('hero-categories-btn');

    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        const target = document.getElementById('assignments-section');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (categoriesBtn) {
      categoriesBtn.addEventListener('click', () => {
        const target = document.getElementById('categories-section');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // '/' to focus search input
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
