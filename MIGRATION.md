# Migration from Flask to Next.js

This document describes the completed migration of AutoQuiz from Flask to Next.js.

## Summary

The AutoQuiz application has been successfully migrated from a Python/Flask stack to a modern Next.js/TypeScript stack. The new version is located in the `autoquiz-next/` directory.

## What Changed

### Technology Stack

**Before (Flask):**
- Backend: Flask (Python)
- Frontend: Jinja2 templates + Vanilla JavaScript
- Styling: Custom CSS
- State: Server-side sessions
- Testing: Python unittest

**After (Next.js):**
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI: React + shadcn/ui components
- Styling: Tailwind CSS
- State: React Hooks + localStorage
- Testing: Not yet implemented

### Architecture Changes

**Before:**
- Three-layer monolith (API, Core, Frontend)
- Server-rendered HTML templates
- Synchronous request handling
- No client-side routing

**After:**
- Full-stack Next.js application
- React components with client-side interactivity
- API routes co-located with frontend
- Client-side routing with App Router
- Better separation of concerns

### Feature Improvements

1. **Enhanced UI/UX:**
   - Modern, responsive design with shadcn/ui
   - Dark mode support
   - Better mobile experience
   - Real-time form validation
   - Toast notifications

2. **New Features:**
   - **Practice Mode**: Interactive quiz-taking with instant feedback
   - **Preview Mode**: View all questions with correct answers highlighted
   - **Quiz History**: Browse and manage saved quizzes
   - **Progress Tracking**: See score and completion percentage
   - **Shuffle Questions**: Randomize quiz order
   - **Edit Quiz Names**: Rename quizzes inline
   - **Export to JSON**: Copy quiz data to clipboard

3. **Better Performance:**
   - Client-side state management (no page reloads)
   - Optimistic UI updates
   - Faster navigation with client-side routing

## File Mapping

### Models

| Flask (Python) | Next.js (TypeScript) |
|----------------|---------------------|
| `core/models/note.py` | `src/lib/models/note.ts` |
| `core/models/section.py` | `src/lib/models/section.ts` |
| `core/models/quiz_question.py` | `src/lib/models/quiz-question.ts` |
| `core/models/sectioning_strategy.py` | `src/lib/models/sectioning-strategy.ts` |

### Services

| Flask (Python) | Next.js (TypeScript) |
|----------------|---------------------|
| `core/services/openai_client.py` | `src/lib/services/openai-client.ts` |
| `core/services/quizmaster.py` | `src/lib/services/quizmaster.ts` |
| `core/services/templates/quiz_request_prompt.jinja` | `src/lib/services/prompts.ts` |

### API Endpoints

| Flask (Python) | Next.js (TypeScript) |
|----------------|---------------------|
| `api/blueprints/quiz.py` | `src/app/api/quiz/create/route.ts` |
| `api/blueprints/frontend.py` | `src/app/page.tsx`, `src/app/history/page.tsx` |

### Frontend

| Flask (Python) | Next.js (TypeScript) |
|----------------|---------------------|
| `frontend/templates/pages/main.html` | `src/app/page.tsx` |
| `frontend/templates/pages/history.html` | `src/app/history/page.tsx` |
| `frontend/static/scripts/pages/main/main.js` | `src/components/quiz-creation-form.tsx` |
| `frontend/templates/components/quiz_view.html` | `src/components/quiz-display.tsx` |
| `frontend/static/scripts/components/quiz_view.js` | `src/components/quiz-display.tsx` |
| `frontend/static/styles/` | Tailwind CSS utilities |

## Getting Started with Next.js Version

1. Navigate to the Next.js directory:
```bash
cd autoquiz-next
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## What's Still the Same

- Core quiz generation logic (same algorithm)
- OpenAI API integration (same prompts)
- Sectioning strategies (StaticSectioningStrategy)
- API contract (same request/response format)
- Business rules and validation

## Known Limitations

Both versions share these limitations:

1. **Sequential Processing**: Quiz generation processes sections one at a time (not parallelized)
2. **No Persistence**: Quizzes stored in browser localStorage only (no database)
3. **Single Strategy**: Only static sectioning implemented
4. **No Authentication**: No user accounts or server-side persistence

Next.js-specific limitations:

1. **No Tests**: Test suite not yet implemented
2. **No SSR for Quiz Data**: Quiz data is client-side only
3. **No Error Boundaries**: Error handling could be more robust

## Future Enhancements

Potential improvements for the Next.js version:

- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Implement user authentication
- [ ] Parallelize API requests for better performance
- [ ] Add difficulty settings
- [ ] Include answer explanations
- [ ] Export to PDF/Markdown
- [ ] Add grading and session management
- [ ] Implement comprehensive test suite
- [ ] Add error boundaries and better error handling
- [ ] Implement server-side quiz persistence
- [ ] Add analytics and usage tracking

## Maintenance

The Flask version is kept for reference and backward compatibility. However, **all new development should focus on the Next.js version** (`autoquiz-next/`).

To eventually deprecate the Flask version:
1. Ensure feature parity is complete
2. Add comprehensive tests to Next.js version
3. Deploy Next.js version to production
4. Monitor for issues
5. Archive Flask code after stable production run

## Questions?

See:
- [Next.js README](autoquiz-next/README.md) for detailed Next.js documentation
- [CLAUDE.md](CLAUDE.md) for developer guidance
- Original [README.md](README.md) for Flask version reference
