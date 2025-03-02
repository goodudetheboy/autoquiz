import { saveQuiz, deleteQuiz, getQuiz } from "../common/quiz.js";

const QUIZ_STORAGE_KEY = "lastOpenedQuizId";

export function renderQuiz(quizId) {
    const quizContainer = document.getElementById("quiz-preview"); 
    console.log("ehlo");
    console.log(quizContainer);
    quizContainer.innerHTML = ""; 

    const quizData = getQuiz(quizId) || {
        id: quizId,
        name: "Untitled Quiz",
        time: new Date().toLocaleString(),
        results: {}
    };
    // Store last opened quiz
    localStorage.setItem(QUIZ_STORAGE_KEY, quizId);
    console.log(quizData);
    
    const quizUI = createQuizUI(quizData);
    quizContainer.appendChild(quizUI);
    attachEventListeners(quizData);
    renderQuizQuestions(quizData.results);
}

function renderQuizQuestions(quizResults) {
    const quizContainer = document.getElementById("quiz-container");
    quizResults.forEach((quiz, _) => {
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

function createQuizUI(quizData) {
    const section = document.createElement("section");
    section.classList.add("quiz-preview");
    section.innerHTML = `
        <h3>Quiz Preview</h3>
        <div id="quiz-metadata">
            <input id="quiz-name" type="text" value="${quizData.name}" />
            <span id="quiz-date">Created on: ${quizData.time}</span>
        </div>
        <div class="quiz-toolbar">
            <button id="save-quiz" title="Save to storage"><i class="fas fa-save"></i></button>
            <button id="delete-quiz" title="delete from storage"><i class="fas fa-trash"></i></button>
            <button id="export-quiz" title="Export to JSON"><i class="fas fa-file-export"></i></button>
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
    return section;
}

function attachEventListeners(quizData) {
    const quizNameInput = document.getElementById("quiz-name");
    const saveQuizBtn = document.getElementById("save-quiz");
    const deleteQuizBtn = document.getElementById("delete-quiz");
    const exportQuizBtn = document.getElementById("export-quiz");
    const closeModalBtn = document.querySelector(".close-modal");
    const quizJsonDisplay = document.getElementById("quiz-json");
    const exportModal = document.getElementById("export-modal");

    quizNameInput.addEventListener("blur", () => {
        quizData.name = quizNameInput.value;
    });

    saveQuizBtn.addEventListener("click", () => {
        saveQuiz(quizData);
        alert("Quiz saved!");
    });

    deleteQuizBtn.addEventListener("click", () => {
        deleteQuiz(quizData.id);
        alert("Quiz deleted!");
        localStorage.deleteItem(QUIZ_STORAGE_KEY); // Clear last opened quiz
        document.querySelector(".quiz-preview").remove();
    });

    exportQuizBtn.addEventListener("click", () => {
        quizJsonDisplay.textContent = JSON.stringify(quizData.results, null, 2);
        exportModal.style.display = "block";
    });

    closeModalBtn.addEventListener("click", () => {
        exportModal.style.display = "none";
    });
}
