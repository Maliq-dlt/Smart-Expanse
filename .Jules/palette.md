## 2026-04-27 - Accessible Icon-Only Buttons
**Learning:** Found that multiple icon-only buttons in the application lack proper accessibility attributes (like `aria-label`, `title`, `aria-hidden` on the icon, and keyboard focus states). These are crucial for screen reader users and keyboard navigation.
**Action:** When adding or reviewing icon-only buttons, always ensure they include `aria-label` (for screen readers), `title` (for hover tooltips), `focus-visible` styling for keyboard navigation, and `aria-hidden="true"` on the inner icon element.
