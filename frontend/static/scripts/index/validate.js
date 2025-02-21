// Define max limits dynamically (can be fetched from a backend if needed)
export const fieldsToValidate = ["automatic-num-questions", "static-num-sections", "static-quizzes-per-section"];

export const limits = {
    "automatic-num-questions": { min: 1, max: 100 },
    "static-num-sections": {min: 1, max: 10},
    "static-quizzes-per-section": {min: 1, max: 10},
};
