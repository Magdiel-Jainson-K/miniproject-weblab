# MiniProject — WebLab
> **Interactive Web Development Laboratory Dashboard**  
> *"One workspace. Every experiment. Your web development journey."*

**Student:** Magdiel Jainson K  
**Registration Number:** 24MIC0041  
**Course:** Web Development Laboratory  
**Project Path:** `miniproject`

---

## 1. Project Overview

**MiniProject — WebLab** is an educational dashboard designed to organize, showcase, and run all 42 HTML, CSS, and JavaScript assignments completed during the web development coursework.

Rather than a static directory listing or generic link list, **WebLab** provides a laboratory experience:
- **Zero Modification of Original Work:** All 42 original assignment files, assets (`images/`, `audio/`), and subdirectories (`ShoppingCart/`, `CollegeEvents/`, `TASK/`) remain intact.
- **Deep Discovery Engine:** Recursive scanning indexer that discovers assignments, detects technology usage (HTML5, CSS3, JavaScript, Bootstrap, Audio/Video APIs), extracts event bindings (mouse, keyboard, form events), checks asset references, and categorizes exercises.
- **Dual Launching Modes:** 
  1. **In-App Lab Runner:** Run and interact with assignments directly inside an in-browser viewport modal equipped with reload, breadcrumbs, back-to-dashboard, and new-tab launcher.
  2. **Direct New-Tab Execution:** Launch any assignment in an isolated browser tab with intact relative paths for styles, scripts, and media.
- **Progress & Activity Tracking:** LocalStorage-persisted bookmarks (Favorites), progress tracking (Completed Tasks with dynamic progress bar), and access auditing (Recently Opened exercises).
- **Responsive & Accessible UI:** Modern dark/light theme toggle, keyboard shortcuts (`/` for quick search, `Esc` to close runners/modals), mobile drawer navigation, and responsive layouts across desktops, laptops, tablets, and phones.

---

## 2. Workspace & Assignment Discovery Inventory

The recursive indexing process analyzed the workspace and cataloged **42 assignments** grouped into **6 core domains**:

| Category | Count | Key Concepts & Exercises |
| :--- | :---: | :--- |
| **HTML Fundamentals** | 10 | Semantic structure, lists, tables, text formatting, wireframing, layout architecture (`task3`, `task4`, `task5`, `task6`, `task8`, `task9`, `task10`, `task11`, `task12`, `task19`). |
| **Forms & Validation** | 10 | Form controls, regex validation, pattern matching, audio guidance, video onboarding, academic & clinical registration (`task13`, `task21`, `task22`, `task23`, `task25`, `task26`, `task27`, `task28`, `ShoppingCart/customer.html`, `ShoppingCart/payment.html`). |
| **Interactive Components** | 7 | Dynamic math generation (`test.html`), e-commerce search engine (`task15`), digital library card catalog (`task18`), online quiz portal (`task37`), Bootstrap 5 authentication & event hub (`CollegeEvents/index.html`), shopping cart checkout & order summary (`ShoppingCart/index.html`, `ShoppingCart/cart.html`). |
| **Mouse Events** | 5 | Real-time DOM updates, hover animations, traffic signal simulator, dynamic weather widget, interactive campus hover (`task29`, `task30`, `task31`, `task32`, `task33`). |
| **Keyboard Events** | 5 | Live student search (`onkeydown`), virtual ATM PIN entry with digit masking, live input highlighting (`oninput`), campus photo gallery with arrow key navigation, travel gallery with hotkey controls (`N`/`P`/`Space`) (`task34`, `task35`, `task36`, `task38`, `task39`). |
| **Multimedia & Layouts** | 5 | Travel photo showcase, hospital healthcare portal, MLBB gaming landing page, Moonton corporate profile, college events celebration portal (`task7`, `task14`, `task16`, `task17`, `task40`). |

**Total Discovered HTML Assignments:** `42`

---

## 3. Directory Structure

```text
24MIC0041/                               # Workspace Root (Original files intact)
│
├── task3.html ... task40.html           # Original HTML assignment files
├── test.html                            # Dynamic square calculation assignment
├── images/                              # Original image assets (18 images)
├── audio/                               # Original audio/video assets
├── CollegeEvents/                       # Subfolder: Bootstrap 5 Event Portal (Task 41)
│   ├── index.html
│   ├── style.css
│   └── bootstrap/
├── ShoppingCart/                        # Subfolder: E-Commerce Funnel (Task 24)
│   ├── index.html
│   ├── customer.html
│   ├── payment.html
│   ├── cart.html
│   └── style.css
├── TASK/                                # Assignment requirement sheets (.docx & .pdf)
│
└── miniproject/                         # MiniProject WebLab Application
    ├── index.html                       # Dashboard Main Page
    ├── assignments.json                 # JSON manifest of all 42 assignments
    ├── package.json                     # NPM script definitions
    ├── README.md                        # Documentation & Execution Guide
    │
    ├── assets/
    │   ├── css/
    │   │   ├── style.css                # Polished design system (Dark/Light themes)
    │   │   └── responsive.css           # Mobile & tablet layout rules
    │   │
    │   └── js/
    │       ├── assignment-registry.js   # Discovered assignment registry (client-ready)
    │       ├── storage.js               # LocalStorage management (Favorites, Recent, Theme)
    │       ├── search.js                # Multi-field search & filtering algorithms
    │       ├── dashboard.js             # UI rendering, stats calculation, modal & runner
    │       └── app.js                   # Main application orchestration & keyboard shortcuts
    │
    └── scripts/
        ├── discover-assignments.js      # Workspace recursive scanner & registry generator
        └── server.js                    # Zero-dependency local development HTTP server
```

