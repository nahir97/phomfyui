# Deep Performance Audit: The Storage Bottleneck

## 1.0 Executive Summary

Following the initial performance improvements, a second investigation was triggered by the user's report of "lag when deleting words". This behavior—performance degrading specifically during rapid state updates—pointed to a synchronous I/O bottleneck rather than a rendering issue.

**The Root Cause**:
The application uses `zustand/persist` to save the entire application state to `localStorage` on **every single state change**.
- The `gallery` array contains massive JSON objects (workflow metadata).
- The `prompt` state is updated on every keystroke.
- Therefore, on every keystroke, the application runs `JSON.stringify()` on the entire gallery (potentially MBs of data) and writes it synchronously to disk via `localStorage.setItem`.

This explains why deleting words (rapid fire events) causes significant stutter: the main thread is blocked by serializing and writing the gallery to disk 30-60 times per second.

## 2.0 Findings

### 2.1 The Storage Architecture Flaw
In `lib/store.ts`:
```typescript
partialize: (state) => ({ 
  serverUrl: state.serverUrl, 
  gallery: state.gallery,      // <--- Heavy object
  prompt: state.prompt,        // <--- Changes 60fps
  // ...
}),
```
`zustand/persist` does not debounce writes by default. Including `prompt` in the same persisted object as `gallery` couples typing latency to the size of the gallery.

### 2.2 Magnitude of Data
The `gallery` stores full ComfyUI workflows. A single workflow is ~500 lines of JSON.
- 10 images ≈ 5,000 lines of JSON.
- 100 images ≈ 50,000 lines of JSON.
Stringifying and writing this to `localStorage` takes 10-50ms+ on every keypress, blowing the 16ms frame budget.

## 3.0 Corrective Actions

### 3.1 Immediate Fix (Task: STORE-OPT-001)
**Decouple Typing from Storage**:
- Remove `prompt`, `isGenerating`, `progress`, and `currentImage` from the `persist` middleware's `partialize` list.
- These states are ephemeral (session-based) and do not strictly need to be persisted to disk for the app to function.

### 3.2 Secondary Optimization (Task: STORE-OPT-002)
**Debounced Persistence (Optional)**:
- If prompt persistence is required, implement a manual, debounced `localStorage.setItem('draft_prompt', value)` inside `Generator.tsx` or a custom middleware.

### 3.3 Long-term Architecture (Task: ARCH-STORE-001)
**Split Stores**:
- `useSettingsStore`: Persisted (Server URL, Models, Gallery).
- `useSessionStore`: Ephemeral (Prompt, Progress, UI State).
- This ensures that high-frequency updates (typing) never trigger heavy serialization.

## 4.0 Validation Strategy
1.  **Reproduction**: Fill gallery with 20 items. Type rapidly. Observe lag.
2.  **Fix**: Apply store changes.
3.  **Verification**: Type rapidly. The "deleting" lag should be completely gone regardless of gallery size.
