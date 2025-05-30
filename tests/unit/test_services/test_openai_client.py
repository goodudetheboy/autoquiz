import json
import unittest
from core.services.openai_client import OpenAIClient

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
        result = json.loads(result)

        # Test json
        self.assertIn("message", result)
        self.assertEqual(result["message"], "Hello, World!")

if __name__ == '__main__':
    unittest.main()
