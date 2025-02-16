import json
import unittest
from core.models.quiz_question import MultipleChoiceQuestion

class TestOpenAIClient(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""

        with open("tests/data/sample_multiple_choice_questions.json", "r", encoding="utf-8") as f:
            processed_json = json.load(f)
            cls.sample_multiple_choice_questions = processed_json["results"]

        # Provide a default MultipleChoiceQuestion for subsequent tests
    
    def setUp(self):
        """Runs before each test."""
        pass  
    
    def test_single_multiple_choice_question(self):
        """ Test process multiple choice question using constructor"""
        sample_mcq_list = self.sample_multiple_choice_questions
        single_mcq = sample_mcq_list[0]

        question = single_mcq["question"]
        choices = []
        
        for json_choice in single_mcq["choices"]:
            choice = MultipleChoiceQuestion.Choice(
                json_choice["description"], 
                json_choice["is_correct"]
            )
            choices.append(choice)
        
        processed_mcq = MultipleChoiceQuestion(question, choices)

        self.assertEqual(processed_mcq.question, single_mcq["question"])
        self.assertEqual(len(processed_mcq.choices), len(single_mcq["choices"]))
        
        for i in range(len(processed_mcq.choices)):
            choice = processed_mcq.choices[i]
            self.assertEqual(choice.description, single_mcq["choices"][i]["description"])
            self.assertEqual(choice.is_correct, single_mcq["choices"][i]["is_correct"])

    def test_multiple_choice_question_process_from_json(self):
        """ Test process multiple choice question with json"""
        sample_mcq_list = self.sample_multiple_choice_questions
        single_mcq = sample_mcq_list[0]

        processed_mcq = MultipleChoiceQuestion.process_from_json(single_mcq)

        self.assertEqual(processed_mcq.question, single_mcq["question"])
        self.assertEqual(len(processed_mcq.choices), len(single_mcq["choices"]))
        
        for i in range(len(processed_mcq.choices)):
            choice = processed_mcq.choices[i]
            self.assertEqual(choice.description, single_mcq["choices"][i]["description"])
            self.assertEqual(choice.is_correct, single_mcq["choices"][i]["is_correct"])

    def test_multiple_choice_questions_process_from_json_list(self):
        """
            Test process multiple choice question from a list of json questions
        """
        sample_mcq_list = self.sample_multiple_choice_questions

        processed_mcq_list = MultipleChoiceQuestion.process_from_json_lists(sample_mcq_list)

        for i in range(len(processed_mcq_list)):
            processed_mcq = processed_mcq_list[i]
            single_mcq = sample_mcq_list[i]

            self.assertEqual(processed_mcq.question, single_mcq["question"])
            self.assertEqual(len(processed_mcq.choices), len(single_mcq["choices"]))
            
            for i in range(len(processed_mcq.choices)):
                choice = processed_mcq.choices[i]
                self.assertEqual(choice.description, single_mcq["choices"][i]["description"])
                self.assertEqual(choice.is_correct, single_mcq["choices"][i]["is_correct"])

    def test_export_multiple_choice_question_to_json(self):
        """
            Test for a MultipleChoiceQuestion object to export its content to
            JSON
        """
        test_mcq_instance = MultipleChoiceQuestion.process_from_json(
            self.sample_multiple_choice_questions[0]
        )
        test_mcq_instance_json = test_mcq_instance.export_json()

        self.assertEqual(test_mcq_instance_json, self.sample_multiple_choice_questions[0])

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass



if __name__ == '__main__':
    unittest.main()
