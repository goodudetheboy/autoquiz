# tests/test_openai_client.py
import unittest
from unittest.mock import patch
from core.models.openai_client import OpenAIClient

class TestOpenAIClient(unittest.TestCase):
    def setUp(self):
        self.client = OpenAIClient(model="gpt-4o")

    def test_generate_text(self):
        """ Sanity test for OpenAI API """

        prompt = "Say nothing but 'Hello, World!'"
        result = self.client.generate_text(prompt)
        self.assertEqual(result, 'Hello, World!')

    def test_generate_json(self):
        """ Sanity test for OpenAI API json mode"""
        prompt = "Return a simple json {'message': 'Hello, World!'}"
        result = self.client.generate_json(prompt)
        self.assertIn("message", result)
        self.assertEqual(result["message"], "Hello, World!")

if __name__ == '__main__':
    unittest.main()
