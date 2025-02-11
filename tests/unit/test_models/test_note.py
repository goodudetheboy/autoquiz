import unittest
from core.models import Note

class TestNoteModel(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Runs once before all tests."""
        print("\nSetting up TestNoteModel...")

        with open("tests/data/sample_study_note.txt") as f: 
            cls.sample_study_note_plaintext = f.read()

    def setUp(self):
        """Runs before each test."""
        pass  

    def test_process_plaintext_to_node(self):
        """ Test creating a node from plaintext"""
        new_note = Note(self.sample_study_note_plaintext)

        assert(new_note.content == self.sample_study_note_plaintext)

    def tearDown(self):
        """Runs after each test."""
        pass  # Cleanup if needed

    @classmethod
    def tearDownClass(cls):
        """Runs once after all tests."""
        print("\nCleaning up TestNoteModel...")

if __name__ == "__main__":
    unittest.main()
