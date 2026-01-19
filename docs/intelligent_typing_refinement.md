# Intelligent Typing Refinement Plan

This document outlines the refinements to the intelligent tag suggestion system to handle multi-word tags and suppress redundant suggestions.

## 1. Context Assessment

### Issue ID: TAG-REDUNDANT-SUGGESTION
- **Description**: Suggestions appear for words that are already followed by a comma (completed tags).
- **Resolution**: Suppress fetching if the character immediately following the detected active word is a comma.

### Issue ID: TAG-MULTIWORD-DETECTION
- **Description**: Word boundary detection splits at spaces, preventing suggestions for multi-word tags like "sitting at floor" once the first space is typed.
- **Resolution**: Redefine "active word" boundaries to be comma-delimited rather than space-delimited.

## 2. Task Decomposition

### TASK-TAG-REFINE-001: Update Word Boundary Logic
**Objective**: Allow spaces in the active word to support multi-word tag lookups.
**Input**: `hooks/useTagAutocomplete.ts`
**Details**:
- Modify `updateActiveWord` to look back/forward until a **comma** or the string boundary is reached, instead of splitting on whitespace.
- Trim the resulting string to remove leading/trailing whitespace for the API query.

### TASK-TAG-REFINE-002: Implement Suggestion Suppression
**Objective**: Prevent suggestions for already tagged words.
**Input**: `hooks/useTagAutocomplete.ts`
**Details**:
- In `updateActiveWord`, detect if the word at the cursor is followed by a comma.
- Set a state or flag `isCompletedTag` to true if a comma is detected immediately after the word boundary.
- Skip the `fetch` in the `useEffect` if `isCompletedTag` is true.

### TASK-TAG-REFINE-003: Refine Tag Insertion for Multi-word Tags
**Objective**: Ensure inserting a multi-word tag correctly replaces the entire comma-delimited segment.
**Input**: `hooks/useTagAutocomplete.ts`
**Details**:
- Update `insertTag` to use the new comma-based boundaries for replacement.

## 3. Validation Criteria

```yaml
functional:
  - criterion: "Typing 'sitting at' suggests 'sitting at floor'"
    method: "Manual"
    expected: "Multi-word suggestions appear after space"
  - criterion: "Cursor inside 'solo,' does not show suggestions"
    method: "Manual"
    expected: "No suggestions popup visible"
  - criterion: "Selecting a multi-word tag replaces the correct segment"
    method: "Manual"
    expected: "Full segment between commas is replaced"
```
