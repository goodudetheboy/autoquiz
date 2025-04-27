import { v4 as uuidv4 } from "https://cdn.skypack.dev/uuid";

export async function createQuiz(request_body) {
    const response = await fetch(`/api/quiz/create`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(request_body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const response_json = await response.json();

    return response_json;
}

/**
 * Saves a quiz to localStorage and updates quiz history.
 * @param {string} name - Name of the quiz.
 * @param {Object} quizList - The quiz object containing questions and answers.
 * @returns {string} quizId - The unique ID of the saved quiz.
 */
export function saveQuiz(name, quizList) {
    const quizId = uuidv4();
    return updateQuiz(quizId, name, quizList);
}

/**
 * Updates an existing quiz in localStorage. If quizId doesn't exist, saves as a new quiz.
 * @param {string} quizId - The ID of the quiz to update.
 * @param {string} name - New name for the quiz.
 * @param {Object} quizList - Updated quiz object containing questions and answers.
 * @returns {string} quizId - The same ID if updated, or a new one if created.
 */
export function updateQuiz(quizId, name, quizList) {
    const timestamp = Math.floor(Date.now() / 1000);
    let history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    let existingQuiz = JSON.parse(localStorage.getItem(quizId));

    if (existingQuiz) {
        // Update existing quiz
        existingQuiz.quizId = quizId;
        existingQuiz.name = name;
        existingQuiz.time = timestamp;
        existingQuiz.results = quizList;
        localStorage.setItem(quizId, JSON.stringify(existingQuiz));
        
        // Update history entry
        history = history.map((entry) => (entry.quizId === quizId ? { ...entry, name, time: timestamp } : entry));
    } else {
        // Save as new quiz
        existingQuiz = { name, time: timestamp, results: quizList, quizId };
        localStorage.setItem(quizId, JSON.stringify(existingQuiz));
        history.push({ name, time: timestamp, quizId });
    }
    
    localStorage.setItem("quizHistory", JSON.stringify(history));
    return quizId;
}

/**
 * Retrieves a quiz by its ID.
 * @param {string} quizId - The unique ID of the quiz.
 * @returns {Object|null} The quiz object if found, otherwise null.
 */
export function getQuiz(quizId) {
    const quiz = localStorage.getItem(quizId);
    return quiz ? JSON.parse(quiz) : null;
}

/**
 * Retrieves the quiz history.
 * @returns {Array} An array of quiz history objects.
 */
export function getQuizHistory() {
    return JSON.parse(localStorage.getItem("quizHistory")) || [];
}

/**
 * Deletes a quiz and removes it from history.
 * @param {string} quizId - The unique ID of the quiz to delete.
 * @returns {boolean} True if the quiz was deleted, false if not found.
 */
export function deleteQuiz(quizId) {
    if (!localStorage.getItem(quizId)) return false;

    localStorage.removeItem(quizId);

    let history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    history = history.filter(quiz => quiz.quizId !== quizId);
    localStorage.setItem("quizHistory", JSON.stringify(history));

    return true;
}

/**
 * Clears all stored quizzes and history.
 */
export function clearQuizzes() {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    history.forEach(quiz => localStorage.removeItem(quiz.quizId));
    localStorage.removeItem("quizHistory");
}
