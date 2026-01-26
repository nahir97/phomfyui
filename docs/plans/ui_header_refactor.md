# Task Specification: CP-UI-HEADER-REFACTOR

## Objective
Remove redundant headers and titles from main tab components to reclaim vertical space, utilizing the existing navigation bars for location context.

## Input Specifications
- Current component structure in:
  - `components/Generator.tsx`
  - `components/Gallery.tsx`
  - `components/Workflow.tsx`
  - `components/Settings.tsx`
- Layout context from `app/page.tsx`.

## Output Specifications
- Modified components with header sections (titles and subtitles) removed.
- Adjusted padding/margins to ensure content starts higher up the page.
- Relocated indicators (e.g., gallery item count) where necessary.

## Validation Criteria
```yaml
functional:
  - criterion: "Page content starts immediately below the top of the viewport/container"
    method: "Manual visual verification"
    expected: "No large 'Generate', 'Archives', 'Workflow', or 'Control' titles at the top"
  - criterion: "Essential indicators (like gallery item counts) are preserved"
    method: "Code review"
    expected: "Important data is not lost, possibly moved to a more compact location"
  - criterion: "Active tab remains clear via Navbar/Sidebar"
    method: "Manual verification"
    expected: "Navigation still reflects current location"
```

## Dependencies
- Prerequisite tasks: INFO-GATHER-001
- Blocked tasks: UI-REFACTOR-001

## Implementation Steps
1. **CP-UI-001: Refactor Generator.tsx**
   - Remove the gradient header div containing "Generate" title (Lines 273-280).
   - Ensure the main content area adjusts upwards.
2. **CP-UI-002: Refactor Gallery.tsx**
   - Remove "Archives" title and subtitle (Lines 17-24).
   - Consider moving the item count indicator to a more compact header or floating element if requested, otherwise remove.
3. **CP-UI-003: Refactor Workflow.tsx**
   - Remove "Workflow" title and "Logic visualization" subtitle (Lines 17-24).
4. **CP-UI-004: Refactor Settings.tsx**
   - Remove "Control" title and "System configurations" subtitle (Lines 114-121).
5. **CP-UI-005: Layout Polishing**
   - Check `app/page.tsx` for any top padding that needs adjustment now that headers are gone.
