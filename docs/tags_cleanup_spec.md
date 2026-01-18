# Task ID: TAGS-DB-CLEANUP-001

## Objective
Update `tags.db` to replace HTML entities in the `name` and `original_name` columns with their corresponding symbols.

## Input Specifications
- Database: `C:\Users\Aeros\Desktop\ComfyPhone\tags\tags.db`
- Table: `tags`
- Target Columns: `name`, `original_name`
- HTML Entities to replace:
    - `&amp;` -> `&`
    - `&lt;` -> `<`
    - `&gt;` -> `>`
    - `&#039;` -> `'`
    - `&quot;` -> `"`

## Output Specifications
- Database: `C:\Users\Aeros\Desktop\ComfyPhone\tags\tags.db` (In-place update)
- Records should have clean symbols instead of HTML entities.

## Validation Criteria
```yaml
functional:
  - criterion: "No HTML entities remaining in tags.name"
    method: "SQL query searching for %&%:% patterns"
    expected: "0 results"
  - criterion: "Symbols are correctly represented"
    method: "Manual inspection of previously identified samples"
    expected: "Samples like '&gt;:(' become '>:( '"

non_functional:
  - criterion: "Data integrity"
    threshold: "Total row count remains constant"
    measurement: "SELECT COUNT(*) FROM tags before and after"
```

## Dependencies
- Prerequisite tasks: None
- Shared resources: `tags.db`

## Implementation Notes
- Use `better-sqlite3` as it is already a project dependency.
- Perform updates in a transaction to ensure atomicity.
- Iteratively replace all occurrences of identified entities.
- Backup the database before performing updates.
