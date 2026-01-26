# Spec: Automated Prompt History Saving

## 1.0 Context Assessment

### 1.1 Problem Statement
Currently, user prompts are transient and lost after generation unless manually saved. Users require a system to automatically persist prompts upon submission to the ComfyUI API. This system must ensure the stored list remains concise by deduplicating identical entries.

### 1.2 Requirements
- **Automatic Persistence**: Prompts must be saved when the user submits a request to ComfyUI.
- **Deduplication**: Identical prompts must not be duplicated in the storage.
- **Persistence Layer**: Prompts should be stored in a permanent file structure (e.g., JSON in `data/`).
- **Data Integrity**: The list should be preserved across sessions.

### 1.3 Constraints
- **Format**: JSON storage for compatibility with existing `data/gallery.json` patterns.
- **Scope**: Focus on *saving* mechanism.

## 2.0 Task Decomposition

### Task ID: PROMPT-001 [Backend] Storage Infrastructure & API
**Objective**: Create the server-side logic to persist prompts in a deduplicated JSON file.

#### Input Specifications
- **Endpoint**: `POST /api/prompts`
- **Payload**: `{ "prompt": "string", "timestamp": number }`
- **Storage File**: `data/prompts.json`

#### Output Specifications
- **Success Response**: `200 OK` (Saved or Exists)
- **File Update**: `data/prompts.json` updated with new prompt if unique.

#### Logic
1.  Check if `data/prompts.json` exists; create if not (default: `[]`).
2.  Read existing prompts.
3.  Compare incoming prompt text with existing entries (case-sensitive? exact match).
4.  If unique, append to array and write to disk.
5.  If duplicate, ignore and return success.

#### Validation Criteria
```yaml
functional:
  - criterion: "New prompt is added to file"
    method: "Send unique string, check file content"
    expected: "File contains new string"
  - criterion: "Duplicate prompt is not added"
    method: "Send existing string, check file length"
    expected: "File length unchanged"
```

---

### Task ID: PROMPT-002 [Frontend] Submission Integration
**Objective**: Integrate the saving mechanism into the prompt submission workflow.

#### Input Specifications
- **Source**: `components/Generator.tsx` or `lib/comfy.ts` (queuePrompt function)
- **Data**: Current prompt text from store.

#### Output Specifications
- **Action**: Async `fetch` call to `/api/prompts`.
- **Timing**: Triggered alongside `queuePrompt`.

#### Logic
1.  Identify the point of prompt submission (`queuePrompt` or `handleQueue`).
2.  Extract the positive prompt text.
3.  Asynchronously call `POST /api/prompts` with the prompt data.
4.  Handle errors silently (do not block generation).

#### Validation Criteria
```yaml
functional:
  - criterion: "API called on generation"
    method: "Click Queue Prompt, check network tab"
    expected: "POST /api/prompts request sent"
```

---

## 3.0 Implementation Notes
- **File Locking**: Ensure race conditions don't corrupt `prompts.json` if multiple requests happen fast (though unlikely for single user, good practice).
- **Error Handling**: The saving process should be non-blocking for the main ComfyUI generation flow.
- **Data Structure**:
  ```json
  [
    {
      "id": "uuid",
      "text": "prompt text...",
      "timestamp": 1234567890
    }
  ]
  ```
