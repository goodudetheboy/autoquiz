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

