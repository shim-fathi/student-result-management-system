// MODULE 02: Grade Calculation Module
// Grade boundaries can be changed here if your assignment uses another scale.
export function calculateGrade(percentage) {
  if (typeof percentage !== "number" || !Number.isFinite(percentage) ||
      percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be a number between 0 and 100.");
  }

  if (percentage >= 75) return { grade: "A", description: "Excellent", status: "PASS", remark: "Outstanding performance!" };
  if (percentage >= 65) return { grade: "B", description: "Very Good", status: "PASS", remark: "Well done!" };
  if (percentage >= 50) return { grade: "C", description: "Good", status: "PASS", remark: "Good effort!" };
  if (percentage >= 35) return { grade: "S", description: "Satisfactory", status: "PASS", remark: "You have passed." };
  return { grade: "F", description: "Fail", status: "FAIL", remark: "More practice is needed." };
}
