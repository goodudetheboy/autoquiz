import json
from jinja2 import Environment, FileSystemLoader

from core.models.note import Note
from core.services.openai_client import OpenAIClient
from core.models.sectioning_strategy import SectioningStrategy

env = Environment(loader=FileSystemLoader("./core/services/templates"))

class Quizmaster():

    def __init__(self, model="gpt-4o"):
        self.openai_client = OpenAIClient(model)
        self.request_prompt = env.get_template("quiz_request_prompt.jinja")

    def create_quiz_list(
        self,
        note: Note,
        section_strategy: SectioningStrategy,
        quiz_per_section: int
    ):
        # Section note to proper sections with given strategy
        section_list = section_strategy.process(note)

        final_quiz_list = []
        # Loop through section to generate quiz
        # TODO: Make this faster with parallel requests
        for section in section_list:
            request_prompt = self.request_prompt.render(
                study_note=section.content,
                num_questions=quiz_per_section
            )

            generated_quiz_text = self.openai_client.generate_json(request_prompt)
            print(generated_quiz_text)
            quiz_list = json.loads(generated_quiz_text)["results"]
            final_quiz_list.extend(quiz_list)

        return final_quiz_list




