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

    def setUp(self):
        """Runs before each test."""
        pass  

    def test_single_multiple_choice_question(self):
        """ Test process multiple choice question """
        sample_mcq_list = self.sample_multiple_choice_questions
        single_mcq = sample_mcq_list[0]

        processed_mcq = MultipleChoiceQuestion(single_mcq)

        self.assertEqual(processed_mcq.question, single_mcq["question"])
        self.assertEqual(len(processed_mcq.choices), len(single_mcq["choices"]))
        
        for i in range(len(processed_mcq.choices)):
            choice = processed_mcq.choices[i]
            self.assertEqual(choice.description, single_mcq["choices"][i]["description"])
            self.assertEqual(choice.isCorrect, single_mcq["choices"][i], single_mcq["choices"][i]["isCorrect"])

    # def test_multiple_choice_questions_list(self):
    #     """ Test process multiple choice question """
    #     sample_mcq_list = self.sample_multiple_choice_questions

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass



if __name__ == '__main__':
    unittest.main()
