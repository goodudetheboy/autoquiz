# tests/test_openai_client.py
import unittest
from unittest.mock import patch
from core.models.openai_client import OpenAIClient

class TestOpenAIClient(unittest.TestCase):
    def setUp(self):
        self.api_key = "test_api_key"
        self.client = OpenAIClient(self.api_key)

    def test_generate_text(self, mock_create):
        """ Sanity test for OpenAI API """

        prompt = "Say nothing but 'Hello, World!'"
        result = self.client.generate_text(prompt)
        self.assertEqual(result, 'Hello, World!')

if __name__ == '__main__':
    unittest.main()
