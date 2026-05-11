## 2024-05-11 - Icon Button Accessibility Pattern
**Learning:** Found a specific pattern for making icon-only buttons accessible and user-friendly in the app: localized `aria-label`s for screen readers, matching `title` attributes for native tooltips, keyboard focus states (`focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] outline-none`), and hiding inner decorative icons via `aria-hidden="true"`.
**Action:** Apply this comprehensive accessibility pattern systematically when implementing new icon-only interactive elements.
