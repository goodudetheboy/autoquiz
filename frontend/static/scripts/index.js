document.getElementById("process-btn").addEventListener("click", function () {
    const notes = document.getElementById("notes-input").value.trim();
    if (!notes) {
        alert("Please enter some notes before processing.");
        return;
    }
    console.log("Processing notes:", notes);
    alert("Notes processed! (Placeholder for AI logic)");
});

document.getElementById("generate-quiz").addEventListener("click", function () {
    const numQuestions = document.getElementById("num-questions").value;
    const quizContainer = document.getElementById("quiz-container");

    if (numQuestions < 1) {
        alert("Please enter at least one question.");
        return;
    }

    quizContainer.innerHTML = "<p>Generated Quiz:</p>";
    for (let i = 1; i <= numQuestions; i++) {
        let questionDiv = document.createElement("div");
        questionDiv.textContent = `Question ${i}: (Placeholder for AI-generated question)`;
        quizContainer.appendChild(questionDiv);
    }
});

document.getElementById("toggle-sidebar").addEventListener("click", function () {
    document.querySelector(".sidebar").classList.toggle("collapsed");
});

document.getElementById("section-strategy").addEventListener("change", function () {
    const autoSettings = document.getElementById("automatic-settings");
    const staticSettings = document.getElementById("static-settings");

    if (this.value === "automatic") {
        autoSettings.style.display = "block";
        staticSettings.style.display = "none";
    } else {
        autoSettings.style.display = "none";
        staticSettings.style.display = "block";
    }
});

// Define max limits dynamically (can be fetched from a backend if needed)
const limits = {
    "automatic-num-questions": { min: 1, max: 100 },
    "static-num-sections": {min: 1, max: 10},
    "static-quizzes-per-section": {min: 1, max: 10},
};

// Function to validate any field dynamically
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.getElementById(`${fieldId}-error`);
        if (!field) return true; // Ignore if field doesn't exist

    const { min, max } = limits[fieldId];
    const value = parseInt(field.value, 10);

    if (value < min) {
        errorMessage.textContent = `Min allowed: ${min}`;
        return false;
    } else if (value > max) {
        errorMessage.textContent = `Max allowed: ${max}`;
        return false;
    } else {
        errorMessage.textContent = "";
        return true;
    }
}

const fieldsToValidate = ["automatic-num-questions", "static-num-sections", "static-quizzes-per-section"];

// Function to validate all inputs
function validateQuizInputs() {
    return fieldsToValidate.map(validateField).every(valid => valid); // Ensure all are valid
}

// Attach event listeners for real-time validation
fieldsToValidate.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.addEventListener("input", () => validateField(fieldId));
});

// Validate before generating the quiz
document.getElementById("generate-quiz").addEventListener("click", function (event) {
    if (!validateQuizInputs()) {
        event.preventDefault(); // Prevent submission if invalid
    }
});