---

## 4. How to Run the Application

### Option A: Using the Built-In Local Server (Recommended)
From the `miniproject` directory or root workspace, run the zero-dependency Node.js server:

```powershell
cd K:\FRONTEND\htdocs\24MIC0041\miniproject
node scripts/server.js
```
*Or via npm:*
```powershell
npm start
```

Then open your browser and visit:
👉 **`http://localhost:3000/miniproject/index.html`**

---

### Option B: Using VS Code Live Server Extension
1. Open the workspace folder `24MIC0041` in VS Code.
2. In the file explorer, navigate to `miniproject/index.html`.
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The dashboard will launch in your browser at `http://127.0.0.1:5500/miniproject/index.html`.

---

### Option C: Using Apache / XAMPP
Since the project is already located inside your local `htdocs` root:
1. Start the Apache service in XAMPP / WAMP.
2. Open your browser and navigate to:
👉 **`http://localhost/24MIC0041/miniproject/index.html`**

---

## 5. Regenerating the Assignment Registry

If additional assignments are added to the workspace in the future:
1. Open PowerShell or terminal.
2. Run:
```powershell
node miniproject/scripts/discover-assignments.js
```
The script will recursively scan all folders, validate asset links, update `assignments.json`, and regenerate `assets/js/assignment-registry.js` automatically.

---

## 6. Asset Reference Audit & Handling

During discovery, the indexer audited all asset references across all 42 files:
- **Audio Reference Discrepancy Identified:**
  - Files `task21.html` and `task26.html` reference `<audio src="audio/login-instructions.mp3">` (plural).
  - The actual file on disk is `audio/login-instruction.mp3` (singular).
  - **Handling:** Per instructions, **the original assignment files were kept 100% intact without unauthorized modifications**. The WebLab dashboard highlights this discrepancy cleanly inside the Assignment Details modal (`Asset Reference Notice`) while gracefully allowing the assignment to run normally.

---

## 7. Key Features Demonstrated

1. **Dynamic Statistics:** Calculated live from discovered files and user activity:
   - Total assignments (42)
   - Categories available (6)
   - Completed assignments count & progress bar percentage
   - Bookmarked favorites count
   - Recently opened count
2. **Instant Search & Multi-Criteria Filtering:**
   - Search by title, filename, category, description, concepts, and technologies.
   - Filter by specific category or technology tag.
   - Sort by default task order, alphabetical (A-Z, Z-A), or category.
   - Quick reset button and friendly empty states.
3. **In-App Interactive WebLab Runner:**
   - Viewport modal allows testing interactive assignments (mouse events, ATM PIN entry, audio players, traffic light) right from the dashboard.
   - Includes reload button, new-tab launcher, and back-to-dashboard control.
4. **LocalStorage Persistence:**
   - Favorites bookmarking (persisted across reloads).
   - Task completion checkmarks (persisted across reloads).
   - Recently opened activity queue (up to 10 entries, sorted by last accessed).
   - Dark/Light theme preference (persisted).
5. **Keyboard Accessibility:**
   - Press `/` anywhere to immediately focus the search bar.
   - Press `Esc` to close any open modal or runner.

---

## 8. Verification & Test Summary

The application has been verified against all project requirements:
- [x] Workspace scanned recursively; all 42 assignment files detected.
- [x] Subfolders (`ShoppingCart/` and `CollegeEvents/`) correctly indexed with relative paths.
- [x] Dashboard UI renders cleanly without console errors.
- [x] Dynamic statistics update accurately when tasks are completed or favorited.
- [x] In-app Lab Runner iframe loads assignments with relative CSS, images, and audio working.
- [x] Direct launch in new tab opens correct files.
- [x] Search filters by keyword, title, and topic.
- [x] Dark and Light theme toggle transitions smoothly and persists across refreshes.
- [x] Responsive layout verified on mobile (<768px), tablet (1024px), and desktop.
- [x] No original assignment files were altered or deleted.
