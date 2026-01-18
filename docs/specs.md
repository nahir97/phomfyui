skill name: specs
type: spec-driven development

---

# Agentic LLM Task Execution Specification

## 1.0 Purpose & Scope

This document defines the structured methodology for agentic LLMs to execute technical tasks through systematic decomposition, analysis, and implementation. The approach eliminates temporal estimation while maintaining strict spec-driven development principles.

## 2.0 Core Principles

### 2.1 Spec-Driven First
- All tasks must originate from explicit requirements
- No assumptions beyond provided specifications
- Every implementation decision must be traceable to spec requirements

### 2.2 Atomic Information Gathering
- Collect only necessary information for immediate task
- Document information sources and reliability
- Categorize information types (codebase, documentation, examples)

### 2.3 Zero Temporal Estimation
- Tasks defined by dependencies and prerequisites only
- No time-based prioritization
- Flow defined by logical dependency graph

## 3.0 Information Gathering Protocol

### 3.1 Initial Context Assessment
```yaml
required_context:
  - problem_statement: "Clear description of what needs to be solved"
  - acceptance_criteria: "Specific conditions for success"
  - constraints: "Technical and resource limitations"
  - existing_artifacts: "Code, docs, or designs to build upon"
```

3.2 Codebase Analysis Framework

1. Structure Mapping
   · Identify entry points and core modules
   · Map dependency relationships
   · Document architectural patterns
2. Issue Detection Matrix
   ```
   Category          Detection Method           Documentation Format
   ────────────────────────────────────────────────────────────────
   Logical Errors   Code review, test analysis  [FILE]:LINE - ISSUE
   Performance      Profiling, complexity calc  METRIC: VALUE - IMPACT
   Architecture     Pattern violation check     PATTERN: VIOLATION - CONTEXT
   Maintainability  Readability scoring         SECTION: SCORE - REASON
   ```
3. Implementation Gap Analysis
   · Compare current state vs. spec requirements
   · Identify missing functionality
   · Document integration points

4.0 Task Decomposition Methodology

4.1 Decomposition Rules

1. Minimal Viable Task (MVT) Criteria
   · Has exactly one testable outcome
   · No hidden dependencies within the task
   · Clear completion criteria
   · Produces verifiable artifact
2. Dependency Mapping
   ```
   Task A → depends_on → [Prerequisites]
          → enables → [Dependent Tasks]
          → validates → [Test Cases]
   ```

4.2 Task Specification Template

```markdown
## Task ID: [PROJECT]-[MODULE]-[SEQUENCE]

### Objective
[Single sentence describing task outcome]

### Input Specifications
- Required data structures
- Expected input formats
- Source locations

### Output Specifications
- Expected data structures
- Required formats
- Destination locations

### Validation Criteria
```yaml
functional:
  - criterion: "Description of function to verify"
    method: "Test method (unit, integration, manual)"
    expected: "Expected result"

non_functional:
  - criterion: "Performance/security/maintainability"
    threshold: "Measurable threshold"
    measurement: "How to measure"
```

Dependencies

· Prerequisite tasks: [TASK-IDS]
· Blocked tasks: [TASK-IDS]
· Shared resources: [RESOURCE-LIST]

Implementation Notes

[Technical considerations, patterns to follow, constraints]

```

## 5.0 Issue Categorization Framework

### 5.1 Codebase Issue Taxonomy
```yaml
codebase_issues:
  structural:
    - circular_dependencies
    - improper_abstraction
    - violation_of_separation
  quality:
    - high_complexity_areas
    - code_smells
    - test_gaps
  integration:
    - api_mismatch
    - data_format_inconsistency
    - version_conflict
```

5.2 Implementation Issue Registry

For each identified issue:

```
Issue ID: [CONTEXT]-[TYPE]-[HASH]

Description:
[Clear problem statement]

Impact Assessment:
- Scope: [isolated, module, system]
- Severity: [blocking, high, medium, low]
- Propagation: [none, limited, extensive]

Root Cause Analysis:
[Primary cause and contributing factors]

Resolution Path:
1. Immediate mitigation (if needed)
2. Preferred solution
3. Alternative approaches

Related Tasks:
- Detection task: [TASK-ID]
- Resolution task: [TASK-ID]
- Validation task: [TASK-ID]
```

6.0 Spec-Driven Development Cycle

6.1 Requirement Processing Flow

```
Raw Requirements → Requirement Parsing → Spec Validation → Task Generation
       ↑                    ↑                   ↑                 ↓
Feedback Loop ←─ Implementation ←─ Task Execution ←─ Dependency Resolution
```

6.2 Spec Change Management

