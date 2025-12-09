export class Choice {
  description: string;
  isCorrect: boolean;

  constructor(description: string, isCorrect: boolean) {
    this.description = description;
    this.isCorrect = isCorrect;
  }

  exportJson(): { description: string; is_correct: boolean } {
    return {
      description: this.description,
      is_correct: this.isCorrect,
    };
  }

  static fromJson(json: { description: string; is_correct: boolean }): Choice {
    return new Choice(json.description, json.is_correct);
  }
}

export class MultipleChoiceQuestion {
  question: string;
  choices: Choice[];

  constructor(question: string, choices: Choice[]) {
    this.question = question;
    this.choices = choices;
  }

  exportJson(): {
    question: string;
    choices: { description: string; is_correct: boolean }[];
  } {
    return {
      question: this.question,
      choices: this.choices.map((choice) => choice.exportJson()),
    };
  }

  static fromJson(jsonData: {
    question: string;
    choices: { description: string; is_correct: boolean }[];
  }): MultipleChoiceQuestion {
    const question = jsonData.question;
    const choices = jsonData.choices.map((choiceData) =>
      Choice.fromJson(choiceData)
    );
    return new MultipleChoiceQuestion(question, choices);
  }

  static fromJsonList(
    jsonList: {
      question: string;
      choices: { description: string; is_correct: boolean }[];
    }[]
  ): MultipleChoiceQuestion[] {
    return jsonList.map((jsonData) =>
      MultipleChoiceQuestion.fromJson(jsonData)
    );
  }
}
