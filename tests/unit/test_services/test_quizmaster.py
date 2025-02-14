import json
import unittest
from core.models.sectioning_strategy import StaticSectioningStrategy
from core.services.quizmaster import Quizmaster
from core.models.note import Note

class TestQuizmasterServices(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""

        with open("tests/data/sample_study_note.txt", "r", encoding="utf-8") as f: 
            cls.sample_study_note_plaintext = f.read()
        
    def setUp(self):
        """Runs before each test."""

        self.note = Note(self.sample_study_note_plaintext)

    def test_make_quiz_with_static_sectioning_by_num_of_section(self):
        """
            Test creating a set of quizzes from a Note object and static
            sectioning strategy with num of section
        """
        processed_note = self.note
        num_of_section = 10
        quiz_per_section = 5
        static_section_strat = StaticSectioningStrategy(num_of_section)
        
        quizmaster = Quizmaster()

        quiz_list = quizmaster.create_quiz(
            note=processed_note,
            section_strategy=static_section_strat,
            quiz_per_section=quiz_per_section
        )

        self.assertEqual(len(quiz_list), num_of_section * quiz_per_section)

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass

if __name__ == "__main__":
    unittest.main()
