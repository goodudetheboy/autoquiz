from flask import request, Blueprint, jsonify
from core.models.note import Note
from core.models.sectioning_strategy import StaticSectioningStrategy
from core.services.quizmaster import Quizmaster

quiz_bp = Blueprint("main", __name__)

@quiz_bp.route("/api/quiz/create", methods=["POST"])
def post_create_quiz():
    json_data = request.get_json()

    note_content = json_data["note_content"]
    sectioning_strategy = json_data["sectioning_strategy"]
    num_section = json_data["num_section"]
    num_quiz_per_section = json_data["num_quiz_per_section"]

    quizmaster = Quizmaster("gpt-4o")
    
    note = Note(content=note_content)
    if sectioning_strategy == "static_sectioning":
        sectioning_strategy = StaticSectioningStrategy(num_of_section=num_section)

    quiz_list = quizmaster.create_quiz_list(
        note=note,
        section_strategy=sectioning_strategy,
        quiz_per_section=num_quiz_per_section
    )
    json_quiz_list = []  
    for quiz in quiz_list:
        json_quiz_list.append(quiz.export_json())

    print(json_quiz_list)

    return jsonify({"results": json_quiz_list}), 200
