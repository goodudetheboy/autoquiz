import os
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv

# print(find_dotenv())

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

class OpenAIClient:
    """
        Class to provide interface with various interaction with LLM
    """
    def __init__(self, model="gpt-4o"):
        self.model = model

    def generate_text(self, prompt: str) -> str:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
                ],
            model=self.model,
        )
        return chat_completion.choices[0].message.content

    def generate_json(self, prompt: str) -> str:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
                ],
            model=self.model,
            response_format= {
                "type": "json_object"
            }
        )
        return chat_completion.choices[0].message.content

