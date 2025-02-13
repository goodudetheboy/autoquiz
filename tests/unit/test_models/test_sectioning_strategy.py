import json
import unittest
from core.models.sectioning_strategy import StaticSectioningStrategy
from core.models.note import Note
from core.models.section import Section

class TestSectioningStrategyModel(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""

        with open("tests/data/sample_study_note.txt", "r", encoding="utf-8") as f: 
            cls.sample_study_note_plaintext = f.read()
        
        with open("tests/data/sample_static_sectioning_by_num_of_section.json", "r", encoding="utf-8") as f:
            expected_section_list = []
            for section_text in json.load(f):
                expected_section_list.append(Section(section_text))
            cls.expected_static_sectioning_by_num_of_section = expected_section_list

    def setUp(self):
        """Runs before each test."""

        self.note = Note(self.sample_study_note_plaintext)

    def test_static_sectioning_by_num_of_section(self):
        """ Test creating a node from plaintext"""
        processed_note = self.note
        num_of_section = 10

        static_section_strat = StaticSectioningStrategy()

        actual_section_list = static_section_strat.process_by_num_of_section(processed_note, num_of_section)
        expected_section_list = self.expected_static_sectioning_by_num_of_section

        self.assertEqual(len(actual_section_list), len(expected_section_list))

        for i in range(len(expected_section_list)):
            self.assertEqual(actual_section_list[i].content, expected_section_list[i].content)

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass

if __name__ == "__main__":
    unittest.main()
