
## 2024-05-18 - Full Accessibility of Icon-only Buttons
**Learning:** Icon-only action buttons (e.g., edit, delete in lists) frequently lack necessary context for screen readers and visual hover titles. Using solely an `aria-label` is good, but combining it with `title` (for mouse hover tooltips), `aria-hidden="true"` on the icon element itself (to prevent double announcing or visual icon character reading by screen readers), and `focus-visible:ring-2` (for distinct keyboard focus) provides a significantly more inclusive and robust experience.
**Action:** When creating icon-only action buttons, always ensure the trifecta: `aria-label` (screen reader context), `title` (visual tooltip), and `aria-hidden="true"` on the internal icon span, paired with explicit `focus-visible` styling.
