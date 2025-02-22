import { fieldsToValidate, limits } from "./validate.js";

function switchStrategySettings() {
    const selected_strat = document.getElementById("section-strategy").value;

    const autoSettings = document.getElementById("automatic-settings");
    const staticSettings = document.getElementById("static-settings");

    if (selected_strat === "automatic") {
        autoSettings.style.display = "block";
        staticSettings.style.display = "none";
    } else if (selected_strat === "static") {
        autoSettings.style.display = "none";
        staticSettings.style.display = "block";
    } else if (selected_strat === "debug") {
        autoSettings.style.display = "none";
        staticSettings.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
  switchStrategySettings();
})

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

document.getElementById("section-strategy").addEventListener("change", switchStrategySettings);

// Validate before generating the quiz
document.getElementById("generate-quiz").addEventListener("click", function (event) {
    if (!validateQuizInputs()) {
        event.preventDefault();
        alert("Something is wrong. Please check all fields in Quiz Settings!");
        return;
    }
    const selected_strat = document.getElementById("section-strategy").value;

    if (selected_strat == "debug") {
        fetch(`/api/quiz/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                debug_mode: true,
            })
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
            console.log("Hello");
          })
          .catch(error => console.error("Fetch error:", error));
    }
});



// Attach event listeners for real-time validation
fieldsToValidate.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.addEventListener("input", () => validateField(fieldId));
});

// Function to validate all inputs
function validateQuizInputs() {
    return fieldsToValidate.map(validateField).every(valid => valid); // Ensure all are valid
}

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


