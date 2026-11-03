# Student Result Management System

A browser-based integration testing practice project using HTML, CSS and JavaScript ES modules.

## Modules
1. **Marks Calculation Module** (`js/marksCalculator.js`)
   - Calculates total, average and percentage for Mathematics, Science and English.
   - Validates that exactly three marks are supplied and each is between 0 and 100.
2. **Grade Calculation Module** (`js/gradeCalculator.js`)
   - Receives the percentage from Module 1.
   - Calculates grade and pass/fail status.

## Integration
`js/app.js` calls `calculateMarks(marks)`, then passes `marksResult.percentage` to `calculateGrade(...)`. This is the integration point between the two modules.

## Validation
- Student ID is required; 3–20 letters, numbers, `_` or `-`; duplicate IDs are rejected.
- Student name is required and must contain a valid name.
- All three marks are required numeric values from 0 to 100.
- Module functions also validate their own inputs, so invalid values cannot bypass form validation.

## Grade scale used
- A: 75–100
- B: 65–74.99
- C: 50–64.99
- S: 35–49.99
- F: below 35
- Pass mark: 35

Change the boundaries in `js/gradeCalculator.js` if your lecturer specifies a different grading scale.

## Run
1. Extract the ZIP.
2. Open the project folder in VS Code.
3. Start a local static server. Recommended: install the **Live Server** VS Code extension, then right-click `index.html` → **Open with Live Server**.
4. Enter a Student ID, name and marks, then click **Calculate Student Result**.

Do not open `index.html` directly with `file://`; ES module imports may be blocked by the browser.

## Example
Marks: Mathematics 80, Science 75, English 85
- Total: 240 / 300
- Average: 80
- Percentage: 80%
- Grade: A
- Status: PASS

## Integration test ideas
- 80, 75, 85 → 80%, Grade A, PASS
- 60, 60, 60 → 60%, Grade C, PASS
- 20, 25, 30 → 25%, Grade F, FAIL
- 0, 0, 0 → 0%, Grade F, FAIL
- 100, 100, 100 → 100%, Grade A, PASS
- Blank mark, negative mark, mark above 100, duplicate ID → validation error
