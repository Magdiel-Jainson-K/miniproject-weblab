/**
 * MiniProject WebLab - Assignment Discovery & Indexing Script
 * 
 * Scans the workspace recursively for HTML assignments, extracts metadata,
 * detects technologies and event listeners, validates asset references,
 * and generates both assignment-registry.js and assignments.json.
 * 
 * Usage:
 *   node scripts/discover-assignments.js
 */

const fs = require('fs');
const path = require('path');

// Determine paths: root of workspace is parent of miniproject
const scriptDir = __dirname;
const projectDir = path.resolve(scriptDir, '..');
const workspaceDir = path.resolve(projectDir, '..');

console.log('='.repeat(60));
console.log('MiniProject WebLab - Assignment Discovery Engine');
console.log('Scanning directory:', workspaceDir);
console.log('='.repeat(60));

// Curated metadata enhancements for known tasks
const TASK_METADATA = {
  'task3.html': {
    title: 'Personal Portfolio Page',
    category: 'HTML Fundamentals',
    description: 'Personal web portfolio showcasing student background, skills, education, and social profiles using semantic HTML structure and CSS styling.',
    concepts: ['Semantic HTML', 'Profile Card', 'CSS Layout', 'Lists & Hyperlinks'],
    technologies: ['HTML5', 'CSS3']
  },
  'task4.html': {
    title: 'Travel Bucket List',
    category: 'HTML Fundamentals',
    description: 'Travel destination showcase using ordered, unordered, and definition lists, styling dream destinations and activities.',
    concepts: ['Ordered & Unordered Lists', 'Definition Lists', 'Text Formatting', 'Hyperlinks'],
    technologies: ['HTML5', 'CSS3']
  },
  'task5.html': {
    title: 'Science & Technology Article',
    category: 'HTML Fundamentals',
    description: 'Structured educational article highlighting advances in modern technology, medicine, and computing with formatted typography.',
    concepts: ['Headings Hierarchy', 'Paragraph Typography', 'Emphasis & Formatting'],
    technologies: ['HTML5']
  },
  'task6.html': {
    title: 'Employee Profile Card',
    category: 'HTML Fundamentals',
    description: 'Corporate employee information card displaying designation, profile details, and company information.',
    concepts: ['Card Layout', 'Profile Details', 'CSS Styling'],
    technologies: ['HTML5', 'CSS3']
  },
  'task7.html': {
    title: 'World Travel Destinations',
    category: 'Multimedia & Layouts',
    description: 'Visual showcase of international tourist destinations featuring responsive imagery, destination overviews, and travel highlights.',
    concepts: ['Image Elements', 'Content Sections', 'Responsive Imagery'],
    technologies: ['HTML5', 'CSS3']
  },
  'task8.html': {
    title: 'Digital Employee ID Card',
    category: 'HTML Fundamentals',
    description: 'Compact badge layout resembling an official corporate ID card with avatar, role tags, and ID badge styling.',
    concepts: ['Box Model', 'Border Radius', 'Card Layout', 'Typography'],
    technologies: ['HTML5', 'CSS3']
  },
  'task9.html': {
    title: 'Computer Science Department Portal',
    category: 'HTML Fundamentals',
    description: 'Academic department portal featuring overview, faculty, academic programs, research areas, and contact links.',
    concepts: ['Multi-section Layout', 'Anchor Navigation', 'List Formatting'],
    technologies: ['HTML5', 'CSS3']
  },
  'task10.html': {
    title: 'Table-Based Website Layout',
    category: 'HTML Fundamentals',
    description: 'Classic table layout architecture demonstrating multi-row and multi-column website structure with header, sidebar, and content.',
    concepts: ['HTML Tables', 'Rowspan & Colspan', 'Grid Layout via Tables', 'Navigation Links'],
    technologies: ['HTML5', 'CSS3']
  },
  'task11.html': {
    title: 'Employee Management Portal',
    category: 'HTML Fundamentals',
    description: 'Enterprise HR management interface featuring navigation tabs, employee directory table, and payroll sections.',
    concepts: ['Navigation Bar', 'Data Tables', 'Corporate Layout', 'CSS Styling'],
    technologies: ['HTML5', 'CSS3']
  },
  'task12.html': {
    title: 'Wireframe Layout Prototype',
    category: 'HTML Fundamentals',
    description: 'Visual wireframe layout prototype demonstrating header, left sidebar navigation, main content, and footer structure.',
    concepts: ['Wireframing', 'Layout Architecture', 'Block Elements'],
    technologies: ['HTML5']
  },
  'task13.html': {
    title: 'Hospital Management System',
    category: 'Forms & Validation',
    description: 'Healthcare administration portal featuring branch selector, department dropdown, and hospital service details.',
    concepts: ['Select Dropdowns', 'Form Controls', 'Institutional Layout'],
    technologies: ['HTML5', 'CSS3']
  },
  'task14.html': {
    title: 'CityCare Hospital Healthcare Portal',
    category: 'Multimedia & Layouts',
    description: 'Modern hospital web presence with appointment booking highlights, doctor directory, department listings, and hospital overview.',
    concepts: ['Navigation Menu', 'Service Cards', 'CSS Layout', 'Call to Action'],
    technologies: ['HTML5', 'CSS3']
  },
  'task15.html': {
    title: 'Smart Product Search Engine',
    category: 'Interactive Components',
    description: 'Interactive e-commerce search interface with category filtering, price sliders, search input, and interactive hover feedback.',
    concepts: ['Interactive Hover', 'Search Filtering', 'CSS Transitions', 'Event Listeners'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task16.html': {
    title: 'GameZone - MLBB Portal',
    category: 'Multimedia & Layouts',
    description: 'Exciting gaming landing page for Mobile Legends: Bang Bang featuring banner artwork, tournament listings, and game overview.',
    concepts: ['Gaming UI Theme', 'Hero Banner', 'Media Layout', 'Feature Grid'],
    technologies: ['HTML5', 'CSS3']
  },
  'task17.html': {
    title: 'Moonton Games Corporate Profile',
    category: 'Multimedia & Layouts',
    description: 'Detailed company profile page featuring embedded media, corporate milestones, leadership information, and contact forms.',
    concepts: ['Corporate Branding', 'Video/Media Elements', 'Grid Layout', 'About Us Section'],
    technologies: ['HTML5', 'CSS3']
  },
  'task18.html': {
    title: 'Digital Library Management System',
    category: 'Interactive Components',
    description: 'Campus library dashboard featuring book catalog cards, member management section, digital book issues, and visual tiles.',
    concepts: ['Card Grids', 'Catalog Display', 'CSS Flexbox', 'Image Badges'],
    technologies: ['HTML5', 'CSS3']
  },
  'task19.html': {
    title: 'Healthcare Footer Component',
    category: 'HTML Fundamentals',
    description: 'Polished website footer component with quick links, contact info, social handles, and copyright notice for healthcare portal.',
    concepts: ['Footer Layout', 'Flexbox Alignment', 'Link Columns', 'Social Links'],
    technologies: ['HTML5', 'CSS3']
  },
  'task21.html': {
    title: 'Student Login Portal (Audio Assisted)',
    category: 'Forms & Validation',
    description: 'Secure student login interface featuring embedded audio login instructions, credential fields, and portal access controls.',
    concepts: ['Audio Media Element', 'Form Input Types', 'Password Masking', 'Portal Authentication'],
    technologies: ['HTML5', 'CSS3', 'Audio API']
  },
  'task22.html': {
    title: 'National Technical Symposium Registration',
    category: 'Forms & Validation',
    description: 'Comprehensive symposium registration form with promotional video embed, event tracks selection, and team member fields.',
    concepts: ['Video Integration', 'Multi-input Form', 'Radio & Checkbox Groups', 'Event Registration'],
    technologies: ['HTML5', 'CSS3', 'HTML5 Video']
  },
  'task23.html': {
    title: 'Patient Clinical Registration Form',
    category: 'Forms & Validation',
    description: 'Medical patient registration form featuring regex pattern validation, contact inputs, insurance details, and real-time validation.',
    concepts: ['Input Pattern Matching', 'Regex Validation', 'Form Fieldsets', 'Error Feedback'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task25.html': {
    title: 'Corporate Employee Registration & Orientation',
    category: 'Forms & Validation',
    description: 'Full-featured enterprise onboarding registration page with welcome orientation video, personal data, and department assignment.',
    concepts: ['HTML5 Video Player', 'Comprehensive Forms', 'Fieldsets & Legends', 'Input Types'],
    technologies: ['HTML5', 'CSS3', 'HTML5 Video']
  },
  'task26.html': {
    title: 'Student Portal Login & Audio Guide',
    category: 'Forms & Validation',
    description: 'Student authentication portal with instructional voiceover guidance, validation checks, and responsive form styling.',
    concepts: ['Audio Guidance', 'Form Handling', 'Authentication UI', 'Responsive Design'],
    technologies: ['HTML5', 'CSS3', 'Audio API']
  },
  'task27.html': {
    title: 'Student Academic Registration Form',
    category: 'Forms & Validation',
    description: 'Structured academic registration form built with HTML tables, skill checkboxes, gender radios, and department selections.',
    concepts: ['Form Table Layout', 'Multi-choice Inputs', 'Form Actions', 'Data Collection'],
    technologies: ['HTML5', 'CSS3']
  },
  'task28.html': {
    title: 'University Course Registration System',
    category: 'Forms & Validation',
    description: 'Course enrollment interface allowing students to select semester, elective courses, prerequisites, and submission handling.',
    concepts: ['Dropdown Selectors', 'Checkbox Arrays', 'Academic Workflows', 'Input Verification'],
    technologies: ['HTML5', 'CSS3']
  },
  'task29.html': {
    title: 'Mouse Event Playground',
    category: 'Mouse Events',
    description: 'Interactive mouse event demonstration showing real-time feedback on click, mouseover, and mouseout events with dynamic DOM updates.',
    concepts: ['onclick', 'onmouseover', 'onmouseout', 'DOM Manipulation', 'Dynamic Style Changes'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task30.html': {
    title: 'Interactive E-Commerce Product Card',
    category: 'Mouse Events',
    description: 'Dynamic product card demonstrating mouse hover animations, image zoom effect, and click-to-cart confirmation modal.',
    concepts: ['Mouse Hover Effects', 'Event Handlers', 'Transform & Transition', 'Interactive Shopping'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task31.html': {
    title: 'Interactive Traffic Signal Simulator',
    category: 'Mouse Events',
    description: 'Realistic 3-state traffic signal light simulator with interactive mouse events changing signal colors and status messages.',
    concepts: ['State Switching', 'Mouse Interactions', 'CSS Lighting Effects', 'DOM Class Toggling'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task32.html': {
    title: 'Dynamic Weather Status Widget',
    category: 'Mouse Events',
    description: 'Interactive weather card displaying Sunny, Cloudy, and Rainy states on mouseover with animated temperature and atmosphere icons.',
    concepts: ['Hover Triggers', 'Dynamic Content Update', 'Theme Styling', 'Visual Indicators'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task33.html': {
    title: 'VIT Campus Interactive Button Hover',
    category: 'Mouse Events',
    description: 'Interactive campus action button responding to mouse movements with dynamic color transitions and informative tooltips.',
    concepts: ['Mouse Enter/Leave', 'Color Transitions', 'Interactive Buttons', 'Tooltip Feedback'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task34.html': {
    title: 'Instant Student Search (Key Events)',
    category: 'Keyboard Events',
    description: 'Live student directory lookup utilizing keyboard onkeydown events to filter records instantly as the user types.',
    concepts: ['onkeydown Event', 'Key Code Handling', 'Instant Filtering', 'DOM Search'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task35.html': {
    title: 'Virtual ATM PIN Entry Terminal',
    category: 'Keyboard Events',
    description: 'Realistic banking ATM PIN entry keypad utilizing keyboard events, automatic digit masking, and PIN length verification.',
    concepts: ['Keyboard Input Masking', 'Key Code Validation', 'Security Constraints', 'ATM UI Simulation'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task36.html': {
    title: 'Real-Time Student Search & Highlight',
    category: 'Keyboard Events',
    description: 'Interactive student search component supporting both onkeydown and oninput events with real-time text matching and highlighting.',
    concepts: ['oninput vs onkeydown', 'Live Filtering', 'List Traversal', 'Search Feedback'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task37.html': {
    title: 'Interactive Online Examination Portal',
    category: 'Interactive Components',
    description: 'Quiz interface featuring question prompts, interactive answer option selection, instant hover highlights, and answer evaluation.',
    concepts: ['Radio Selection', 'Instant Feedback', 'Score Evaluation', 'Hover Transitions'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task38.html': {
    title: 'VIT Campus Photo Gallery (Keyboard Nav)',
    category: 'Keyboard Events',
    description: 'Keyboard-controlled photo gallery allowing navigation with Left/Right arrow keys and Enter key for full preview mode.',
    concepts: ['Arrow Key Navigation', 'Keyboard Shortcuts', 'Active Slide Index', 'Image Gallery'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task39.html': {
    title: 'Travel Photo Gallery (Hotkey Controls)',
    category: 'Keyboard Events',
    description: 'Hot-key controlled destination viewer supporting "N" for next, "P" for previous, and Spacebar for destination information reveal.',
    concepts: ['Custom Hotkeys (N/P/Space)', 'Keyboard Event Listeners', 'Slide State', 'Modal Reveal'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'task40.html': {
    title: 'College Events 2026 Celebration Portal',
    category: 'Multimedia & Layouts',
    description: 'College event celebration landing page featuring countdown banner, event schedules, gallery showcase, and RSVP form.',
    concepts: ['Event Landing Page', 'Sticky Header', 'Card Layout', 'Contact RSVP'],
    technologies: ['HTML5', 'CSS3']
  },
  'CollegeEvents/index.html': {
    title: 'College Events 2026 - Bootstrap Auth Portal',
    category: 'Interactive Components',
    description: 'Comprehensive Bootstrap 5 collegiate event management application with responsive navbar, authentication modals, event cards, and gallery.',
    concepts: ['Bootstrap 5 Framework', 'Responsive Grid', 'Authentication Modals', 'Event Scheduling'],
    technologies: ['HTML5', 'Bootstrap 5', 'CSS3', 'JavaScript']
  },
  'ShoppingCart/index.html': {
    title: 'E-Commerce Shopping Cart Portal',
    category: 'Interactive Components',
    description: 'Multi-stage e-commerce checkout application linking customer details, payment methods, and live cart summary calculation.',
    concepts: ['Multi-page Workflow', 'Session State Flow', 'E-Commerce UI', 'Checkout Funnel'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'ShoppingCart/customer.html': {
    title: 'Shopping Cart - Customer & Delivery',
    category: 'Forms & Validation',
    description: 'Step 1 of the e-commerce checkout flow collecting customer address, contact phone, delivery instructions, and validation.',
    concepts: ['Address Form', 'Form Validation', 'Checkout Progression'],
    technologies: ['HTML5', 'CSS3']
  },
  'ShoppingCart/payment.html': {
    title: 'Shopping Cart - Payment Gateway',
    category: 'Forms & Validation',
    description: 'Step 2 of the checkout funnel featuring payment method selection (Credit/Debit Card, UPI, Net Banking, Cash on Delivery).',
    concepts: ['Payment UI', 'Radio Group Switching', 'Card Validation', 'Secure Checkout'],
    technologies: ['HTML5', 'CSS3']
  },
  'ShoppingCart/cart.html': {
    title: 'Shopping Cart - Order Summary',
    category: 'Interactive Components',
    description: 'Step 3 of checkout displaying order line items, quantity adjustments, calculated taxes, and total payable amount.',
    concepts: ['Dynamic Calculation', 'Order Review', 'Cart Table', 'Total Pricing'],
    technologies: ['HTML5', 'CSS3', 'JavaScript']
  },
  'test.html': {
    title: 'Dynamic Math Squares Table Generator',
    category: 'Interactive Components',
    description: 'Algorithmic JavaScript experiment calculating and rendering mathematical squares (1 to 10) dynamically using document.write in a formatted table.',
    concepts: ['for Loops', 'document.write', 'Mathematical Operations', 'Dynamic HTML Tables'],
    technologies: ['HTML5', 'JavaScript']
  }
};

// Recursive file scanner
function scanHtmlFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'miniproject' && entry.name !== '.git' && entry.name !== 'node_modules' && entry.name !== '.system_generated') {
        files = files.concat(scanHtmlFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const rawFiles = scanHtmlFiles(workspaceDir);
console.log(`Discovered ${rawFiles.length} HTML files.`);

const registry = rawFiles.map((filePath, index) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(workspaceDir, filePath).replace(/\\/g, '/');
  const filename = path.basename(filePath);
  const fileDir = path.dirname(filePath);

  // Extract Title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const cleanTitle = titleMatch ? titleMatch[1].trim() : (h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : filename);

  // Detect Events
  const mouseEvents = [...content.matchAll(/on(mouse[a-z]+|click|dblclick|contextmenu)/gi)].map(m => m[0].toLowerCase());
  const keyEvents = [...content.matchAll(/on(key[a-z]+)/gi)].map(m => m[0].toLowerCase());
  const formEvents = [...content.matchAll(/on(submit|change|input|focus|blur|reset)/gi)].map(m => m[0].toLowerCase());

  // Asset validation
  const assetRegex = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|svg|webp|mp3|wav|ogg|mp4|webm|css|js))["']/gi;
  const missingAssets = [];
  let assetMatch;
  while ((assetMatch = assetRegex.exec(content)) !== null) {
    const assetRef = assetMatch[1];
    if (assetRef.startsWith('http://') || assetRef.startsWith('https://') || assetRef.startsWith('//')) continue;
    const resolvedPath = path.resolve(fileDir, assetRef);
    if (!fs.existsSync(resolvedPath)) {
      missingAssets.push({
        reference: assetRef,
        note: `Referenced path "${assetRef}" not found on disk.`
      });
    }
  }

  // Lookup curated metadata or fallback
  const curated = TASK_METADATA[relPath] || {};

  // Technologies
  let technologies = curated.technologies || [];
  if (!technologies.length) {
    technologies.push('HTML5');
    if (content.includes('<style') || content.includes('.css') || content.includes('style=')) technologies.push('CSS3');
    if (content.includes('bootstrap')) technologies.push('Bootstrap');
    if (content.includes('<script') || mouseEvents.length || keyEvents.length) technologies.push('JavaScript');
  }

  // Categories
  let category = curated.category;
  if (!category) {
    if (keyEvents.length > 0) category = 'Keyboard Events';
    else if (mouseEvents.length > 0) category = 'Mouse Events';
    else if (content.includes('<form') || formEvents.length > 0) category = 'Forms & Validation';
    else if (content.includes('<video') || content.includes('<audio') || content.includes('<img')) category = 'Multimedia & Layouts';
    else category = 'HTML Fundamentals';
  }

  // Description
  const description = curated.description || 
    content.replace(/<style[\s\S]*?<\/style>/gi, '')
           .replace(/<script[\s\S]*?<\/script>/gi, '')
           .replace(/<[^>]+>/g, ' ')
           .replace(/\s+/g, ' ')
           .trim()
           .slice(0, 160) + '...';

  const concepts = curated.concepts || ['Web Development', 'DOM Structure'];

  // Safe unique ID
  const id = relPath.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  return {
    id,
    order: index + 1,
    title: curated.title || cleanTitle,
    filename,
    relPath,
    category,
    description,
    technologies: [...new Set(technologies)],
    concepts,
    events: {
      mouse: [...new Set(mouseEvents)],
      keyboard: [...new Set(keyEvents)],
      form: [...new Set(formEvents)]
    },
    missingAssets,
    hasMissingAssets: missingAssets.length > 0
  };
});

// Category stats
const categoryCounts = {};
registry.forEach(item => {
  categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
});

console.log('\nDiscovered Categories & Counts:');
Object.entries(categoryCounts).forEach(([cat, cnt]) => {
  console.log(`  - ${cat}: ${cnt}`);
});

// Generate assignments.json
const jsonPath = path.join(projectDir, 'assignments.json');
fs.writeFileSync(jsonPath, JSON.stringify(registry, null, 2), 'utf8');
console.log(`\nWritten JSON manifest to: ${jsonPath}`);

// Generate assignment-registry.js (client side)
const jsPath = path.join(projectDir, 'assets', 'js', 'assignment-registry.js');
const jsContent = `/**
 * MiniProject - Assignment Registry
 * Auto-generated by scripts/discover-assignments.js
 * Generated at: ${new Date().toISOString()}
 * Total Assignments: ${registry.length}
 */

(function () {
  'use strict';

  const assignments = ${JSON.stringify(registry, null, 2)};

  const categories = ${JSON.stringify(Object.keys(categoryCounts), null, 2)};

  const metadata = {
    totalAssignments: ${registry.length},
    generatedAt: "${new Date().toISOString()}",
    categoryCounts: ${JSON.stringify(categoryCounts, null, 2)}
  };

  window.MiniProject = window.MiniProject || {};
  window.MiniProject.registry = assignments;
  window.MiniProject.categories = categories;
  window.MiniProject.metadata = metadata;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { assignments, categories, metadata };
  }
})();
`;

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log(`Written JS registry to: ${jsPath}`);
console.log('='.repeat(60));
console.log('Registry Generation Successfully Completed!');
console.log('='.repeat(60));
