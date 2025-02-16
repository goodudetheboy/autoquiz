import unittest
from unittest.mock import MagicMock, patch

class QuizAPITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up a Flask test client once for all tests."""
        from api import create_app
        app = create_app()
        app.config["TESTING"] = True
        cls.client = app.test_client()
        
        with open("tests/data/sample_study_note.txt", "r", encoding="utf-8") as f:
            cls.sample_study_note = f.read()

        with open("tests/data/sample_multiple_choice_questions.json", "r", encoding="utf-8") as f:
            cls.sample_quiz_openai_response = f.read()

    @patch("core.services.openai_client.OpenAIClient")
    def test_post_quiz_create_static_sectioning(self, MockOpenAIClient: MagicMock):
        """Test '/api/quiz/create' endpoint with static sectioning"""
        mock_openai_instance = MockOpenAIClient.return_value
        mock_openai_instance.generate_json.return_value = self.sample_quiz_openai_response

        response = self.client.get(
            "/api/quiz/create",
            json={
                "note_content": self.sample_study_note,
                "sectioning_strategy": "static_sectioning",
                "num_section": 10,
                "num_quiz_per_section": 5,
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, self.sample_quiz_openai_response)

if __name__ == "__main__":
    unittest.main()