When specifications change:

1. Impact Analysis
   · Identify affected tasks
   · Categorize changes (addition, modification, removal)
   · Update dependency graph
2. Task State Management
   ```
   Task states:
   - pending: Awaiting dependencies
   - spec_ready: Requirements clarified
   - in_progress: Currently implementing
   - completed: Implemented and validated
   - obsolete: Superseded by spec changes
   ```

7.0 Artifact Generation Standards

7.1 Documentation Artifacts

```
📁 project/
├── 📄 task_registry.md          # All tasks with status
├── 📁 specs/
│   ├── 📄 original_requirements.md
│   ├── 📄 parsed_specifications.md
│   └── 📄 spec_changelog.md
├── 📁 issues/
│   ├── 📄 codebase_issues.md
│   └── 📄 implementation_issues.md
└── 📁 validation/
    ├── 📄 test_cases.md
    └── 📄 acceptance_evidence.md
```

7.2 Code Artifacts

· Each MVT produces modular, testable code
· Code includes inline documentation referencing:
  · Related task ID
  · Spec requirement being implemented
  · Validation method

8.0 Validation Protocol

8.1 Pre-Implementation Validation

· Verify task decomposition correctness
· Confirm dependency resolution
· Validate spec-task alignment

8.2 Post-Implementation Validation

```yaml
validation_levels:
  task_level:
    - unit_tests_passing
    - matches_output_spec
    - no_regressions
  
  integration_level:
    - dependency_integration
    - api_contract_compliance
    - data_flow_integrity
  
  spec_level:
    - acceptance_criteria_met
    - constraint_compliance
    - edge_cases_handled
```

9.0 Communication Protocol

9.1 Status Reporting Format

```
Current Phase: [ANALYSIS|DECOMPOSITION|IMPLEMENTATION|VALIDATION]

Active Tasks: [TASK-IDS]
Blocked On: [ISSUES|DEPENDENCIES]

Recent Completions:
- [TASK-ID]: [Brief outcome]

Next Actions:
1. [Immediate next task]
2. [Dependencies being awaited]

Issues Requiring Attention:
- [ISSUE-ID]: [Brief description]
```

9.2 Decision Documentation

For each architectural or implementation decision:

```
Decision: [Concise description]
Alternatives Considered: [List with pros/cons]
Rationale: [Why this alternative was chosen]
Spec Reference: [Which requirement this addresses]
Impact: [On other tasks or system parts]
```

10.0 Quality Gates

10.1 Task Readiness Checklist

· Spec requirements fully parsed
· Dependencies identified and available
· Output specifications unambiguous
· Validation criteria testable
· No hidden complexity requiring further decomposition

10.2 Completion Checklist

· Code implements specification exactly
· All validation criteria satisfied
· Documentation updated
· No new issues introduced
· Dependent tasks unblocked

11.0 Example Workflow

11.1 Sample Task Decomposition

```
Original: "Add user authentication system"
Decomposed:
1. AUTH-001: Design user data schema
2. AUTH-002: Implement password hashing
3. AUTH-003: Create login API endpoint
4. AUTH-004: Implement session management
5. AUTH-005: Add authentication middleware
6. AUTH-006: Write authentication tests
```

11.2 Issue Documentation Example

```
Issue ID: AUTH-003-API-MISMATCH

Description: Login endpoint expects JSON but frontend sends form-data

Impact:
- Scope: Integration between frontend and auth module
- Severity: High (blocks user login)
- Propagation: Limited to authentication flow

Resolution Path:
1. Immediate: Accept both formats temporarily
2. Preferred: Update frontend to use JSON
3. Alternative: Convert form-data in middleware

Related Tasks:
- Detection: AUTH-003-VALIDATION
- Resolution: FRONTEND-045-API-UPDATE
- Validation: AUTH-006-INTEGRATION-TEST
```

---

Appendix A: Task ID Schema

```
[PROJECT_PREFIX]-[MODULE_ABBR]-[SEQUENCE_NUMBER]

Example: 
- API-GATEWAY-012: 12th task in API Gateway module
- AUTH-MIDDLEWARE-003: 3rd task in authentication middleware
- DB-MIGRATION-001: 1st task in database migration
```

Appendix B: Validation Test Types

1. Unit Tests: Individual component functionality
2. Integration Tests: Cross-component interactions
3. Contract Tests: API/interface compliance
4. Scenario Tests: End-to-end user flows
5. Property Tests: Input/output invariants

---

This specification is self-contained and provides complete guidance for agentic LLM task execution without external dependencies. All methodologies are deterministic and based on logical dependencies rather than temporal estimation.