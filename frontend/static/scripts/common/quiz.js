import { v4 as uuidv4 } from "uuid";

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
 * @param {Object} quizData - The quiz object containing questions and answers.
 * @returns {string} quizId - The unique ID of the saved quiz.
 */
export function saveQuiz(name, quizData) {
    const quizId = uuidv4();
    const timestamp = new Date().toISOString();

    const quiz = { name, time: timestamp, results: quizData };
    localStorage.setItem(quizId, JSON.stringify(quiz));

    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    history.push({ name, time: timestamp, quizId });
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
