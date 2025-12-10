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
   - `settings/page.tsx`: Settings page for API key and model configuration
   - `layout.tsx`: Root layout with Toaster

2. **API Layer** (`src/app/api/`): Next.js API routes
   - `quiz/create/route.ts`: POST endpoint for quiz generation
   - `quiz/test/route.ts`: POST endpoint for testing API key validity

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
- Settings page for API key and model configuration
- API key testing functionality

## Quiz Generation Pipeline

The core workflow in [quizmaster.ts](src/lib/services/quizmaster.ts):

1. User submits notes + settings → POST `/api/quiz/create`
2. Note is divided into N sections using a `SectioningStrategy`:
   - **Basic Strategy** (default): Single section containing entire note
   - **Static Strategy**: N sections divided evenly by line count
3. For each section:
   - Generate prompt using template strings in [prompts.ts](src/lib/services/prompts.ts)
   - Call OpenAI GPT-5 API with structured output format
   - Parse JSON response into `MultipleChoiceQuestion` objects
4. Return combined quiz list as JSON

**Note:** The pipeline processes sections **sequentially**. For Basic strategy (single section), this means one API call. For Static strategy with multiple sections, consider parallelizing requests for improved performance.

## Key Design Patterns

- **Strategy Pattern**: `SectioningStrategy` is an abstract base class for different note-sectioning algorithms:
  - `BasicSectioningStrategy`: Sends entire note to LLM in one request (recommended)
  - `StaticSectioningStrategy`: Splits note into N sections by line count
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

No environment variables are required. The application uses browser-based settings stored in localStorage.

1. Run the development server: `npm run dev`
2. Navigate to Settings page (click Settings button in header)
3. Enter your OpenAI API key (get one from [OpenAI Dashboard](https://platform.openai.com/api-keys))
4. Select your preferred model:
   - `gpt-5-mini-2025-08-07` (Default, faster and cheaper)
   - `gpt-5-nano-2025-08-07` (Smallest and fastest)
5. Test your API key using the "Test API Key" button
6. Save your settings

**Important:** Your API key is stored only in your browser's localStorage and is never sent to AutoQuiz servers. All requests are made directly from your browser to OpenAI's API.

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
  "sectioning_strategy": "basic_sectioning",  // "basic_sectioning" (default) or "static_sectioning"
  "num_section": 1,  // Number of sections (1 for basic, N for static)
  "num_quiz_per_section": 10,  // Questions generated per section
  "api_key": "sk-...",  // OpenAI API key from localStorage
  "model": "gpt-5-mini-2025-08-07"  // Model name (gpt-5-mini-2025-08-07 or gpt-5-nano-2025-08-07)
}
```

**Sectioning Strategies:**

- `basic_sectioning` (Recommended): Sends entire note to LLM in one request. Set `num_section: 1` and `num_quiz_per_section` to total desired questions.
- `static_sectioning`: Splits note into `num_section` sections, generates `num_quiz_per_section` questions per section.

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

### POST `/api/quiz/test`

Tests OpenAI API key validity.

**Request Body:**

```json
{
  "api_key": "sk-...",  // OpenAI API key to test
  "model": "gpt-5-mini-2025-08-07"  // Model name to test
}
```

**Response (200 OK):**

```json
{
  "success": true
}
```

**Error Responses:**

- 400: Invalid API key or model name
- 401: Unauthorized (invalid API key)
- 500: Server error

### Environment Configuration

The application uses browser-based configuration stored in localStorage:

- **OpenAI API key**: Configured via Settings page, stored in `localStorage.openai_api_key`
- **Model**: User-selected model (gpt-5-mini-2025-08-07 or gpt-5-nano-2025-08-07), stored in `localStorage.openai_model`
- **Default model**: `gpt-5-mini-2025-08-07` (recommended for most use cases; gpt-5-nano-2025-08-07 is faster/cheaper but lower quality)

## Technology Stack

**Frontend:**

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui component library

**Backend:**

- Next.js API Routes
- OpenAI SDK (v4)
- TypeScript

**State Management:**

- React Hooks (useState, useEffect)
- localStorage for persistence

**Testing:**

- Jest 29 with ts-jest
- TypeScript support for tests

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
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/quiz/
│   │   │   ├── create/           # Quiz generation API endpoint
│   │   │   │   └── route.ts
│   │   │   └── test/             # API key test endpoint
│   │   │       └── route.ts
│   │   ├── history/              # Quiz history page
│   │   │   └── page.tsx
│   │   ├── settings/             # Settings page
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Root layout with Toaster
│   │   ├── page.tsx              # Home page (quiz creation)
│   │   └── globals.css           # Global styles
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── quiz-creation-form.tsx
│   │   └── quiz-display.tsx
│   ├── lib/                      # Business logic and utilities
│   │   ├── models/               # TypeScript models
│   │   │   ├── note.ts
│   │   │   ├── section.ts
│   │   │   ├── quiz-question.ts
│   │   │   └── sectioning-strategy.ts
│   │   ├── services/             # Services
│   │   │   ├── openai-client.ts
│   │   │   ├── quizmaster.ts
│   │   │   └── prompts.ts
│   │   └── utils.ts
│   └── __tests__/                # Test files
│       ├── models/               # Model tests
│       ├── services/             # Service tests
│       └── data/                 # Test fixtures
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── jest.config.ts
└── README.md
```

## Working with This Codebase

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
   - Add option to quiz creation form UI
   - Current strategies:
     - `BasicSectioningStrategy`: Returns entire note as single section
     - `StaticSectioningStrategy`: Divides note into N equal sections by line count

5. **Modifying LLM Prompts**:
   - Edit `src/lib/services/prompts.ts`
   - Maintain JSON output format expected by OpenAI API
   - Test thoroughly as prompt changes affect quiz quality

**State Management:**

- Use React Hooks (useState, useEffect) for component state
- Use localStorage for persistence (see [quiz-creation-form.tsx](src/components/quiz-creation-form.tsx))
- No global state management library currently used

**Styling:**

- Use Tailwind CSS utility classes
- Follow shadcn/ui design system
- Use CSS variables for theming (supports dark mode)
