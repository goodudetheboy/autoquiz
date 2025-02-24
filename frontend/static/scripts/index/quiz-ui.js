export function renderQuiz(quizContainer, quizData) {
    quizContainer.innerHTML = "";
    //   const quizContainer = document.getElementById("quiz-container");
    const sortedQuestions = quizData.results.sort(() => Math.random() - 0.5);
    quizData.results.forEach((quiz, _) => {
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
