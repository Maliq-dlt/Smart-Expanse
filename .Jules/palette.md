## 2024-04-25 - [Accessibility Analysis]
**Learning:** Checking codebase to identify missing ARIA labels on icon-only buttons.
**Action:** Investigating TopBar.tsx and MobileNav.tsx for accessible buttons.

## 2024-04-25 - [Missing ARIA Labels & Native Tooltips on Icon Buttons]
**Learning:** Found several dynamically rendered or conditionally visible icon-only buttons (like in split bills and top nav bars) that were missing `aria-label` attributes and native browser tooltips (`title`). Relying just on icons negatively impacts screen readers, and adding `title` attributes significantly improves mouse hover discoverability without adding heavy tooltip components.
**Action:** Always verify icon-only buttons have an `aria-label` AND a `title` attribute for native tooltips, along with proper `focus-visible` styling for keyboard accessibility.
