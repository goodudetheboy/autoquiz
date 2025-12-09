# AutoQuiz (Next.js)

AI-powered quiz generation from study notes using OpenAI's GPT-4.

## Features

- 🤖 **AI-Powered**: Automatically generate multiple-choice questions from your study notes
- 📝 **Smart Sectioning**: Divide notes into sections for better quiz coverage
- 🎯 **Practice Mode**: Interactive quiz-taking with instant feedback
- 📊 **Progress Tracking**: Track your performance and scores
- 💾 **Local Storage**: Save and manage quiz history
- 🎨 **Modern UI**: Built with Next.js, TypeScript, and shadcn/ui
- 🌓 **Dark Mode**: Full dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI**: OpenAI API (GPT-4o)
- **State Management**: React Hooks + localStorage

## Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API Key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Paste Notes**: Paste your study notes in the text area
2. **Configure Settings**:
   - Choose sectioning strategy (Static or Debug mode)
   - Set number of sections
   - Set quizzes per section
3. **Generate Quiz**: Click "Generate Quiz" and wait for AI to create questions
4. **Practice**: Use the Practice tab to test yourself with randomized answers
5. **Review**: View correct answers in the Preview tab
6. **Save**: Quiz is automatically saved to local storage

## Project Structure

```
autoquiz-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/quiz/create/   # Quiz generation API endpoint
│   │   ├── history/           # Quiz history page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── quiz-creation-form.tsx
│   │   └── quiz-display.tsx
│   └── lib/                   # Utilities and business logic
│       ├── models/           # TypeScript models
│       └── services/         # Services (OpenAI, Quizmaster)
├── public/                    # Static assets
└── package.json
```

## API Endpoint

### POST `/api/quiz/create`

Generate quiz questions from study notes.

**Request Body:**
```json
{
  "note_content": "Your study notes here...",
  "sectioning_strategy": "static_sectioning",
  "num_section": 3,
  "num_quiz_per_section": 5
}
```

**Response:**
```json
{
  "results": [
    {
      "question": "What is...?",
      "choices": [
        { "description": "Answer 1", "is_correct": true },
        { "description": "Answer 2", "is_correct": false },
        { "description": "Answer 3", "is_correct": false },
        { "description": "Answer 4", "is_correct": false }
      ]
    }
  ]
}
```

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Known Limitations

1. **Sequential Processing**: Quiz generation is currently sequential. Parallelization would improve performance.
2. **No Persistence**: Quizzes are stored in browser localStorage only
3. **Single Strategy**: Only static sectioning is currently implemented

## Future Enhancements

- Parallel API requests for faster generation
- Database persistence
- User authentication
- Difficulty settings
- Question explanations
- Export to PDF/Markdown
- Multiple sectioning strategies
- Session management with grading

## Migration from Flask

This is a complete rewrite of the original Flask application. Key improvements:

- Modern React-based UI with shadcn/ui
- Better type safety with TypeScript
- Improved user experience with real-time feedback
- Client-side state management
- Responsive design
- Practice mode with instant feedback

## License

MIT

## Contributing

Pull requests are welcome! Please follow the existing code style and commit conventions:

- `[feat]` - New features
- `[fix]` - Bug fixes
- `[docs]` - Documentation
- `[refactor]` - Code refactoring
- `[style]` - Formatting
- `[test]` - Tests
