## Task ID: COMFYPHONE-UI-002

### Objective
Maximize the generated image display area to utilize the upper screen space, removing vertical constraints that create unnecessary top gaps.

### Input Specifications
- **Source File:** `components/Generator.tsx`
- **Target Component:** `Generator` (Image Display Section)
- **Key Classes to Modify:**
  - Container flex alignment and padding (Line 230)
  - Image max-height constraints (Line 236)

### Output Specifications
- **Modified File:** `components/Generator.tsx`
- **Changes:**
  - Removed `pb-24`, `lg:pb-24`, and `px-4` from the image container to allow full viewport utilization.
  - Added `object-top` to the image to ensure it anchors to the top edge.
  - Set `max-h-screen` on the image.
  - Removed `rounded-lg` to allow for a seamless full-screen look when the image aspect ratio matches.

### Validation Criteria
```yaml
functional:
  - criterion: "Image extends to the top edge or near top edge of the screen"
    method: "Visual inspection"
    expected: "No significant black gap above the image (unless image aspect ratio dictates it)"
  - criterion: "Bottom controls remain visible and usable"
    method: "Visual inspection"
    expected: "Image does not obscure controls (or sits behind them appropriately)"

non_functional:
  - criterion: "Animation smoothness"
    method: "Interaction test"
    expected: "Transitions remain fluid"
```

### Dependencies
- Prerequisite tasks: None
- Blocked tasks: None
- Shared resources: `components/Generator.tsx`

### Implementation Notes
- Current `max-h-[85dvh]` artificially limits height.
- `items-center` centers the image vertically. If the goal is "starting from above", `items-start` with `pt-[safe-area]` might be more appropriate, or simply maximizing height will naturally fill the top if centered.
- Use `max-h-screen` or `h-full` on the image.
