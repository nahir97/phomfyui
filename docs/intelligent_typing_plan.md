# Intelligent Typing System Plan

This document outlines the step-by-step implementation plan for the intelligent tag suggestion system using `tags.db`.

## 1. Dependencies & Configuration

### TASK-TAGS-001: Install Database Dependencies
**Objective**: Enable the application to communicate with the SQLite database.
**Actions**:
- Install `better-sqlite3` for fast, synchronous SQLite operations.
- Install `@types/better-sqlite3` for TypeScript support.
- **Verification**: Verify `package.json` includes the new dependencies.

## 2. Backend Implementation

### TASK-TAGS-002: Create Tag Service Utility
**Objective**: Abstract database operations into a reusable service.
**Input**: `tags/tags.db` path.
**Output**: TypeScript module `lib/tags.ts` with function `searchTags(query: string, limit: number)`.
**Details**:
- Implement a singleton database connection.
- Create a function to query the `tags` table.
- Query Logic: `SELECT name, tag_type, post_count FROM tags WHERE name LIKE ? ORDER BY post_count DESC LIMIT ?`.
- Map `tag_type` to a standardized enum/string if needed.

### TASK-TAGS-003: Implement Tag Suggestion API
**Objective**: Expose tag search to the frontend.
**Input**: HTTP GET Request to `/api/tags`.
**Output**: JSON response with matching tags.
**Details**:
- Create `app/api/tags/route.ts`.
- Parse `searchParams` for a query string (e.g., `?q=so`).
- Call `searchTags` from `lib/tags.ts`.
- Return structured JSON: `{ tags: [{ name: "solo", type: "general", count: 12345 }, ...] }`.

## 3. Frontend Implementation

### TASK-TAGS-004: Create Tag Autocomplete Component Logic
**Objective**: Handle input parsing and state for suggestions.
**Input**: Current text input, cursor position.
**Output**: `useTagAutocomplete` hook or logic.
**Details**:
- Identify the "active word" being typed based on cursor position.
- Debounce input to avoid API spam (e.g., 200ms).
- Fetch suggestions from `/api/tags` when the active word length > 2 characters.
- Store suggestions in local state.

### TASK-TAGS-005: Create Suggestion UI Component
**Objective**: Visual display of tag suggestions.
**Input**: List of tags from TASK-TAGS-004.
**Output**: `components/TagSuggestions.tsx`.
**Details**:
- Create a floating list/popover.
- Style according to "Refined Industrial" theme (dark, glassmorphism).
- Show tag name and post count.
- Color-code based on `tag_type` (e.g., general: white, artist: yellow, character: green, copyright: purple).
- Handle click events to trigger selection.

### TASK-TAGS-006: Integrate with Generator Component
**Objective**: Connect the autocomplete system to the main prompt input.
**Input**: `components/Generator.tsx`.
**Output**: Modified `Generator` component.
**Details**:
- Import and use the autocomplete logic/component.
- Overlay the suggestion list near the textarea or cursor (or a fixed position for mobile friendliness).
- Implement key navigation (Up/Down/Enter) for keyboard users.
- Implement tag insertion: Replace the partial word with the selected tag.

## 4. Validation

### TASK-TAGS-007: End-to-End Verification
**Objective**: Ensure the system works as intended.
**Validation**:
- Type "so" -> Suggest "solo", "socks", etc.
- Type an artist name -> Suggest artist tags with correct color/type.
- Select a tag -> Textarea updates correctly.
- Verify performance (no lag while typing).
