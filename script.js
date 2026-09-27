// ===== Grab DOM elements =====
const form = document.getElementById("resultForm");
const nameInput = document.getElementById("studentName");
const htmlInput = document.getElementById("htmlMarks");
const cssInput = document.getElementById("cssMarks");
const jsInput = document.getElementById("jsMarks");
const resultBox = document.getElementById("resultBox");

const errName = document.getElementById("err-name");
const errHtml = document.getElementById("err-html");
const errCss = document.getElementById("err-css");
const errJs = document.getElementById("err-js");

// ===== Helper: clear all previous errors / invalid styling =====
function clearErrors() {
  [errName, errHtml, errCss, errJs].forEach((el) => (el.textContent = ""));
  [nameInput, htmlInput, cssInput, jsInput].forEach((el) =>
    el.classList.remove("invalid"),
  );
}

// ===== Helper: validate a single marks field =====

function validateMarks(value) {
  if (value.trim() === "") {
    return "Marks are required.";
  }

  if (!/^\d+(\.\d+)?$/.test(value.trim())) {
    return "Marks should accept numbers only.";
  }

  const numValue = Number(value);

  if (numValue < 0 || numValue > 100) {
    return "Marks must be between 0 and 100.";
  }

  return "";
}

// ===== Helper: determine grade from percentage =====
function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  else if (percentage >= 80) return "A";
  else if (percentage >= 70) return "B";
  else if (percentage >= 60) return "C";
  else if (percentage >= 50) return "D";
  else if (percentage >= 40) return "E";
  else return "F";
}

// ===== Main validation function =====
function validateForm() {
  clearErrors();
  let isValid = true;

  // Student name check
  if (nameInput.value.trim() === "") {
    errName.textContent = "Student name should not be empty.";
    nameInput.classList.add("invalid");
    isValid = false;
  }

  // Subject marks checks
  const fields = [
    { input: htmlInput, errorEl: errHtml },
    { input: cssInput, errorEl: errCss },
    { input: jsInput, errorEl: errJs },
  ];

  fields.forEach(({ input, errorEl }) => {
    const message = validateMarks(input.value);
    if (message) {
      errorEl.textContent = message;
      input.classList.add("invalid");
      isValid = false;
    }
  });

  return isValid;
}

// ===== Render the result dynamically on the page =====
function displayResult(name, htmlMarks, cssMarks, jsMarks) {
  const total = htmlMarks + cssMarks + jsMarks;
  const maxTotal = 300;
  const percentage = (total / maxTotal) * 100;

  const passed =
    percentage >= 40 && htmlMarks >= 33 && cssMarks >= 33 && jsMarks >= 33;
  const grade = getGrade(percentage);

  resultBox.innerHTML = `
    <div class="result-card">
      <h2>Result for ${name}</h2>
      <div class="result-row"><span>HTML Marks</span><span>${htmlMarks}</span></div>
      <div class="result-row"><span>CSS Marks</span><span>${cssMarks}</span></div>
      <div class="result-row"><span>JavaScript Marks</span><span>${jsMarks}</span></div>
      <div class="result-row"><span>Total Marks</span><span>${total} / ${maxTotal}</span></div>
      <div class="result-row"><span>Percentage</span><span>${percentage.toFixed(2)}%</span></div>
      <div class="result-row"><span>Grade</span><span>${grade}</span></div>
      <div class="result-row">
        <span>Status</span>
        <span class="${passed ? "status-pass" : "status-fail"}">${passed ? "Pass" : "Fail"}</span>
      </div>
    </div>
  `;
}

// ===== Event Listener: form submission =====
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    resultBox.innerHTML = "";
    return;
  }

  const name = nameInput.value.trim();
  const htmlMarks = Number(htmlInput.value);
  const cssMarks = Number(cssInput.value);
  const jsMarks = Number(jsInput.value);

  displayResult(name, htmlMarks, cssMarks, jsMarks);
  form.reset();
});
