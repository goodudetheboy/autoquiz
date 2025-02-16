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
            is_correct = json_choice["is_correct"]
            new_choice = MultipleChoiceQuestion.Choice(description, is_correct)
            choices.append(new_choice)

        return MultipleChoiceQuestion(question, choices)
    
    @staticmethod
    def process_from_json_lists(json_lists: list[dict]) -> list[MultipleChoiceQuestion]:
        mcq_list: list[MultipleChoiceQuestion] = []
        for json_data in json_lists:
            new_mcq = MultipleChoiceQuestion.process_from_json(json_data)
            mcq_list.append(new_mcq)
        
        return mcq_list

