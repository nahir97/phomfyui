# Task Specification: CP-LAYOUT-REFACTOR

## Objective
Maximize the utilization of vertical space in the Generator tab by expanding the content (image) area into the space previously occupied by the header and moving the prompt input box closer to the bottom navigation bar.

## Input Specifications
- Current component structure in `components/Generator.tsx`.
- Bottom navbar layout from `components/Navbar.tsx` and `app/page.tsx`.

## Output Specifications
- Modified `Generator.tsx` with optimized vertical spacing.
- Larger maximum image dimensions.
- Reduced gap between prompt input and bottom navbar.

## Validation Criteria
```yaml
functional:
  - criterion: "Image extends higher into the top area of the screen"
    method: "Manual visual verification"
    expected: "Image is noticeably higher and larger than before"
  - criterion: "Prompt box is positioned closer to the navbar"
    method: "Manual visual verification"
    expected: "Gap between prompt box and navbar is minimized (approx. 0.5rem - 1rem)"
  - criterion: "Image does not overlap with prompt box"
    method: "Visual check"
    expected: "Image stays contained within the space above the prompt box"
```

## Dependencies
- Prerequisite tasks: INFO-GATHER-002
- Blocked tasks: UI-REFACTOR-002-IMAGE, UI-REFACTOR-002-INPUT

## Implementation Steps
1. **CP-LAYOUT-001: Expand Image Container**
   - In `components/Generator.tsx`, reduce `pt-12 lg:pt-20` in the image container.
   - Adjust `pb-32` to allow more space for the image while keeping clearance for the prompt box.
   - Increase `max-h-[75dvh]` and `max-h-[85dvh]` for the `img` element.
2. **CP-LAYOUT-002: Relocate Prompt Box**
   - In `components/Generator.tsx`, reduce the bottom padding of the controls container (`pb-[calc(7.5rem+env(safe-area-inset-bottom))]`).
   - Target a value closer to `5.5rem` to align with the `Navbar` height.
3. **CP-LAYOUT-003: Final Adjustments**
   - Verify that the loading overlay and other HUD elements still look correct.
