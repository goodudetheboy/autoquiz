import json
import unittest
from unittest.mock import MagicMock, patch

from core.services.openai_client import OpenAIClient

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

    def test_post_quiz_create_static_sectioning(self):
        """Test '/api/quiz/create' endpoint with static sectioning"""
        with patch.object(OpenAIClient, "generate_json", return_value=self.sample_quiz_openai_response) as mock_openai_call:
            response = self.client.post(
                "/api/quiz/create",
                json={
                    "note_content": self.sample_study_note,
                    "sectioning_strategy": "static_sectioning",
                    "num_section": 1,
                    "num_quiz_per_section": 5,
                }
            )
            mock_openai_call.assert_called_once()
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                response.json, 
                json.loads(self.sample_quiz_openai_response)
            )
    
    # TODO: Implement error handling for POST /api/quiz/create

    def test_post_quiz_create_sample_for_debug(self):
        response = self.client.post(
            "api/quiz/create",
            json={
                "debug_mode": True,
            }
        )
        with open("./api/data/debug_mode_multiple_choice_questions.json", "r", encoding="utf-8") as f:
            expected_questions = json.loads(f.read())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json,
            expected_questions
        )
if __name__ == "__main__":
    unittest.main()
