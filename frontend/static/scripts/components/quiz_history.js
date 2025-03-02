// quiz_history.js (Handles UI interactions with localStorage quizzes)
import { getQuizHistory, getQuiz, deleteQuiz } from "../common/quiz.js";
import { renderQuiz } from "./quiz_view.js";


// Reference to the quiz list container
const quizListContainer = document.getElementById("quiz-list");

// Function to render quiz history
export function renderQuizHistory() {
    quizListContainer.innerHTML = ""; // Clear existing content
    const quizHistory = getQuizHistory();

    if (quizHistory.length === 0) {
        quizListContainer.innerHTML = "<p>No quizzes found.</p>";
        return;
    }

    quizHistory.forEach(quiz => {
        const quizItem = document.createElement("div");
        quizItem.classList.add("quiz-item");
        quizItem.dataset.quizId = quiz.quizId;

        quizItem.innerHTML = `
            <div class="quiz-info">
                <i class="fas fa-file-alt"></i>
                <div>
                    <strong>${quiz.name}</strong>
                    <div class="quiz-time">${new Date(quiz.time).toLocaleString()}</div>
                </div>
            </div>
            <button class="delete-quiz" data-quiz-id="${quiz.quizId}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        // Load quiz on click
        quizItem.addEventListener("click", (event) => {
            if (!event.target.closest(".delete-quiz")) {
                renderQuiz(quiz.quizId);
            }
        });

        // Delete quiz on button click
        quizItem.querySelector(".delete-quiz").addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the main click
            const quizId = event.target.closest(".delete-quiz").dataset.quizId;
            deleteQuiz(quizId);
            renderQuizHistory();
        });

        quizListContainer.appendChild(quizItem);
    });
}

