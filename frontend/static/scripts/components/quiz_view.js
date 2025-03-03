import { deleteQuiz, getQuiz, updateQuiz } from "../common/quiz.js";

const QUIZ_STORAGE_KEY = "lastOpenedQuizId";

export function renderQuiz(quizId) {
    // Check if exist
    const quizData = getQuiz(quizId);
    if (!quizData) {
        return;
    }

    // Clear last quiz
    const quizContainer = document.getElementById("quiz-preview"); 
    quizContainer.innerHTML = ""; 

    // Store last opened quiz
    localStorage.setItem(QUIZ_STORAGE_KEY, quizId);
    console.log(quizData);
    console.log(quizData.time);
    // Do some rendering
    renderQuizToolbar(quizData);
    attachEventListeners(quizData);
    renderQuizQuestions(quizData.results);
}

function renderQuizQuestions(quizList) {
    // Delete old quiz
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "";
    
    // Randomize quiz question order
    const randomQuizList = quizList.sort(() => Math.random() - 0.5);
    randomQuizList.forEach((quiz, _) => {
        const quizElement = document.createElement("div");
        quizElement.classList.add("quiz-question");
        
        const questionText = document.createElement("p");
        questionText.textContent = quiz.question;
        quizElement.appendChild(questionText);

        const choicesList = document.createElement("ul");
        choicesList.classList.add("choices");

        const sortedQuizChoices = quiz.choices.sort(() => Math.random() - 0.5);
        sortedQuizChoices.forEach(choice => {
            const choiceItem = document.createElement("li");
            choiceItem.textContent = choice.description;
            choiceItem.addEventListener("click", () => checkAnswer(choice, choiceItem));
            choicesList.appendChild(choiceItem);
        });

        quizElement.appendChild(choicesList);
        quizContainer.appendChild(quizElement);
    });
}

function checkAnswer(choice, item) {
  if (choice.is_correct) {
    item.classList.add("correct");
    item.innerHTML = "<i class='fas fa-check icon icon-check'></i>" + item.textContent;
  } else {
    item.classList.add("incorrect");
    item.innerHTML = "<i class='fas fa-times icon icon-times'></i>" + item.textContent;
  }

  // Disable further interaction
  item.style.pointerEvents = "none";
}

function renderQuizToolbar(quizData) {
    // Convert to milliseconds
    const date = new Date(quizData.time * 1000);

    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true // Set to false for 24-hour format
    };

    const localTime = date.toLocaleString('en-US', options);
    const quizContainer = document.getElementById("quiz-preview"); 
    quizContainer.innerHTML = `
        <div id="quiz-interface">
            <div id="quiz-metadata">
                <div id="quiz-name-container" title="Edit quiz title name">
                    <i class="fas fa-pen edit-icon"></i>
                    <input id="quiz-name" type="text" value="${quizData.name}" />
                </div>
                
                <span id="quiz-date">Created on: ${localTime}</span>
            </div>
            <div class="quiz-toolbar">
                <button id="save-quiz" title="Save to storage"><i class="fas fa-save"></i></button>
                <button id="delete-quiz" title="delete from storage"><i class="fas fa-trash"></i></button>
                <button id="export-quiz" title="Export to JSON"><i class="fas fa-file-export"></i></button>
                <button id="shuffle-quiz" title="Shuffle Questions"><i class="fas fa-shuffle"></i></button>
            </div>
        </div>

        <div id="export-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Quiz JSON</h3>
                <textarea id="quiz-json" disabled></textarea>
            </div>
        </div>
        <div id="quiz-container"></div>

    `;
}

function attachEventListeners(quizData) {
    const quizNameInput = document.getElementById("quiz-name");
    const saveQuizBtn = document.getElementById("save-quiz");
    const deleteQuizBtn = document.getElementById("delete-quiz");
    const exportQuizBtn = document.getElementById("export-quiz");
    const shuffleQuizBtn = document.getElementById("shuffle-quiz");
    const closeModalBtn = document.querySelector(".close-modal");
    const quizJsonDisplay = document.getElementById("quiz-json");
    const exportModal = document.getElementById("export-modal");

    document.querySelector(".edit-icon").addEventListener("click", () => {
        document.querySelector("#quiz-name").focus();
    });

    quizNameInput.addEventListener("blur", () => {
        quizData.name = quizNameInput.value;
    });

    saveQuizBtn.addEventListener("click", () => {
        updateQuiz(quizData.quizId, quizData.name, quizData.results);
        alert("Quiz saved!");
    });

    deleteQuizBtn.addEventListener("click", () => {
        deleteQuiz(quizData.quizId);
        alert("Quiz deleted!");
        localStorage.removeItem(QUIZ_STORAGE_KEY); // Clear last opened quiz
        const quizContainer = document.getElementById("quiz-preview"); 
        quizContainer.innerHTML = "<h3>Quiz Preview<h3>"; 
    });

    exportQuizBtn.addEventListener("click", () => {
        quizJsonDisplay.textContent = JSON.stringify(quizData.results, null, 2);
        exportModal.style.display = "block";
    });

    shuffleQuizBtn.addEventListener("click", () => {
        renderQuizQuestions(quizData.results);
    })

    closeModalBtn.addEventListener("click", () => {
        exportModal.style.display = "none";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const lastQuizId = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (lastQuizId) {
        renderQuiz(lastQuizId);
    }
});
