## Task ID: COMFYPHONE-UI-001

### Objective
Optimize image display area to utilize top vertical space and resolve input box collision with the bottom navigation bar.

### Input Specifications
- **Source File:** `C:\Users\Aeros\Desktop\ComfyPhone\components\Generator.tsx`
- **Target Sections:**
  - Image container padding and max-height (Line 230, 236)
  - Input container bottom padding (Line 273)

### Output Specifications
- **Modified File:** `C:\Users\Aeros\Desktop\ComfyPhone\components\Generator.tsx`
- **Changes:**
  - Reduce `pt-6 lg:pt-10` to `pt-0` in image container.
  - Increase `pb-[calc(5.5rem+env(safe-area-inset-bottom))]` to `pb-[calc(6.5rem+env(safe-area-inset-bottom))]` (or similar) to prevent collision.

### Validation Criteria
```yaml
functional:
  - criterion: "Generated images start from the top of the UI"
    method: "Manual visual verification"
    expected: "No large gap at the top of the image container"
  - criterion: "Input box does not collide with the navbar"
    method: "Manual visual verification"
    expected: "Input box is clearly above the navbar with a minimal gap"

non_functional:
  - criterion: "Responsive layout preservation"
    method: "Check 'lg:' variants"
    expected: "Layout remains stable on desktop and mobile"
```

### Dependencies
- Prerequisite tasks: None
- Blocked tasks: None
- Shared resources: `components/Generator.tsx`

### Implementation Notes
- The navbar is fixed to the bottom with `pb-[calc(1rem+env(safe-area-inset-bottom))]`.
- The input box is positioned via the bottom padding of its parent container.
- Use `6.5rem` for bottom padding to ensure clearance while remaining "extremely near".
