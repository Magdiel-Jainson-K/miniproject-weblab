/**
 * MiniProject WebLab - Dashboard UI Controller
 * Renders dynamic stats, assignment cards, detail modals,
 * and the interactive in-lab assignment runner.
 */

(function () {
  'use strict';

  const Dashboard = {
    // Current filter state
    state: {
      category: 'all',
      query: '',
      technology: 'all',
      sortBy: 'order-asc',
      specialView: null // 'favorites' | 'recent' | 'completed' | null
    },

    // Category styling & icon metadata
    categoryMeta: {
      'HTML Fundamentals': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
        color: '#3b82f6',
        badgeClass: 'badge-blue'
      },
      'Forms & Validation': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
        color: '#10b981',
        badgeClass: 'badge-green'
      },
      'Mouse Events': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v12a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/><line x1="12" y1="6" x2="12" y2="10"/></svg>',
        color: '#8b5cf6',
        badgeClass: 'badge-purple'
      },
      'Keyboard Events': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>',
        color: '#f59e0b',
        badgeClass: 'badge-amber'
      },
      'Interactive Components': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
        color: '#06b6d4',
        badgeClass: 'badge-cyan'
      },
      'Multimedia & Layouts': {
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
        color: '#ec4899',
        badgeClass: 'badge-pink'
      }
    },

    init() {
      this.cacheDom();
      this.bindEvents();
      this.updateStats();
      this.renderCategoryGrid();
      this.renderAssignments();
      this.renderRecentCarousel();
    },

    cacheDom() {
      this.dom = {
        // Stats
        statTotal: document.getElementById('stat-total'),
        statCategories: document.getElementById('stat-categories'),
        statFavorites: document.getElementById('stat-favorites'),
        statRecent: document.getElementById('stat-recent'),
        statCompleted: document.getElementById('stat-completed'),
        statCompletedPercent: document.getElementById('stat-completed-percent'),
        progressBar: document.getElementById('stat-progress-bar'),

        // Grid & Sections
        assignmentGrid: document.getElementById('assignment-grid'),
        categoryGrid: document.getElementById('category-grid'),
        recentSection: document.getElementById('recent-section'),
        recentList: document.getElementById('recent-list'),
        resultsCount: document.getElementById('results-count'),
        viewTitle: document.getElementById('current-view-title'),
        viewDescription: document.getElementById('current-view-description'),

        // Search & Controls
        searchInput: document.getElementById('search-input'),
        searchClear: document.getElementById('search-clear'),
        categorySelect: document.getElementById('filter-category'),
        sortSelect: document.getElementById('filter-sort'),
        techSelect: document.getElementById('filter-tech'),
        resetFiltersBtn: document.getElementById('reset-filters-btn'),

        // Modals & Runner
        modalBackdrop: document.getElementById('modal-backdrop'),
        detailModal: document.getElementById('detail-modal'),
        detailContent: document.getElementById('detail-content'),
        modalCloseBtn: document.getElementById('modal-close-btn'),

        // In-App Lab Runner
        labRunner: document.getElementById('lab-runner'),
        runnerFrame: document.getElementById('runner-frame'),
        runnerTitle: document.getElementById('runner-title'),
        runnerCategory: document.getElementById('runner-category'),
        runnerPath: document.getElementById('runner-path'),
        runnerOpenNewTab: document.getElementById('runner-open-new-tab'),
        runnerReload: document.getElementById('runner-reload'),
        runnerClose: document.getElementById('runner-close'),

        // Sidebar Navigation links
        navLinks: document.querySelectorAll('.nav-link')
      };
    },

    bindEvents() {
      const Storage = window.MiniProject.Storage;

      // Listen to state changes from storage
      window.addEventListener('weblab:statechange', () => {
        this.updateStats();
        this.renderAssignments();
        this.renderRecentCarousel();
      });

      // Filter events
      if (this.dom.searchInput) {
        this.dom.searchInput.addEventListener('input', (e) => {
          this.state.query = e.target.value;
          if (this.dom.searchClear) {
            this.dom.searchClear.style.display = this.state.query ? 'block' : 'none';
          }
          this.renderAssignments();
        });
      }

      if (this.dom.searchClear) {
        this.dom.searchClear.addEventListener('click', () => {
          this.dom.searchInput.value = '';
          this.state.query = '';
          this.dom.searchClear.style.display = 'none';
          this.renderAssignments();
          this.dom.searchInput.focus();
        });
      }

      if (this.dom.categorySelect) {
        this.dom.categorySelect.addEventListener('change', (e) => {
          this.setCategory(e.target.value);
        });
      }

      if (this.dom.sortSelect) {
        this.dom.sortSelect.addEventListener('change', (e) => {
          this.state.sortBy = e.target.value;
          this.renderAssignments();
        });
      }

      if (this.dom.techSelect) {
        this.dom.techSelect.addEventListener('change', (e) => {
          this.state.technology = e.target.value;
          this.renderAssignments();
        });
      }

      if (this.dom.resetFiltersBtn) {
        this.dom.resetFiltersBtn.addEventListener('click', () => {
          this.resetFilters();
        });
      }

      // Close modal
      if (this.dom.modalCloseBtn) {
        this.dom.modalCloseBtn.addEventListener('click', () => this.closeDetailModal());
      }
      if (this.dom.modalBackdrop) {
        this.dom.modalBackdrop.addEventListener('click', (e) => {
          if (e.target === this.dom.modalBackdrop) this.closeDetailModal();
        });
      }

      // Runner controls
      if (this.dom.runnerClose) {
        this.dom.runnerClose.addEventListener('click', () => this.closeRunner());
      }
      if (this.dom.runnerReload) {
        this.dom.runnerReload.addEventListener('click', () => {
          if (this.dom.runnerFrame.src) {
            this.dom.runnerFrame.src = this.dom.runnerFrame.src;
          }
        });
      }

      // Escape key to close modals or runner
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.dom.labRunner && this.dom.labRunner.classList.contains('active')) {
            this.closeRunner();
          } else if (this.dom.modalBackdrop && this.dom.modalBackdrop.classList.contains('active')) {
            this.closeDetailModal();
          }
        }
      });
    },

    updateStats() {
      const registry = window.MiniProject.registry || [];
      const categories = window.MiniProject.categories || [];
      const Storage = window.MiniProject.Storage;

      const total = registry.length;
      const totalCats = categories.length;
      const favorites = Storage.getFavorites().length;
      const recent = Storage.getRecent().length;
      const completed = Storage.getCompleted().length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      if (this.dom.statTotal) this.dom.statTotal.textContent = total;
      if (this.dom.statCategories) this.dom.statCategories.textContent = totalCats;
      if (this.dom.statFavorites) this.dom.statFavorites.textContent = favorites;
      if (this.dom.statRecent) this.dom.statRecent.textContent = recent;
      if (this.dom.statCompleted) this.dom.statCompleted.textContent = completed;
      if (this.dom.statCompletedPercent) this.dom.statCompletedPercent.textContent = `${percent}%`;
      if (this.dom.progressBar) {
        this.dom.progressBar.style.width = `${percent}%`;
        this.dom.progressBar.setAttribute('aria-valuenow', percent);
      }

      // Update sidebar badges
      const favBadge = document.getElementById('badge-nav-favorites');
      if (favBadge) favBadge.textContent = favorites;
      const recentBadge = document.getElementById('badge-nav-recent');
      if (recentBadge) recentBadge.textContent = recent;
      const totalBadge = document.getElementById('badge-nav-all');
      if (totalBadge) totalBadge.textContent = total;
    },

    renderCategoryGrid() {
      if (!this.dom.categoryGrid) return;

      const categories = window.MiniProject.categories || [];
      const metadata = window.MiniProject.metadata || { categoryCounts: {} };

      let html = '';
      categories.forEach(cat => {
        const count = metadata.categoryCounts[cat] || 0;
        const meta = this.categoryMeta[cat] || {
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
          color: '#3b82f6',
          badgeClass: 'badge-blue'
        };

        const isActive = this.state.category === cat && !this.state.specialView;

        html += `
          <div class="category-card ${isActive ? 'active' : ''}" data-category="${cat}" tabindex="0" role="button">
            <div class="cat-icon-wrapper" style="--cat-color: ${meta.color}">
              ${meta.icon}
            </div>
            <div class="cat-info">
              <h4 class="cat-title">${cat}</h4>
              <span class="cat-count">${count} ${count === 1 ? 'Exercise' : 'Exercises'}</span>
            </div>
          </div>
        `;
      });

      this.dom.categoryGrid.innerHTML = html;

      // Bind category card clicks
      this.dom.categoryGrid.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
          const cat = card.getAttribute('data-category');
          this.setCategory(cat);
          // Smooth scroll to assignments section
          const target = document.getElementById('assignments-section');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
          }
        });
      });
    },

    renderRecentCarousel() {
      if (!this.dom.recentSection || !this.dom.recentList) return;

      const Storage = window.MiniProject.Storage;
      const recentItems = Storage.getRecent();
      const registry = window.MiniProject.registry || [];

      if (recentItems.length === 0) {
        this.dom.recentSection.style.display = 'none';
        return;
      }

      this.dom.recentSection.style.display = 'block';

      let html = '';
      recentItems.slice(0, 6).forEach(rec => {
        const item = registry.find(a => a.id === rec.id);
        if (!item) return;

        const meta = this.categoryMeta[item.category] || {};
        const timeAgo = this.formatTimeAgo(rec.timestamp);

        html += `
          <div class="recent-card" data-id="${item.id}">
            <div class="recent-top">
              <span class="badge ${meta.badgeClass || 'badge-blue'}">${item.category}</span>
              <span class="recent-time">${timeAgo}</span>
            </div>
            <h5 class="recent-title">${item.title}</h5>
            <div class="recent-actions">
              <button class="btn btn-sm btn-primary-soft btn-run" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Launch
              </button>
              <a href="../${item.relPath}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost btn-newtab" data-id="${item.id}" title="Open in New Tab">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        `;
      });

      this.dom.recentList.innerHTML = html;

      // Event delegation for recent actions
      this.dom.recentList.querySelectorAll('.btn-run').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.openAssignmentInLab(id);
        });
      });

      this.dom.recentList.querySelectorAll('.btn-newtab').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          Storage.recordAccess(id);
        });
      });
    },

    renderAssignments() {
      if (!this.dom.assignmentGrid) return;

      const registry = window.MiniProject.registry || [];
      const Storage = window.MiniProject.Storage;

      const filterOptions = {
        query: this.state.query,
        category: this.state.category,
        technology: this.state.technology,
        sortBy: this.state.sortBy,
        favoritesOnly: this.state.specialView === 'favorites',
        completedOnly: this.state.specialView === 'completed',
        recentOnly: this.state.specialView === 'recent'
      };

      const filtered = window.MiniProject.Search.filter(registry, filterOptions);

      // Update results count
      if (this.dom.resultsCount) {
        this.dom.resultsCount.textContent = `${filtered.length} of ${registry.length} assignments`;
      }

      // Update headers
      this.updateViewHeader(filtered.length);

      // Handle Empty State
      if (filtered.length === 0) {
        this.dom.assignmentGrid.innerHTML = this.renderEmptyState();
        const clearBtn = document.getElementById('empty-state-clear');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => this.resetFilters());
        }
        return;
      }

      // Render cards
      let html = '';
      filtered.forEach(item => {
        const isFav = Storage.isFavorite(item.id);
        const isDone = Storage.isCompleted(item.id);
        const meta = this.categoryMeta[item.category] || {
          icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
          color: '#3b82f6',
          badgeClass: 'badge-blue'
        };

        const techBadges = item.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');
        const concepts = item.concepts.slice(0, 3).map(c => `<span class="concept-chip">${c}</span>`).join('');

        html += `
          <div class="assignment-card ${isDone ? 'is-completed' : ''}" data-id="${item.id}" tabindex="0">
            <div class="card-header">
              <div class="card-icon" style="--accent: ${meta.color}">
                ${meta.icon}
              </div>
              <div class="card-badges">
                <span class="badge ${meta.badgeClass}">${item.category}</span>
                ${item.hasMissingAssets ? '<span class="badge badge-warning" title="Note: Asset reference mismatch noted">Asset Note</span>' : ''}
              </div>
              <div class="card-toggles">
                <button class="icon-toggle-btn btn-favorite ${isFav ? 'active' : ''}" data-id="${item.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" aria-label="Favorite">
                  <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </button>
                <button class="icon-toggle-btn btn-complete ${isDone ? 'active' : ''}" data-id="${item.id}" title="${isDone ? 'Mark as incomplete' : 'Mark as completed'}" aria-label="Completed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>

            <div class="card-body">
              <div class="card-meta-line">
                <span class="task-file-path" title="${item.relPath}">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  ${item.filename}
                </span>
                <span class="task-number">#${item.order}</span>
              </div>
              <h3 class="card-title">${item.title}</h3>
              <p class="card-desc">${item.description}</p>
              
              <div class="card-concepts">
                ${concepts}
              </div>
            </div>

            <div class="card-footer">
              <div class="card-techs">
                ${techBadges}
              </div>
              <div class="card-actions">
                <button class="btn btn-outline btn-details" data-id="${item.id}" title="View details and concepts">
                  Details
                </button>
                <button class="btn btn-primary btn-run-lab" data-id="${item.id}" title="Run interactive assignment inside WebLab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Run Lab
                </button>
                <a href="../${item.relPath}" target="_blank" rel="noopener noreferrer" class="btn btn-icon btn-new-tab" data-id="${item.id}" title="Launch assignment in new browser tab">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>
          </div>
        `;
      });

      this.dom.assignmentGrid.innerHTML = html;

      // Bind card interactions
      this.dom.assignmentGrid.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          Storage.toggleFavorite(id);
        });
      });

      this.dom.assignmentGrid.querySelectorAll('.btn-complete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          Storage.toggleCompleted(id);
        });
      });

      this.dom.assignmentGrid.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.openDetailModal(id);
        });
      });

      this.dom.assignmentGrid.querySelectorAll('.btn-run-lab').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-id');
          this.openAssignmentInLab(id);
        });
      });

      this.dom.assignmentGrid.querySelectorAll('.btn-new-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          Storage.recordAccess(id);
        });
      });
    },

    renderEmptyState() {
      let message = 'No assignments matched your search criteria.';
      if (this.state.specialView === 'favorites') {
        message = 'You have not added any assignments to your favorites yet. Click the star icon on any assignment card to bookmark it!';
      } else if (this.state.specialView === 'recent') {
        message = 'You have not launched any assignments yet. Explore the lab and run any assignment to see it here.';
      } else if (this.state.specialView === 'completed') {
        message = 'No assignments marked as completed yet. Track your course progress by marking completed tasks.';
      }

      return `
        <div class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3>No Assignments Found</h3>
          <p>${message}</p>
          <button id="empty-state-clear" class="btn btn-primary">Reset Filters & Show All</button>
        </div>
      `;
    },

    updateViewHeader(count) {
      if (!this.dom.viewTitle || !this.dom.viewDescription) return;

      if (this.state.specialView === 'favorites') {
        this.dom.viewTitle.textContent = 'Favorite Assignments';
        this.dom.viewDescription.textContent = 'Your curated collection of bookmarked laboratory exercises and reference implementations.';
      } else if (this.state.specialView === 'recent') {
        this.dom.viewTitle.textContent = 'Recently Opened';
        this.dom.viewDescription.textContent = 'Exercises you recently launched or tested in this laboratory workspace.';
      } else if (this.state.specialView === 'completed') {
        this.dom.viewTitle.textContent = 'Completed Assignments';
        this.dom.viewDescription.textContent = 'Laboratory experiments verified and marked as completed.';
      } else if (this.state.category !== 'all') {
        this.dom.viewTitle.textContent = `${this.state.category}`;
        this.dom.viewDescription.textContent = `Displaying ${count} laboratory experiments in the ${this.state.category} category.`;
      } else if (this.state.query) {
        this.dom.viewTitle.textContent = `Search: "${this.state.query}"`;
        this.dom.viewDescription.textContent = `Found ${count} matching assignments across the entire workspace.`;
      } else {
        this.dom.viewTitle.textContent = 'All Laboratory Assignments';
        this.dom.viewDescription.textContent = 'Complete inventory of interactive web development assignments, experiments, and coursework.';
      }
    },

    setCategory(category) {
      this.state.specialView = null;
      this.state.category = category;
      if (this.dom.categorySelect) this.dom.categorySelect.value = category;

      // Update sidebar nav state
      this.updateActiveNav();
      this.renderCategoryGrid();
      this.renderAssignments();
    },

    setSpecialView(view) {
      this.state.specialView = view;
      this.state.category = 'all';
      if (this.dom.categorySelect) this.dom.categorySelect.value = 'all';

      this.updateActiveNav();
      this.renderCategoryGrid();
      this.renderAssignments();

      const target = document.getElementById('assignments-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    },

    updateActiveNav() {
      if (!this.dom.navLinks) return;
      this.dom.navLinks.forEach(link => {
        const linkCat = link.getAttribute('data-category');
        const linkView = link.getAttribute('data-view');

        let isActive = false;
        if (this.state.specialView) {
          isActive = linkView === this.state.specialView;
        } else {
          isActive = (linkCat === this.state.category) && !linkView;
        }

        link.classList.toggle('active', isActive);
      });
    },

    resetFilters() {
      this.state.category = 'all';
      this.state.query = '';
      this.state.technology = 'all';
      this.state.sortBy = 'order-asc';
      this.state.specialView = null;

      if (this.dom.searchInput) this.dom.searchInput.value = '';
      if (this.dom.searchClear) this.dom.searchClear.style.display = 'none';
      if (this.dom.categorySelect) this.dom.categorySelect.value = 'all';
      if (this.dom.sortSelect) this.dom.sortSelect.value = 'order-asc';
      if (this.dom.techSelect) this.dom.techSelect.value = 'all';

      this.updateActiveNav();
      this.renderCategoryGrid();
      this.renderAssignments();
    },

    openDetailModal(id) {
      const registry = window.MiniProject.registry || [];
      const item = registry.find(a => a.id === id);
      if (!item) return;

      const Storage = window.MiniProject.Storage;
      const isFav = Storage.isFavorite(item.id);
      const isDone = Storage.isCompleted(item.id);
      const meta = this.categoryMeta[item.category] || { badgeClass: 'badge-blue' };

      const missingNoticeHtml = item.hasMissingAssets ? `
        <div class="alert-box alert-warning">
          <strong>Asset Reference Notice:</strong>
          <p>${item.missingAssets.map(m => m.note).join('<br>')}</p>
          <small>Note: The original assignment file is kept unmodified per course policy. The dashboard operates correctly and reports this status accurately.</small>
        </div>
      ` : '';

      const conceptsHtml = item.concepts.map(c => `<span class="concept-chip">${c}</span>`).join(' ');
      const techHtml = item.technologies.map(t => `<span class="tech-tag">${t}</span>`).join(' ');

      const eventsHtml = `
        <div class="meta-row">
          <span class="meta-label">Event Listeners:</span>
          <span class="meta-value">
            ${item.events.mouse.length ? `<strong>Mouse:</strong> ${item.events.mouse.join(', ')} ` : ''}
            ${item.events.keyboard.length ? `<strong>Keyboard:</strong> ${item.events.keyboard.join(', ')} ` : ''}
            ${item.events.form.length ? `<strong>Form:</strong> ${item.events.form.join(', ')} ` : ''}
            ${!item.events.mouse.length && !item.events.keyboard.length && !item.events.form.length ? 'Standard DOM Rendering' : ''}
          </span>
        </div>
      `;

      this.dom.detailContent.innerHTML = `
        <div class="modal-header">
          <div class="modal-title-group">
            <span class="badge ${meta.badgeClass}">${item.category}</span>
            <h2 class="modal-title">${item.title}</h2>
            <div class="modal-path-line">
              <span>File: <code>${item.relPath}</code></span>
              <span>Assignment #${item.order}</span>
            </div>
          </div>
        </div>

        <div class="modal-body">
          ${missingNoticeHtml}
          
          <div class="modal-section">
            <h4>Description</h4>
            <p class="modal-desc">${item.description}</p>
          </div>

          <div class="modal-section">
            <h4>Key Concepts Demonstrated</h4>
            <div class="chip-container">${conceptsHtml}</div>
          </div>

          <div class="modal-section">
            <h4>Technologies Applied</h4>
            <div class="tag-container">${techHtml}</div>
          </div>

          <div class="modal-meta-table">
            ${eventsHtml}
            <div class="meta-row">
              <span class="meta-label">Relative Path:</span>
              <span class="meta-value"><code>${item.relPath}</code></span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Original Filename:</span>
              <span class="meta-value"><code>${item.filename}</code></span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="modal-footer-toggles">
            <button class="btn btn-outline modal-btn-fav ${isFav ? 'active' : ''}" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ${isFav ? 'Favorited' : 'Add to Favorites'}
            </button>
            <button class="btn btn-outline modal-btn-done ${isDone ? 'active' : ''}" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
              ${isDone ? 'Completed' : 'Mark Completed'}
            </button>
          </div>
          <div class="modal-footer-actions">
            <a href="../${item.relPath}" target="_blank" rel="noopener noreferrer" class="btn btn-outline modal-btn-newtab" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Open in New Tab
            </a>
            <button class="btn btn-primary modal-btn-launch" data-id="${item.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Launch in WebLab Runner
            </button>
          </div>
        </div>
      `;

      // Bind modal buttons
      const favBtn = this.dom.detailContent.querySelector('.modal-btn-fav');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const nowFav = Storage.toggleFavorite(item.id);
          favBtn.classList.toggle('active', nowFav);
          favBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="${nowFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${nowFav ? 'Favorited' : 'Add to Favorites'}
          `;
        });
      }

      const doneBtn = this.dom.detailContent.querySelector('.modal-btn-done');
      if (doneBtn) {
        doneBtn.addEventListener('click', () => {
          const nowDone = Storage.toggleCompleted(item.id);
          doneBtn.classList.toggle('active', nowDone);
          doneBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
            ${nowDone ? 'Completed' : 'Mark Completed'}
          `;
        });
      }

      const launchBtn = this.dom.detailContent.querySelector('.modal-btn-launch');
      if (launchBtn) {
        launchBtn.addEventListener('click', () => {
          this.closeDetailModal();
          this.openAssignmentInLab(item.id);
        });
      }

      const newTabBtn = this.dom.detailContent.querySelector('.modal-btn-newtab');
      if (newTabBtn) {
        newTabBtn.addEventListener('click', () => {
          Storage.recordAccess(item.id);
        });
      }

      this.dom.modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeDetailModal() {
      if (this.dom.modalBackdrop) {
        this.dom.modalBackdrop.classList.remove('active');
      }
      document.body.style.overflow = '';
    },

    openAssignmentInLab(id) {
      const registry = window.MiniProject.registry || [];
      const item = registry.find(a => a.id === id);
      if (!item) return;

      const Storage = window.MiniProject.Storage;
      Storage.recordAccess(item.id);

      // Populate runner bar
      if (this.dom.runnerTitle) this.dom.runnerTitle.textContent = item.title;
      if (this.dom.runnerCategory) this.dom.runnerCategory.textContent = item.category;
      if (this.dom.runnerPath) this.dom.runnerPath.textContent = item.relPath;

      if (this.dom.runnerOpenNewTab) {
        this.dom.runnerOpenNewTab.href = `../${item.relPath}`;
      }

      // Load into iframe
      if (this.dom.runnerFrame) {
        this.dom.runnerFrame.src = `../${item.relPath}`;
      }

      if (this.dom.labRunner) {
        this.dom.labRunner.classList.add('active');
      }
      document.body.style.overflow = 'hidden';
    },

    closeRunner() {
      if (this.dom.labRunner) {
        this.dom.labRunner.classList.remove('active');
      }
      if (this.dom.runnerFrame) {
        // Reset src to stop any media / scripts
        this.dom.runnerFrame.src = 'about:blank';
      }
      document.body.style.overflow = '';
    },

    formatTimeAgo(timestamp) {
      const diff = Math.floor((Date.now() - timestamp) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    }
  };

  window.MiniProject = window.MiniProject || {};
  window.MiniProject.Dashboard = Dashboard;
})();
