import { createQuiz, saveQuiz } from "../../common/quiz.js";
import { renderQuiz } from "../../components/quiz_view.js";
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

  setUpNotesWordAndLineCount();

})


document.getElementById("section-strategy").addEventListener("change", switchStrategySettings);

// Validate before generating the quiz
document.getElementById("generate-quiz").addEventListener("click", async function (event) {
    const selected_strat = document.getElementById("section-strategy").value;
    // Check notes
    const notes = document.getElementById("notes-input").value.trim();
    if (selected_strat !== "debug") {
        if (!validateQuizInputs()) {
            event.preventDefault();
            alert("Something is wrong. Please check all fields in Quiz Settings!");
            return;
        }

        if (!notes) {
            alert("Please enter some notes before processing.");
            return;
        }
    }

    // Start progress bar
    const runningTextList = [
        "Preparing your note for processing...",
        "Analyzing the sections based on your chosen strategy...",
        "Segmenting the content into manageable sections...",
        "Identifying key concepts for quiz generation...",
        "Creating questions from the sections...",
        "Finalizing your quiz...",
    ];

    const progressInterval = startProgressBar(120, runningTextList);

    // Start generating quiz UI
    toggleGeneratingQuiz(true);

    // Start generation
    let quizData = null;
    try {
        if (selected_strat == "debug") {
            quizData = await createQuiz({
                "debug_mode": true,
            });
        }
        
        if (selected_strat == "static") {
            const num_section = document.getElementById("static-num-sections").value;
            const num_quiz_per_section = document.getElementById("static-quizzes-per-section").value;
            quizData = await createQuiz({
                "note_content": notes, 
                "sectioning_strategy": "static_sectioning",
                "num_section": Number(num_section),
                "num_quiz_per_section": Number(num_quiz_per_section),
            })
        }

        if (quizData == null) {
            throw new Error("Can't resolve quizzes even though the requests went through :(");
        }
    } catch (error) {
        console.error(error);
        alert("Something happens when requesting quizzes! Please try again later.");
    }
    
    if (!quizData.results) {
        alert("Unexpected error happens. No quiz list found in response :(")
    } else {
        const savedQuizId = saveQuiz("Untitled Quiz", quizData.results);
        renderQuiz(savedQuizId);
    }

    endProgressBar(progressInterval);
    toggleGeneratingQuiz(false);
});

/** Progress bar functions */
function startProgressBar(duration, textList) {
    let progress = 0;
    const step = 100 / duration; // Update progress by a certain step each second
    let textIndex = 0;

    // Turning on progress bar
    const progressContainer = document.getElementById("progress-container");
    progressContainer.style.display = "inline";

    // Set the initial text
    updateRunningText(textList[textIndex]);

    // Update progress bar every second
    const progressInterval = setInterval(function() {
        if (progress >= 90) {
            clearInterval(progressInterval);
        } else {
            progress += step;
            
            // Update progressBar UI
            const progressBar = document.getElementById("progress-bar");
            progressBar.style.width = `${Math.min(progress, 90)}%`;
            
             
            // Update running text
            const newTextIndex = Math.floor(progress / (100 / textList.length));
            if (newTextIndex !== textIndex) {
                textIndex = newTextIndex;
                updateRunningText(textList[textIndex]);
            }
        }
    }, 1000);

    return progressInterval;
}

function updateRunningText(newText) {
    const runningText = document.getElementById("running-text");
    runningText.textContent = newText;
}

function endProgressBar(progressInterval) {
    // Make sure it reaches 100% after the fetch
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = '100%';
    clearInterval(progressInterval);
    const runningText = document.getElementById("running-text");
    runningText.textContent = "Completed!";
}

function toggleGeneratingQuiz(isGenerating) {
    const generateQuizButton = document.getElementById("generate-quiz");
    if (isGenerating) {
        // Disable button
        generateQuizButton.disabled = true;
        generateQuizButton.innerText = "Generating Quiz...";
    } else {
        // Enable button
        generateQuizButton.disabled = false;
        generateQuizButton.innerText = "Generate Quiz";
    }
}

// Attach event listeners for real-time validation
Object.values(fieldsToValidate).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) field.addEventListener("input", () => validateField(fieldId));
});

// Function to validate all inputs
function validateQuizInputs() {
    const selected_strat = document.getElementById("section-strategy").value;
    const fields = fieldsToValidate[selected_strat];
    return fields.map(validateField).every(valid => valid); // Ensure all are valid
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

function setUpNotesWordAndLineCount() {
    const textarea = document.getElementById("notes-input");
    const charCount = document.getElementById("notes-stat-char-count");
    const wordCount = document.getElementById("notes-stat-word-count");
    const lineCount = document.getElementById("notes-stat-line-count");

    textarea.addEventListener("input", () => {
        const text = textarea.value.trim();

        const chars = text.length;
        const words = text.match(/\b\w+\b/g) || [];  // Match words
        const lines = text.split(/\r\n|\r|\n/); // Split by newlines

        charCount.textContent = chars;
        wordCount.textContent = words.length;
        lineCount.textContent = lines.length;
    });
}
