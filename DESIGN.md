# Design System Strategy: The Website Assistant

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Website Assistant."** Unlike standard utility apps that feel crowded and industrial, this system treats every interface as a high-end gallery space. It is defined by "The Luxury of Space"—using generous white space (Scale 8 to 16) not just as a gap, but as a deliberate design element that focuses the user's attention.

The system breaks the traditional "boxed" template by utilizing **intentional asymmetry** and **tonal layering**. High-contrast typography scales (pairing Manrope for dramatic headlines with Inter for functional body text) create an editorial rhythm that feels premium, professional, and bespoke.

A screenshot of the user interface can be found in `DESIGN.png`

## 2. Colors & Surface Philosophy
The palette is a sophisticated range of cool neutrals and slate-toned blues, designed to recede and allow user content to take center stage.

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are strictly prohibited** for sectioning or containment. Structural boundaries must be defined through:
* **Tonal Shifts:** Placing a `surface-container-low` (#f0f4f7) card against a `surface` (#f7f9fb) background.
* **Negative Space:** Using the Spacing Scale (e.g., `10` or `12`) to imply separation without visual noise.

### Surface Hierarchy & Nesting
Think of the UI as a physical desk with stacked sheets of fine paper.
* **Base:** `surface` (#f7f9fb).
* **Elevated Content:** Use `surface-container-lowest` (#ffffff) for primary cards to create a "lifted" feel.
* **Recessed Areas:** Use `surface-dim` (#cfdce3) or `surface-container-high` (#e1e9ee) for search bars or secondary utility zones.

### Signature Textures & Glassmorphism
* **The "Glass" Rule:** For floating navigation or modal overlays, use `surface` with 80% opacity and a `20px` backdrop-blur. This creates a "frosted glass" effect that keeps the layout feeling integrated.
* **Editorial Gradients:** Main CTAs or active states should utilize a subtle linear gradient from `primary` (#506169) to `secondary` (#526073) at a 135-degree angle to add depth and "soul" to the professional palette.

## 3. Typography
Typography is the voice of the system. We use a dual-typeface system to balance authority with readability.

* **Display & Headlines (Manrope):** Used for "Editorial Moments." Large sizes like `display-lg` (3.5rem) should be used with tight letter-spacing (-2%) to feel like a premium magazine masthead.
* **Title & Body (Inter):** Used for "Functional Moments." Inter provides maximum legibility at smaller scales. `body-md` (0.875rem) is the workhorse for all metadata.
* **Hierarchy as Identity:** Always maintain at least two scale jumps between a headline and body text (e.g., `headline-sm` paired with `body-md`) to ensure clear visual dominance.

## 4. Elevation & Depth
In this design system, depth is felt, not seen. We move away from heavy drop shadows toward "Ambient Light."

* **Tonal Layering Principle:** Use the `roundedness-lg` (1rem) for cards. Achieve depth by placing a `#ffffff` card on a `#f7f9fb` background. The color contrast provides 90% of the perceived elevation.
* **Ambient Shadows:** If a shadow is required for a floating action, use: `box-shadow: 0 12px 40px rgba(42, 52, 57, 0.06)`. The shadow color is a low-opacity version of `on-surface`, creating a natural, diffused light effect.
* **The "Ghost Border" Fallback:** If a container requires more definition (e.g., on very bright screens), use `outline-variant` (#a9b4b9) at **15% opacity**. Never use 100% opacity outlines.

## 5. Components

### Buttons
* **Primary:** Solid `primary` (#506169) with `on-primary` text. Use `roundedness-md` (0.75rem). Sizing should be substantial: `height: 3.5rem`.
* **Secondary:** `surface-container-highest` (#d9e4ea) background with `on-surface` text. No border.
* **Tertiary:** Text-only using `primary` color, bold weight, with a `0.35rem` (Scale 1) bottom margin of white space to define the hit area.

### Cards & Lists
* **The "No-Divider" Rule:** Horizontal rules are forbidden. Separate list items using `spacing-3` (1rem) of vertical padding and subtle background shifts.
* **Active State:** When a list item is selected (e.g., the 'Products' folder in the reference), transition to `primary` (#506169) with `on-primary` text and a subtle `0.5rem` inner shadow.

### Input Fields
* **Style:** Minimalist underline or soft-filled. Use `surface-container-low` (#f0f4f7) with `roundedness-sm`.
* **Focus State:** Shift background to `surface-container-lowest` (#ffffff) and add a `2px` "Ghost Border" of `primary` at 40% opacity.

### Additional Signature Component: The "Progress Float"
For storage or status indicators (as seen in the reference), use a `surface-container-lowest` bar with a `primary-fixed-dim` (#c6d7e1) fill. The label should use `label-sm` in `on-surface-variant` for an understated, high-end look.

## 6. Do's and Don'ts

### Do
* **Do** use asymmetrical margins. For example, a wider left margin (Scale 6) than right margin (Scale 4) can create an editorial, modern feel.
* **Do** lean into `surface-container` tiers to create hierarchy.
* **Do** use `manrope` for all numerical data to give it a "designed" feel.

### Don't
* **Don't** use pure black (#000000) for text. Always use `on-surface` (#2a3439) to maintain tonal softness.
* **Don't** use "Default" shadows. If the shadow looks like a shadow, it’s too dark. It should look like a soft glow.
* **Don't** crowd the edges. If a component is within `1rem` of the screen edge, increase the padding. The "Website Assistant" needs room to breathe.