// MODULE 01: Marks Calculation Module
export function calculateMarks(marks) {
  if (!Array.isArray(marks) || marks.length !== 3) {
    throw new Error("Exactly three subject marks are required.");
  }
  const valid = marks.every(value =>
    typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
  );
  if (!valid) throw new Error("Each mark must be a number between 0 and 100.");

  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const average = total / marks.length;
  const percentage = (total / (marks.length * 100)) * 100;

  return {
    total: Number(total.toFixed(2)),
    average: Number(average.toFixed(2)),
    percentage: Number(percentage.toFixed(2))
  };
}
