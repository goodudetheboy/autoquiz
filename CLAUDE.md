# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AutoQuiz is a full-stack web application that automatically generates multiple-choice quiz questions from study notes using OpenAI's GPT-4. The application takes plain text notes from students and generates contextual quizzes by sectioning the content and using AI to create relevant questions.

Built with Next.js, TypeScript, React, and shadcn/ui for a modern, type-safe development experience.

## Architecture

**Modern full-stack architecture using Next.js App Router:**

1. **Frontend** (`src/app/`): React components with Next.js App Router
   - `page.tsx`: Main quiz creation page
   - `history/page.tsx`: Quiz history management
   - `layout.tsx`: Root layout with Toaster

2. **API Layer** (`src/app/api/`): Next.js API routes
   - `quiz/create/route.ts`: POST endpoint for quiz generation

3. **Components** (`src/components/`):
   - `quiz-creation-form.tsx`: Note input and settings form
   - `quiz-display.tsx`: Quiz preview and practice modes
   - `ui/`: shadcn/ui component library

4. **Business Logic** (`src/lib/`):
   - `models/`: TypeScript classes (Note, Section, QuizQuestion, SectioningStrategy)
   - `services/`: OpenAI client and Quizmaster orchestration
   - `services/prompts.ts`: LLM prompt templates

**Key Features:**
- Practice mode with randomized answers and instant feedback
- Preview mode showing all correct answers
- Quiz history with localStorage persistence
- Real-time statistics (character, word, line count)
- Progress tracking during generation
- Export to JSON
- Shuffle questions
- Edit quiz names

## Quiz Generation Pipeline

The core workflow in [quizmaster.ts](src/lib/services/quizmaster.ts):

1. User submits notes + settings → POST `/api/quiz/create`
2. Note is divided into N sections using a `SectioningStrategy`
3. For each section:
   - Generate prompt using template strings in [prompts.ts](src/lib/services/prompts.ts)
   - Call OpenAI GPT-4o API with structured output format
   - Parse JSON response into `MultipleChoiceQuestion` objects
4. Return combined quiz list as JSON

**Critical:** The pipeline is currently **sequential** (not parallel). Consider parallelizing requests for improved performance.

## Key Design Patterns

- **Strategy Pattern**: `SectioningStrategy` is an abstract base class for different note-sectioning algorithms (currently only `StaticSectioningStrategy` implemented)
- **Service Layer Pattern**: `Quizmaster` orchestrates business logic, keeping API layer thin
- **Template Strings**: LLM prompts use TypeScript template literals for type safety and maintainability

## Development Commands

**Running the Application:**

```bash
# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Default server runs at `http://localhost:3000`

**Environment Setup:**

Create `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Testing

Tests use Jest with ts-jest for TypeScript support.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Test files are located in `src/__tests__/` directory, organized by type:

- `src/__tests__/models/` - Model tests
- `src/__tests__/services/` - Service tests

Test data fixtures are in `src/__tests__/data/`

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

### Next.js Version (autoquiz-next/)

```
autoquiz-next/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/quiz/create/      # Quiz generation API endpoint
│   │   │   └── route.ts
│   │   ├── history/              # Quiz history page
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Root layout with Toaster
│   │   ├── page.tsx              # Home page (quiz creation)
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── quiz-creation-form.tsx
│   │   └── quiz-display.tsx
│   └── lib/                      # Business logic and utilities
│       ├── models/               # TypeScript models
│       │   ├── note.ts
│       │   ├── section.ts
│       │   ├── quiz-question.ts
│       │   └── sectioning-strategy.ts
│       ├── services/             # Services
│       │   ├── openai-client.ts
│       │   ├── quizmaster.ts
│       │   └── prompts.ts
│       └── utils.ts
├── public/                       # Static assets
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Legacy Flask Version (root)

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

### Next.js Version (PRIMARY)

**Adding New Features:**

1. **New Components**: Add to `src/components/` using React and TypeScript
   - Use shadcn/ui components for consistency
   - Follow the pattern in `quiz-creation-form.tsx` and `quiz-display.tsx`

2. **New API Endpoints**: Create in `src/app/api/` following Next.js App Router conventions
   - Use `route.ts` files with named exports (GET, POST, etc.)
   - Example: `src/app/api/quiz/create/route.ts`

3. **New Models**: Add TypeScript classes to `src/lib/models/`
   - Include static methods like `fromJson()` and `exportJson()`
   - Follow the pattern in `quiz-question.ts`

4. **New Sectioning Strategies**:
   - Create new class in `src/lib/models/sectioning-strategy.ts` extending `SectioningStrategy`
   - Implement the `process(note: Note): Section[]` method
   - Update API endpoint to handle the new strategy

5. **Modifying LLM Prompts**:
   - Edit `src/lib/services/prompts.ts`
   - Maintain JSON output format expected by OpenAI API
   - Test thoroughly as prompt changes affect quiz quality

**State Management:**
- Use React Hooks (useState, useEffect) for component state
- Use localStorage for persistence (see quiz-creation-form.tsx)
- No global state management library currently used

**Styling:**
- Use Tailwind CSS utility classes
- Follow shadcn/ui design system
- Use CSS variables for theming (supports dark mode)

### Legacy Flask Version

**Adding New Models:**

Models in `core/models/` should:
- Use Pydantic for validation where appropriate
- Include a `process_from_json_lists()` classmethod if parsing from API responses
- Follow the existing pattern (see `MultipleChoiceQuestion` for reference)

**Adding New Sectioning Strategies:**

1. Create new class in `core/models/sectioning_strategy.py` that inherits from `SectioningStrategy`
2. Implement the `process(note: Note) -> list[Section]` method
3. Register the strategy name in the API endpoint validation

**Modifying LLM Prompts:**

Prompts are Jinja2 templates in `core/services/templates/`. When modifying:
- Maintain the structured output format expected by OpenAI API
- Test changes thoroughly as prompt modifications significantly affect quiz quality
- Consider the feedback about overly specific vs. conceptual questions

**Frontend Development:**

The frontend uses:
- Server-side rendering (Jinja2 templates)
- No bundler or build process
- ES6 module imports directly in browser
- Component-based organization in `frontend/static/scripts/components/`

Main entry point: [frontend/static/scripts/index.js](frontend/static/scripts/index.js)
