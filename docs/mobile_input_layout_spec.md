# Mobile Layout and Dynamic Input Specification

## 1.0 Purpose & Scope
This specification defines the improvements for the mobile user experience, specifically addressing the unused space at the bottom of the screen on mobile browsers and making the prompt input box dynamic.

## 2.0 Layout Optimization (Mobile)

### 2.1 Issue: Unused Bottom Space
On mobile browsers with address bars (e.g., Safari, Chrome on iOS/Android), the current layout may leave a gap or not correctly fill the viewport when the address bar is visible or hidden.

### 2.2 Requirements
- **Viewport Units**: Standardize the use of `dvh` (Dynamic Viewport Height) across all main containers to ensure the UI adapts to address bar state changes.
- **Safe Area Insets**: Utilize `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` to properly position elements like the Navbar and Top Bar, especially on devices with notches or home indicators.
- **Root Height**: Ensure `html`, `body`, and the root `#id` (if applicable) or the main layout wrapper correctly occupy 100% of the available height without causing unnecessary overflow.

### 2.3 Proposed Changes
- Update `app/layout.tsx` to ensure the body and main wrapper use consistent `min-h-[100dvh]`.
- Adjust `components/Navbar.tsx` padding to use `safe-area-inset-bottom` for a more native feel.
- Audit `Generator.tsx` for redundant `min-h-[100dvh]` calls that might be causing layout jumping or incorrect sizing.

## 3.0 Dynamic Input Box

### 3.1 Issue: Fixed Input Height
The current prompt input has a fixed height (or limited range) that requires scrolling when the text exceeds a few lines, which is not user-friendly for mobile keyboards.

### 3.2 Requirements
- **Auto-Expansion**: The `textarea` should automatically increase its height as the user types to fit the content.
- **Expansion Threshold**: The height should increase only up to a specific threshold (e.g., 200px or 5-6 lines). Beyond this, it should become scrollable.
- **Fluid Transition**: The expansion should feel smooth and not jumpy.
- **Keyboard Friendliness**: Ensure the expansion doesn't push critical UI elements off-screen or conflict with the mobile keyboard.

### 3.3 Implementation Strategy
- Use a `ref` to the `textarea` in `components/Generator.tsx`.
- Implement an effect or an input handler that calculates the `scrollHeight` of the textarea and updates its style height.
- Define a constant `MAX_INPUT_HEIGHT` (e.g., `160px`).
- Set `rows={1}` initially to allow for a compact state when empty.

## 4.0 Task Registry

### 4.1 Layout Tasks
- [x] **LAYOUT-001**: Audit and standardize `dvh` usage in `app/layout.tsx` and `app/page.tsx`.
- [x] **LAYOUT-002**: Implement `safe-area-inset` in `Navbar.tsx` and `Generator.tsx`.

### 4.2 Input Tasks
- [x] **INPUT-001**: Implement auto-expanding logic in `Generator.tsx` using `scrollHeight`.
- [x] **INPUT-002**: Apply expansion threshold and styling updates to the prompt `textarea`.

## 5.0 Validation Criteria
- **Layout**: No visible gap at the bottom of the screen on iOS Safari/Chrome with address bar visible.
- **Input**: `textarea` starts at 1-2 lines height and expands as more text is added.
- **Input**: `textarea` stops expanding and starts scrolling after reaching ~160px height.
- **General**: No regressions in desktop layout.
