import json
import unittest
from core.models.sectioning_strategy import StaticSectioningStrategy
from core.services.quizmaster import Quizmaster
from core.models.note import Note
from core.models.quiz_question import MultipleChoiceQuestion

class TestQuizmasterServices(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""

        with open("tests/data/sample_study_note_short.txt", "r", encoding="utf-8") as f: 
            cls.sample_study_note_plaintext = f.read()
        
    def setUp(self):
        """Runs before each test."""

        self.note = Note(self.sample_study_note_plaintext)

    def test_make_quiz_with_static_sectioning_by_num_of_section(self):
        """
            Test creating a set of quizzes from a Note object and static
            sectioning strategy with num of section
        """
        model = "gpt-4o"
        processed_note = self.note
        num_of_section = 1
        quiz_per_section = 5
        static_section_strat = StaticSectioningStrategy(num_of_section)
        
        quizmaster = Quizmaster(model)

        quiz_list:list[MultipleChoiceQuestion] = quizmaster.create_quiz_list(
            note=processed_note,
            section_strategy=static_section_strat,
            quiz_per_section=quiz_per_section
        )

        self.assertEqual(len(quiz_list), num_of_section * quiz_per_section)
        
        for quiz in quiz_list:
            self.assertIsInstance(quiz, MultipleChoiceQuestion)
            quiz_choices = quiz.choices
            self.assertEqual(len(quiz_choices), 4)

            for i in range(len(quiz_choices)):
                choice = quiz_choices[i]

                # Enforce first choice is always correct and false the rest
                choice_answer = choice.is_correct
                if i == 0:
                    self.assertTrue(choice_answer)
                else:
                    self.assertFalse(choice_answer)

            self.assertTrue(quiz_choices)

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass

if __name__ == "__main__":
    unittest.main()
