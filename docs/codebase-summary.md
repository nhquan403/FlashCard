# Codebase Summary

A React + TypeScript flashcard/quiz application with spaced repetition learning (SRS), built with Vite, Dexie (IndexedDB), and Tailwind CSS.

## Key Features

- **Spaced Repetition System (SRS)**: SM-2 algorithm for intelligent review scheduling
- **Flashcard Study**: Flip-card UI for word-definition learning
- **Multiple Folders**: Organize words into topic-based folders
- **Study Sessions**: Track learning progress with stats
- **Pronunciation Field**: Optional pronunciation guide on word cards
- **Text-to-Speech (TTS)**: Fast (1×) and slow (0.4×) speech buttons on flashcard front
- **Bulk Word Entry**: Multi-row form for adding multiple words at once
- **Word Import**: CSV/text import with word parsing
- **Statistics Dashboard**: Track studies, success rates, and learning progress

## Architecture

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Routing**: React Router v7
- **State Management**: React Hooks + Dexie React Hooks
- **Styling**: Tailwind CSS v4
- **UI Components**: Lucide React icons, custom card components
- **Animations**: Framer Motion

### Database
- **Engine**: Dexie (IndexedDB wrapper)
- **Schema**: Folders, Words, StudySessions
- **Persistence**: Client-side IndexedDB storage

## Core File Structure

```
src/
├── types/                  # TypeScript interfaces
│   └── index.ts           # Word, Folder, StudySession types
├── lib/
│   ├── tts.ts             # Text-to-speech utilities
│   ├── srs.ts             # SM-2 spaced repetition algorithm
│   └── parse-word-import.ts # CSV/text parsing
├── db/
│   ├── database.ts        # Dexie schema & initialization
│   ├── queries.ts         # General queries
│   ├── word-queries.ts    # Word CRUD & filtering
│   ├── folder-queries.ts  # Folder operations
│   └── session-queries.ts # Study session tracking
├── hooks/
│   ├── use-words.ts       # Word state management
│   ├── use-folders.ts     # Folder state management
│   └── use-stats.ts       # Statistics aggregation
├── pages/
│   ├── home-page.tsx      # Folder list
│   ├── folder-detail-page.tsx # Word list for folder
│   ├── study-session-page.tsx # Flashcard study UI
│   └── stats-page.tsx     # Learning statistics
└── components/
    ├── flashcard/
    │   ├── flip-card.tsx  # 3D flip card component with TTS
    │   ├── swipe-card.tsx # Swipe gesture wrapper
    │   └── session-complete.tsx # End-of-session summary
    └── words/
        ├── word-list.tsx  # Words table for folder
        ├── word-row.tsx   # Individual word row
        ├── multi-word-row.tsx # Multi-entry row component
        ├── word-add-edit-modal.tsx # Single word form
        └── word-import-modal.tsx # CSV import dialog
```

## Key Components

### Word Type
```typescript
interface Word {
  id?: number;
  folderId: number;
  word: string;
  description: string;
  easeFactor: number;           // SRS ease factor
  interval: number;             // Days until next review
  repetitions: number;          // Total review count
  nextReview: Date;
  lastReview?: Date;
  pronunciation?: string;       // NEW: Optional pronunciation guide
}
```

### TTS Library (`src/lib/tts.ts`)
- `speak(text: string, rate: number)`: Trigger speech synthesis at given rate
  - `rate: 1.0` for normal speed
  - `rate: 0.4` for slow speed
- `cancelSpeech()`: Stop ongoing speech

### Multi-Word Row Component (`src/components/words/multi-word-row.tsx`)
- Handles bulk entry of multiple words with pronunciation
- Supports add/remove row operations
- Fields: word, description, pronunciation (optional)

### Flip Card Component (`src/components/flashcard/flip-card.tsx`)
- 3D flip animation showing word on front, definition on back
- Displays pronunciation text under word (if provided)
- TTS buttons (🔊 fast, 🐢 slow) on front face
- Responsive sizing with viewport constraints

## Study Flow

1. **Folder View**: Browse word collections
2. **Study Session**: Enter folder, start quiz
3. **Flashcard**: View word + pronunciation, tap to reveal definition
4. **TTS**: Click 🔊/🐢 to hear pronunciation at different speeds
5. **Mark Response**: "Got it" / "Forgot" updates SRS metrics
6. **Session Complete**: Summary of new/review cards
7. **Stats**: Track learning progress over time

## Spaced Repetition Algorithm

SM-2 implementation in `src/lib/srs.ts`:
- Adjusts ease factor based on recall quality (0-5 scale)
- Calculates next review interval
- Minimum ease factor: 1.3
- Tracks repetitions for progressive difficulty

## Recent Changes

**v0.0.0 (Latest Build)**
- Added `pronunciation?: string` field to Word model
- Created `multi-word-row.tsx` component for bulk word entry
- Implemented TTS with dual-speed buttons (normal + slow) on flip-card front
- Display pronunciation text under word on flashcard

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint check
npm run preview  # Preview production build
```
