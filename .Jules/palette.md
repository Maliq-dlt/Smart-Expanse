## 2026-05-03 - Added Accessibility to Icon-Only Buttons
**Learning:** In Next.js with Material Symbols, icon-only buttons need more than just `aria-label`. They need `aria-hidden=\"true\"` on the icon text itself so screen readers don't read "visibility" as the button content, `title` for hover tooltips, and `focus-visible` states for keyboard navigation.
**Action:** Standardize icon buttons across the app to use `aria-label`, `title`, `focus-visible` utility classes, and `aria-hidden=\"true\"` on the inner span.
