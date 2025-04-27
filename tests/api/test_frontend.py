import json
import unittest
from unittest.mock import MagicMock, patch

from core.services.openai_client import OpenAIClient

class FrontendAPITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up a Flask test client once for all tests."""
        from api import create_app
        app = create_app()
        app.config["TESTING"] = True
        cls.client = app.test_client()

    def test_render_homepage(self):
        """Test '/' render homepage """
        response = self.client.get("/")   
        self.assertEqual(response.status_code, 200)
        self.assertIn("auto", response.text)
    
if __name__ == "__main__":
    unittest.main()