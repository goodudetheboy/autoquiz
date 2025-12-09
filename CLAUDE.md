# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoQuiz is a full-stack web application that automatically generates multiple-choice quiz questions from study notes using OpenAI's GPT-4. The application takes plain text notes from students and generates contextual quizzes by sectioning the content and using AI to create relevant questions.

## Architecture

### Three-Layer Architecture

1. **API Layer** (`api/`): Flask-based REST API
   - `blueprints/quiz.py`: Handles quiz creation endpoint
   - `blueprints/frontend.py`: Serves frontend routes

2. **Core/Business Logic** (`core/`): Domain models and services
   - `models/`: Data structures (Note, Section, QuizQuestion, SectioningStrategy)
   - `services/quizmaster.py`: Orchestrates the quiz generation pipeline
   - `services/openai_client.py`: Handles LLM API interactions
   - `services/templates/`: Jinja2 templates for LLM prompts

3. **Frontend** (`frontend/`): Server-rendered HTML with vanilla JavaScript
   - `templates/`: Jinja2 HTML templates (pages and components)
   - `static/scripts/`: Client-side JavaScript (ES6 modules)
   - `static/styles/`: CSS files

### Quiz Generation Pipeline

The core workflow in [quizmaster.py](core/services/quizmaster.py):

1. User submits notes + settings → POST `/api/quiz/create`
2. Note is divided into N sections using a `SectioningStrategy`
3. For each section:
   - Generate prompt using Jinja2 template at [core/services/templates/quiz_request_prompt.jinja](core/services/templates/quiz_request_prompt.jinja)
   - Call OpenAI GPT-4o API with structured output format
   - Parse JSON response into `MultipleChoiceQuestion` objects
4. Return combined quiz list as JSON

**Critical:** The pipeline is currently **sequential** (not parallel). There's a TODO at [quizmaster.py:28](core/services/quizmaster.py#L28) to parallelize requests for performance.

### Key Design Patterns

- **Strategy Pattern**: `SectioningStrategy` is an abstract base class for different note-sectioning algorithms (currently only `StaticSectioningStrategy` implemented)
- **Service Layer Pattern**: `Quizmaster` orchestrates business logic, keeping API layer thin
- **Template Method**: LLM prompts use Jinja2 templates for maintainability

## Development Commands

### Running the Application

```bash
# Start Flask development server
python app.py
# OR
python run_api.py
```

Default server runs at `http://localhost:5000`

### Testing

Tests use Python's `unittest` module. Test runner script: `scripts/run_tests.sh`

```bash
# Run all tests
bash scripts/run_tests.sh

# Run all model tests
bash scripts/run_tests.sh model

# Run all service tests
bash scripts/run_tests.sh service

# Run specific model test (e.g., test_note.py)
bash scripts/run_tests.sh model test_note

# Run specific service test (e.g., test_quizmaster.py)
bash scripts/run_tests.sh service test_quizmaster
```

Test data fixtures are located in `tests/unit/data/`

### Deployment

```bash
# Production deployment
bash scripts/deploy.sh

# Local deployment for testing
bash scripts/deploy_local.sh
```

## API Endpoints

### POST `/api/quiz/create`

Creates quiz questions from study notes.

**Request Body:**
```json
{
  "debug_mode": false,  // If true, returns 5 mock questions (overrides all settings)
  "note_content": "...",  // Plain text study notes
  "sectioning_strategy": "static_sectioning",  // Currently only supports "static_sectioning"
  "num_section": 5,  // Number of sections to divide note into
  "num_quiz_per_section": 4  // Questions generated per section
}
```

**Response (200 OK):**
```json
{
  "results": [
    {
      "question": "What is the primary function of ICMP?",
      "choices": [
        {
          "description": "To communicate network transmission issues",
          "is_correct": true
        },
        // ... 3 more choices (exactly 4 total, 1 correct)
      ]
    }
    // ... more questions
  ]
}
```

## Important Implementation Notes

### Current Limitations & TODOs

From [README.md](README.md) feedback section:

1. **Gateway Timeout (504)**: Deployment to production environments may timeout due to sequential LLM API calls. Consider:
   - Parallelizing requests (see TODO in quizmaster.py:28)
   - Implementing async/background job infrastructure

2. **Quiz Quality Issues**:
   - Questions sometimes reference overly specific examples from notes that lose meaning when standalone
   - Consider adding user settings to control abstraction level (conceptual vs. example-based)

3. **Context Management**: Current sectioning loses context between sections. Possible optimization: generate section summaries that compound forward to maintain context across the note

4. **Missing Features**:
   - Section origin tracking for debugging
   - Quiz difficulty settings
   - Answer explanations and reasoning
   - Session management (grading, mistake tracking)
   - On-the-fly answer corrections

### Environment Configuration

The application requires:
- OpenAI API key (configured via `python-dotenv` and `.env` file)
- Model: GPT-4o (configured in `Quizmaster.__init__()`, defaults to "gpt-4o")

### Technology Stack

**Backend:**
- Flask (Python web framework)
- OpenAI Python SDK (1.62.0) - GPT-4 integration
- Pydantic (2.10.6) - Data validation
- Jinja2 (3.1.5) - Template engine for prompts and HTML
- python-dotenv (1.0.1) - Environment variable management

**Frontend:**
- Vanilla JavaScript (ES6 modules)
- Server-side rendering with Jinja2
- No frontend build system (direct serving of static assets)

**Testing:**
- Python unittest (backend)
- Jest 29.7.0 with Node.js (frontend - if applicable)

## Commit Conventions

Use these tags from [README.md](README.md):

- `[feat]` - New features
- `[fix]` - Bug fixes
- `[docs]` - Documentation changes
- `[test]` - Test additions/updates
- `[refactor]` - Code refactoring
- `[style]` - Formatting changes
- `[chore]` - Maintenance tasks
- `[perf]` - Performance improvements
- `[ci]` - CI/CD changes
- `[build]` - Build system changes
- `[release]` - Version releases
- `[WIP]` - Work in progress

Example: `[feat] add difficulty setting for quiz generation`

## File Structure Navigation

```
autoquiz/
├── api/                    # Flask API layer
│   ├── __init__.py         # Flask app factory (create_app())
│   └── blueprints/         # Route handlers
├── core/                   # Business logic
│   ├── models/             # Domain objects (Note, Section, QuizQuestion)
│   ├── services/           # Business logic (Quizmaster, OpenAIClient)
│   │   └── templates/      # Jinja2 LLM prompt templates
│   └── utils/              # Helper utilities
├── frontend/
│   ├── templates/          # Jinja2 HTML (index.html, pages/, components/)
│   └── static/             # Client-side assets (scripts/, styles/)
├── tests/unit/             # Unit tests (test_models/, test_services/)
│   └── data/               # Test fixtures
├── scripts/                # Utility scripts (run_tests.sh, deploy.sh)
├── app.py                  # Main entry point
└── requirements.txt        # Python dependencies
```

## Working with This Codebase

### Adding New Models

Models in `core/models/` should:
- Use Pydantic for validation where appropriate
- Include a `process_from_json_lists()` classmethod if parsing from API responses
- Follow the existing pattern (see `MultipleChoiceQuestion` for reference)

### Adding New Sectioning Strategies

1. Create new class in `core/models/sectioning_strategy.py` that inherits from `SectioningStrategy`
2. Implement the `process(note: Note) -> list[Section]` method
3. Register the strategy name in the API endpoint validation

### Modifying LLM Prompts

Prompts are Jinja2 templates in `core/services/templates/`. When modifying:
- Maintain the structured output format expected by OpenAI API
- Test changes thoroughly as prompt modifications significantly affect quiz quality
- Consider the feedback about overly specific vs. conceptual questions

### Frontend Development

The frontend uses:
- Server-side rendering (Jinja2 templates)
- No bundler or build process
- ES6 module imports directly in browser
- Component-based organization in `frontend/static/scripts/components/`

Main entry point: [frontend/static/scripts/index.js](frontend/static/scripts/index.js)
