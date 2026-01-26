# Performance Investigation Plan: ComfyPhone

## 1.0 Purpose & Scope

This document outlines the systematic investigation into identified performance bottlenecks in the ComfyPhone application. The goal is to measure, categorize, and plan the resolution of issues affecting server-side scalability, client-side responsiveness, and overall user experience.

## 2.0 Initial Context Assessment

```yaml
required_context:
  - problem_statement: "The application exhibits linear degradation in performance as data (gallery/history) grows, and potential 'jank' during frequent state updates (progress)."
  - acceptance_criteria:
    - API response times remain stable regardless of data size.
    - UI frame rates remain above 60fps during generation progress updates.
    - Main thread blocking (TBT) is minimized during state persistence.
  - constraints:
    - Must maintain local-first feel.
    - Must work within Next.js / Node.js environment.
  - existing_artifacts:
    - docs/specs.md (Process methodology)
    - app/api/gallery/route.ts (Identified bottleneck)
    - lib/store.ts (Identified bottleneck)
    - components/Generator.tsx (Identified bottleneck)
```

## 3.0 Codebase Analysis Framework

### 3.1 Structure Mapping
- **Entry Points**: `app/page.tsx`, `app/api/gallery/route.ts`
- **Core Modules**: `lib/store.ts` (State), `lib/comfy.ts` (API Client)
- **Architectural Patterns**: Next.js App Router, Zustand State Management, JSON-based persistence.

### 3.2 Issue Detection Matrix

| Category | Detection Method | Documentation Format |
| :--- | :--- | :--- |
| **I/O Scalability** | Code analysis, File size simulation | FILE:LINE - [I/O-SCALABILITY]: Issue description |
| **Main Thread Blocking** | Chrome DevTools (Performance tab) | COMPONENT:LINE - [BLOCKING]: Impact on FPS |
| **Memory Pressure** | Heap snapshots | MODULE: [MEMORY]: Leak or high retention source |
| **Network Efficiency** | Network tab, Waterfall analysis | ENDPOINT: [NETWORK]: Redundant or large payloads |

### 3.3 Implementation Gap Analysis
- **Current State**: Synchronous JSON file reads/writes for every API call.
- **Spec Requirement**: O(1) or O(log N) persistence operations.
- **Current State**: Full gallery serialization to `localStorage` on every change.
- **Spec Requirement**: Incremental or asynchronous persistence for large datasets.

## 4.0 Task Decomposition

### Phase 1: Benchmarking & Baselines
- **PERF-BASELINE-001**: Implement a script to generate 1000+ mock gallery items.
- **PERF-BASELINE-002**: Measure `GET /api/gallery` and `POST /api/gallery` latency with 0, 100, and 1000 items.
- **PERF-BASELINE-003**: Record Performance profile during 10-second generation loop (progress updates).

### Phase 2: Server-Side Optimization
- **PERF-SERVER-001**: Design SQLite schema for Gallery and Prompts.
- **PERF-SERVER-002**: Replace JSON file I/O with SQLite (better-sqlite3).
- **PERF-SERVER-003**: Implement pagination for `GET /api/gallery`.

### Phase 3: Client-Side Optimization
- **PERF-CLIENT-001**: Migrate `localStorage` persistence to `IndexedDB` for gallery items.
- **PERF-CLIENT-002**: Refactor `Generator.tsx` selectors to prevent re-renders on `progress` updates.
- **PERF-CLIENT-003**: Implement `React.memo` and virtualization for `Gallery.tsx` items.

## 5.0 Issue Categorization Framework

### 5.1 Codebase Issue Taxonomy
```yaml
codebase_issues:
  structural:
    - JSON_as_database: "Using JSON files for growing datasets leads to O(N) blocking I/O."
    - LocalStorage_overload: "Storing complex workflow objects in localStorage hits size limits and blocks main thread."
  quality:
    - Lack_of_memoization: "Expensive component trees re-rendering on every progress tick."
  integration:
    - Missing_caching_layer: "API calls triggered on mount without SWR/React-Query."
```

## 6.0 Validation Protocol

### 6.1 Post-Implementation Validation
```yaml
validation_levels:
  task_level:
    - unit_tests_passing: "Verify SQLite CRUD operations."
    - performance_check: "Verify GET /api/gallery < 50ms with 1000 items."
  
  integration_level:
    - persistence_integrity: "Confirm data persists correctly across refreshes via IndexedDB."
    - scroll_performance: "Measure 60fps during gallery scroll with 100+ items."
```

## 7.0 Next Actions

1. Execute **PERF-BASELINE-001** to establish current performance limits.
2. Draft SQLite migration schema.
3. Review `Generator.tsx` for specific selector optimizations.
