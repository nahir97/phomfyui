# Dynamic Image Layout Adjustment Specification

## 1.0 Purpose & Scope
This document specifies the implementation of a dynamic layout adjustment for the `Generator` component. The goal is to ensure that generated images automatically resize and reposition themselves to remain fully visible as the prompt input box expands, preventing any overlap or cutoff.

## 2.0 Issue Analysis

### 2.1 Current State
- The image display container in `Generator.tsx` has a fixed bottom padding (`pb-48` for mobile, `pb-32` for desktop).
- The prompt input box is auto-expanding (up to 160px).
- On mobile devices, when the input box expands or when the keyboard is active, the translucent input box overlay overlaps the bottom portion of the generated image.

### 2.2 Desired State
- The image display area should "shrink" or "shift" upwards as the input box grows.
- The bottom padding of the image container should be tied to the actual measured height of the bottom controls area.
- The image should always be contained within the remaining visible space, maintaining its aspect ratio.

## 3.0 Technical Requirements

### 3.1 Dynamic Measurement
- Implement a method to measure the height of the bottom controls container (`div` containing the textarea and buttons).
- Use a `ResizeObserver` or a `ref` with an effect to track height changes as the textarea expands.

### 3.2 Responsive Layout
- The `pb` (padding-bottom) of the image container should be dynamic instead of hardcoded.
- Ensure the adjustment is smooth (can be handled by Framer Motion or CSS transitions).

### 3.3 Constraints
- Maintain the glass/translucent effect of the input box.
- Do not break the "immersive" background effect where the blurred image fills the entire screen.
- Ensure the solution works across different mobile viewport heights (`dvh`).

## 4.0 Implementation Plan

### 4.1 Tasks
- **LAYOUT-DYN-001**: Add a `ref` to the bottom controls container in `Generator.tsx`.
- **LAYOUT-DYN-002**: Create a state variable `controlsHeight` to store the measured height.
- **LAYOUT-DYN-003**: Implement a `useEffect` with `ResizeObserver` to update `controlsHeight`.
- **LAYOUT-DYN-004**: Apply the `controlsHeight` as a dynamic padding or margin to the image container.
- **LAYOUT-DYN-005**: Verify that `object-contain` on the image correctly handles the reduced vertical space.

## 5.0 Validation Criteria
- **Functional**: Typing multiple lines in the prompt box causes the image to scale down or move up without being covered by the input box.
- **Visual**: No "jerkiness" during expansion.
- **Edge Case**: Keyboard opening/closing on mobile should be handled gracefully by the layout (Next.js/React standard behavior + our dynamic height).

## 6.0 Proposed Code Change (Conceptual)

```tsx
// In Generator.tsx
const [controlsHeight, setControlsHeight] = useState(0);
const controlsRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!controlsRef.current) return;
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      setControlsHeight(entry.contentRect.height);
    }
  });
  observer.observe(controlsRef.current);
  return () => observer.disconnect();
}, []);

// Update image container padding
<div 
  className="absolute inset-0 flex items-center justify-center pt-12 lg:pt-20 px-4"
  style={{ paddingBottom: `${controlsHeight + 16}px` }} // Dynamic padding
>
  <motion.img ... />
</div>
```
