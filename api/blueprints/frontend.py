from flask import Blueprint, render_template

frontend_bp = Blueprint("frontend", __name__)


@frontend_bp.route('/')
def index():
    return render_template("pages/main.html", title="autoQuiz: You want it, we quiz it")

@frontend_bp.route('/history')
def history():
    return render_template("pages/history.html")

