import unittest
from core.models.note import Section

class TestSectionModel(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""

        with open("tests/data/sample_study_note.txt", "r", encoding="utf-8") as f: 
            cls.sample_study_note_plaintext = f.read()

    def setUp(self):
        """Runs before each test."""
        pass  

    def test_process_plaintext_to_section(self):
        """ Test creating a section from plaintext"""
        new_note = Section(self.sample_study_note_plaintext)

        assert(new_note.content == self.sample_study_note_plaintext)

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        pass

if __name__ == "__main__":
    unittest.main()
