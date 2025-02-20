from flask import Flask
from api.blueprints.quiz import quiz_bp

def register_routes(app: Flask):
    """Register all blueprints to the Flask app."""
    app.register_blueprint(quiz_bp)
