from flask import Flask
from api.blueprints import register_routes  # Import route registration function

def create_app():
    app = Flask(__name__, template_folder="../frontend/templates",
                static_folder="../frontend/static")
    # app.config.from_object("config.Config")  # Load configuration

    register_routes(app)  # Register routes from blueprints

    return app
