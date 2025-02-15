class MultipleChoiceQuestion():

    class Choice():
        def __init__(self, description: str, is_correct: bool):
            self.description = description
            self.is_correct = is_correct
            
    def __init__(self,
        question: str = None,
        choices: list[Choice] = None
    ):
        # self.question = question
        # self.choices = choices
        pass

    def process_from_json(self, json_data: dict):
        # Process question
        self.question = json_data["question"]

        # Process choices
        json_choices = json_data["choices"]
        self.choices: list[MultipleChoiceQuestion.Choice] = []

        for json_choice in json_choices:
            description = json_choice["description"]
            is_correct = json_choice["isCorrect"]
            new_choice = MultipleChoiceQuestion.Choice(description, is_correct)
            self.choices.append(new_choice)
