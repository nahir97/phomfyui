# Desktop Adaptation Plan - ComfyPhone

## 1.0 Purpose & Scope
This document outlines the strategy for dynamically adapting ComfyPhone's mobile-centric UI for wide/desktop displays while preserving its unique aesthetic and mobile-first logic.

## 2.0 Architectural Changes

### 2.1 Responsive Layout Shell
- **Current**: Single-column vertical layout with fixed bottom navigation.
- **Proposed**: 
  - **Mobile (<1024px)**: Keep current bottom navigation and full-width content.
  - **Desktop (>=1024px)**: Transition to a side-navigation architecture.
  - Introduce a `ResponsiveLayout` wrapper in `app/layout.tsx` or `app/page.tsx` that handles the conditional rendering of navigation components.

### 2.2 Navigation Redesign
- **Component**: Create a `Sidebar` component for desktop.
- **Aesthetic**: Vertical glassmorphism bar on the left side, featuring the same glowing active states and icons as the mobile navbar.
- **Behavior**: Persistent on wide screens, freeing up the bottom area for larger content or status indicators.

## 3.0 Component-Specific Adaptations

### 3.1 Generator (Focus)
- **Image Display**: 
  - On desktop, the image should occupy the central/right area with more generous scaling.
  - Implement a "Dual-Pane" mode for desktop: Prompt/Controls on the left (or floating), Image on the right.
- **HUD Controls**: 
  - Reposition prompt bar to be more accessible via keyboard (centered or pinned to a logical section rather than just the viewport bottom).
  - Use wider layouts for prompt input to reduce vertical scrolling.

### 3.2 Archives (Gallery)
- **Grid Scaling**:
  - Implement responsive column counts: `grid-cols-2` (mobile) → `grid-cols-3` (tablet) → `grid-cols-4` to `grid-cols-6` (desktop).
- **Lightbox**:
  - Optimize the full-screen view for desktop aspect ratios, ensuring the "Use as Base" and "Download" buttons are comfortably placed for mouse interaction.

### 3.3 Workflow & Control (Settings)
- **Layout**:
  - Use a multi-column grid for settings groups on desktop to reduce excessive vertical scrolling.
  - Workflow nodes can be displayed in a more compact, multi-column grid or a wider list that shows more details at once.

## 4.0 Visual & Interaction Polish
- **Mouse UX**: 
  - Add hover states for all interactive elements (buttons, nodes, gallery items).
  - Ensure scrollable areas have custom, thin scrollbars to match the "ComfyPhone" aesthetic.
- **Keyboard Shortcuts**: 
  - Implement basic shortcuts (e.g., `Ctrl+Enter` to generate, `1-4` to switch tabs).

## 5.0 Implementation Roadmap
1. **Context Assessment**: Verify existing breakpoint usage in Tailwind config.
2. **Layout Refactoring**: Modify `app/page.tsx` to support `Sidebar` vs `Navbar`.
3. **Component Updates**: Iteratively update `Generator`, `Gallery`, `Workflow`, and `Settings` with responsive Tailwind classes.
4. **Verification**: Test across various viewport widths (Mobile, Tablet, 1080p, 1440p+).

---
*Created by Antigravity - January 18, 2026*
