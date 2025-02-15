from __future__ import annotations

class MultipleChoiceQuestion():

    class Choice():
        def __init__(self, description: str, is_correct: bool):
            self.description = description
            self.is_correct = is_correct
            
    def __init__(self,
        question: str = None,
        choices: list[Choice] = None
    ):
        self.question = question
        self.choices = choices
    
    @staticmethod
    def process_from_json(json_data: dict) -> MultipleChoiceQuestion:
        # Process question
        question = json_data["question"]

        # Process choices
        json_choices = json_data["choices"]
        choices: list[MultipleChoiceQuestion.Choice] = []

        for json_choice in json_choices:
            description = json_choice["description"]
            is_correct = json_choice["isCorrect"]
            new_choice = MultipleChoiceQuestion.Choice(description, is_correct)
            choices.append(new_choice)

        return MultipleChoiceQuestion(question, choices)
