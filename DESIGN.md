# Design System Specification: Editorial Warmth

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Sensory Curator."** 

This system rejects the cold, clinical nature of modern SaaS interfaces in favor of a high-end, editorial experience that feels like a physical lifestyle magazine. We move beyond "standard UI" by embracing **Tonal Depth** and **Asymmetric Breathing Room**. 

The goal is to evoke the aroma of a fresh roast and the tactile comfort of a ceramic mug. We achieve this not through heavy lines, but through a sophisticated layering of warm neutrals and "ghost" elevations. This is a premium digital space that feels human, intentional, and inviting.

---

## 2. Colors & Surface Philosophy
The palette is rooted in organic, earth-derived tones. We prioritize "Optical Weight" over structural lines.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
*   **Boundaries** must be defined solely through background color shifts. 
*   Transition from `surface` to `surface-container-low` to signal a new content area.
*   If a visual break is needed, use a generous `spacing-12` gap rather than a divider.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine, textured paper.
*   **Base:** `surface` (#fff8f1) is our canvas.
*   **Containment:** Use `surface-container` (#f5ede1) for large content blocks.
*   **Interaction:** Use `surface-container-highest` (#e9e1d6) for nested elements like cards or search bars to create a natural "set-in" look.

### The "Glass & Grain" Rule
To achieve the "Starbucks Reserve" high-end feel:
*   **Glassmorphism:** Use `surface-container-lowest` at 80% opacity with a `20px` backdrop blur for floating navigation bars or overlays.
*   **Signature Textures:** Apply a subtle 3% monochromatic grain overlay to `primary-container` (#3c2f2f) backgrounds to add tactile "soul."

---

## 3. Typography: The Editorial Voice
Our typography balance conveys authority through `Plus Jakarta Sans` and approachability through `Inter`.

*   **Display & Headline (Plus Jakarta Sans):** These are our "Hooks." Use `display-lg` with tight letter-spacing (-0.02em) for hero sections. The bold weight of the roasted brown (`on-surface`) provides a "Deep Roast" visual anchor.
*   **Body & Labels (Inter):** Our "Conversation." Body text must always use `spacing-4` or `spacing-5` line height to ensure maximum breathability. 
*   **Hierarchy Note:** Use `secondary` (#99462a) sparingly for `title-sm` accents to highlight artisanal details or "Chef's Recommendations."

---

## 4. Elevation & Depth: Tonal Layering
We avoid the "floating box" look of 2014-era Material Design. Depth is organic.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The subtle brightness shift creates a "soft lift" that feels premium and integrated.
*   **Ambient Shadows:** If an element must float (e.g., a floating action button), use a shadow with a `24px` blur, `0%` spread, and a color derived from `on-surface` at `6%` opacity. It should look like a soft shadow cast on a linen tablecloth.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` token at **15% opacity**. This creates a suggestion of a boundary without interrupting the visual flow.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background with `on-primary` text. Use `rounded-lg` (1rem). No shadows; use a subtle scale-up (1.02x) on hover.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. This is our "Terracotta" moment—warm and inviting.
*   **Tertiary:** Ghost style. No container. `primary` text weight set to Bold with a `tertiary-fixed` underline on hover.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines.
*   **Structure:** Use `spacing-6` between list items. Use a `surface-container-low` background on hover to indicate interactivity.
*   **Layout:** Cards should use `rounded-xl` (1.5rem) to feel soft and approachable.

### Input Fields
*   **State:** Default state uses `surface-container-high` as a solid fill. No border.
*   **Focus:** Transition the background to `surface-container-lowest` and add a `1px` ghost border using `secondary` at 40% opacity.

### Featured Components
*   **The "Flavor Chip":** Use `tertiary-container` (Sage Green) for freshness indicators (e.g., "Organic," "Freshly Roasted"). It provides a pop of "garden" freshness against the warm browns.
*   **The Curated Menu Item:** A large-scale list item using `display-sm` for the price and `headline-sm` for the dish name, separated only by white space.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. A photo of a latte should slightly overlap a `surface-container` edge to create depth.
*   **Do** use `tertiary` (Sage Green) only for "Fresh" or "Natural" callouts.
*   **Do** lean into `spacing-16` and `spacing-20` for section margins. Space is a luxury.

### Don'ts
*   **Don't** use pure black (#000000). Always use `primary` (#261a1a) for the deepest tones.
*   **Don't** use 90-degree corners. Everything must have at least a `rounded-sm` (0.25rem) to maintain the "Warm/Friendly" brand pillar.
*   **Don't** use standard "Drop Shadows." If it looks like a default plugin setting, it’s wrong. Layer the surfaces instead.