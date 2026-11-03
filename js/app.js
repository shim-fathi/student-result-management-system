import { calculateMarks } from "./marksCalculator.js";
import { calculateGrade } from "./gradeCalculator.js";

const form = document.getElementById("resultForm");
const fields = ["studentId", "studentName", "maths", "science", "english"];
const historyBody = document.getElementById("historyBody");
const STORAGE_KEY = "studentResultManagementRecords";
let records = loadRecords();

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
function setError(field, message = "") {
  const input = document.getElementById(field);
  const error = document.getElementById(`${field}Error`);
  input.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}
function validateForm() {
  let valid = true;
  const id = document.getElementById("studentId").value.trim();
  const name = document.getElementById("studentName").value.trim();
  const idPattern = /^[A-Za-z0-9_-]{3,20}$/;
  const namePattern = /^[A-Za-z][A-Za-z .'-]{1,59}$/;

  fields.forEach(field => setError(field));
  document.getElementById("formError").textContent = "";

  if (!id) { setError("studentId", "Student ID is required."); valid = false; }
  else if (!idPattern.test(id)) { setError("studentId", "Use 3–20 letters, numbers, hyphens or underscores."); valid = false; }
  else if (records.some(record => record.studentId.toLowerCase() === id.toLowerCase())) {
    setError("studentId", "This Student ID already exists."); valid = false;
  }

  if (!name) { setError("studentName", "Student name is required."); valid = false; }
  else if (!namePattern.test(name)) { setError("studentName", "Enter a valid name (letters and spaces only)."); valid = false; }

  for (const field of ["maths", "science", "english"]) {
    const raw = document.getElementById(field).value.trim();
    if (raw === "") { setError(field, "Mark is required."); valid = false; continue; }
    const value = Number(raw);
    if (!Number.isFinite(value)) { setError(field, "Enter a valid number."); valid = false; }
    else if (value < 0 || value > 100) { setError(field, "Mark must be between 0 and 100."); valid = false; }
  }
  return valid;
}

function showResult(record) {
  document.getElementById("emptyState").hidden = true;
  document.getElementById("resultContent").hidden = false;
  document.getElementById("outName").textContent = record.studentName;
  document.getElementById("outId").textContent = record.studentId;
  document.getElementById("outTotal").textContent = record.total;
  document.getElementById("outAverage").textContent = record.average;
  document.getElementById("outPercentage").textContent = `${record.percentage}%`;
  document.getElementById("outGrade").textContent = record.grade;
  document.getElementById("outGradeText").textContent = record.description;
  document.getElementById("outRemark").textContent = record.remark;
  const status = document.getElementById("outStatus");
  status.textContent = record.status;
  status.classList.toggle("fail", record.status === "FAIL");
}

function renderHistory() {
  if (!records.length) {
    historyBody.innerHTML = '<tr class="empty-row"><td colspan="8">No saved results yet.</td></tr>';
    return;
  }
  historyBody.innerHTML = records.map(record => `
    <tr>
      <td><strong>${escapeHTML(record.studentId)}</strong></td>
      <td>${escapeHTML(record.studentName)}</td>
      <td>${record.total}</td><td>${record.average}</td><td>${record.percentage}%</td>
      <td><strong>${record.grade}</strong></td>
      <td><span class="status ${record.status === "FAIL" ? "fail" : ""}">${record.status}</span></td>
      <td><button class="delete-btn" data-delete="${escapeHTML(record.studentId)}" type="button">Delete</button></td>
    </tr>`).join("");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!validateForm()) {
    document.getElementById("formError").textContent = "Please correct the highlighted fields.";
    return;
  }

  try {
    const marks = ["maths", "science", "english"].map(field =>
      Number(document.getElementById(field).value)
    );

    // INTEGRATION: Module 01 output (percentage) becomes Module 02 input.
    const marksResult = calculateMarks(marks);
    const gradeResult = calculateGrade(marksResult.percentage);

    const record = {
      studentId: document.getElementById("studentId").value.trim(),
      studentName: document.getElementById("studentName").value.trim(),
      ...marksResult,
      ...gradeResult,
      marks,
      createdAt: new Date().toISOString()
    };
    records.unshift(record);
    saveRecords();
    renderHistory();
    showResult(record);
    document.getElementById("formError").textContent = "";
  } catch (error) {
    document.getElementById("formError").textContent = error.message;
  }
});

fields.forEach(field => {
  document.getElementById(field).addEventListener("input", () => setError(field));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  form.reset();
  fields.forEach(field => setError(field));
  document.getElementById("formError").textContent = "";
  document.getElementById("resultContent").hidden = true;
  document.getElementById("emptyState").hidden = false;
});

historyBody.addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  const id = button.dataset.delete;
  records = records.filter(record => record.studentId !== id);
  saveRecords();
  renderHistory();
});
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  if (!records.length) return;
  if (confirm("Delete all saved student results?")) {
    records = [];
    saveRecords();
    renderHistory();
  }
});

renderHistory();
