# Spec: Prompt History UI

## 1.0 Context Assessment

### 1.1 Problem Statement
While prompts are now being saved to `data/prompts.json`, there is currently no way for the user to view or reuse these saved prompts within the application.

### 1.2 Requirements
- **Access Point**: A toggle mechanism (e.g., a `^` arrow) to reveal the prompt history.
- **Display**: A list of recently used prompts, sorted by recency (newest first).
- **Interactivity**: Clicking a prompt in the history should populate the main prompt input area.
- **Persistence**: The list should be fetched from the `/api/prompts` endpoint.
- **Deduplication (UI)**: Ensure the UI remains clean even if the backend returns many items (though backend already deduplicates).

### 1.3 Constraints
- **Design Consistency**: Must match the "ComfyPhone" aesthetic (dark theme, glassmorphism, accent colors).
- **Mobile First**: The UI should be easily usable on mobile devices.

## 2.0 Task Decomposition

### Task ID: PROMPT-UI-001 [Frontend] History Store/State
**Objective**: Add state management for fetching and storing prompt history.

#### Logic
1.  Add `history: string[]` and `setHistory` to the store or local state in `Generator.tsx`.
2.  Implement a `fetchHistory` function to call `GET /api/prompts`.
3.  Trigger fetch on component mount or when the history panel is opened.

---

### Task ID: PROMPT-UI-002 [Frontend] History Component
**Objective**: Create a reusable `PromptHistory` component to display the list.

#### Input Specifications
- **Props**: `prompts: Array<{id: string, text: string, timestamp: number}>`, `onSelect: (text: string) => void`, `onClose: () => void`.

#### Logic
1.  Render a scrollable list of prompt items.
2.  Format timestamps if necessary (or just show text).
3.  Implement "Click to use" functionality.

---

### Task ID: PROMPT-UI-003 [Frontend] Integration in Generator
**Objective**: Add the toggle button and panel to the `Generator.tsx` UI.

#### Logic
1.  Add a toggle button (ChevronUp/Down icon) near the prompt textarea.
2.  Implement an `AnimatePresence` panel that slides up to show history.
3.  Ensure the panel doesn't overlap awkwardly with the keyboard on mobile.

---

## 3.0 Validation Criteria
```yaml
functional:
  - criterion: "History list is fetched from API"
    method: "Open history panel, check network tab"
    expected: "GET /api/prompts returns 200 and data"
  - criterion: "Clicking a history item updates input"
    method: "Click a previous prompt in the list"
    expected: "Textarea value changes to the selected prompt"
  - criterion: "Toggle button works"
    method: "Click the arrow icon"
    expected: "History panel opens/closes with animation"
```
