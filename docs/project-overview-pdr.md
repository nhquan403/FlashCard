# Project Overview & Product Development Requirements

## Project Vision

A modern, interactive flashcard and quiz application leveraging spaced repetition learning (SRS) to help users efficiently memorize vocabulary and concepts. The app prioritizes user experience with smooth animations, accessibility, and effective study mechanics.

## Core Features (Completed)

### 1. Spaced Repetition System (SRS)
- SM-2 algorithm implementation for intelligent review scheduling
- Automatic calculation of next review dates based on performance
- Ease factor adjustment (range: 1.3–5.0) for progressive difficulty
- Tracks repetitions and learning intervals

**Status**: ✅ Complete  
**Files**: `src/lib/srs.ts`, `src/db/word-queries.ts`

### 2. Folder Management
- Organize words into topic-based folders
- Create, read, update, delete folders
- Per-folder statistics and learning progress

**Status**: ✅ Complete  
**Files**: `src/db/folder-queries.ts`, `src/pages/home-page.tsx`

### 3. Word Management
- CRUD operations for words with descriptions
- Optional pronunciation guide field
- SRS metrics (easeFactor, interval, repetitions, nextReview)
- Word import from CSV/text

**Status**: ✅ Complete  
**Files**: `src/db/word-queries.ts`, `src/components/words/`

### 4. Study Sessions
- Interactive flashcard UI with 3D flip animation
- Mark cards as "Got it" or "Forgot" to update SRS
- Track session statistics (total, known, forgotten)
- Session completion summary

**Status**: ✅ Complete  
**Files**: `src/pages/study-session-page.tsx`, `src/components/flashcard/`

### 5. Statistics Dashboard
- Overall learning stats (cards studied, success rate)
- Per-folder progress tracking
- Session history review

**Status**: ✅ Complete  
**Files**: `src/hooks/use-stats.ts`, `src/pages/stats-page.tsx`

### 6. Pronunciation Field (NEW)
- Optional `pronunciation?: string` field on Word model
- Pronunciation text displayed on flashcard front face
- Supports user-provided pronunciation guides (IPA, phonetic, etc.)

**Status**: ✅ Complete  
**Files**: `src/types/index.ts`, `src/components/flashcard/flip-card.tsx`

### 7. Text-to-Speech on Flashcard (NEW)
- Dual-speed speech buttons on flashcard front:
  - 🔊 Normal speed (1.0×)
  - 🐢 Slow speed (0.4×)
- Uses Web Speech API for synthesis
- Stop/cancel previous speech on new trigger
- Available only if browser supports speechSynthesis

**Status**: ✅ Complete  
**Files**: `src/lib/tts.ts`, `src/components/flashcard/flip-card.tsx`

### 8. Bulk Word Entry (Multi-Row Form) (NEW)
- "Multiple" tab in word add modal
- Add multiple words in a single operation
- Row-based entry with pronunciation support
- Add/remove rows dynamically
- All fields: word (required), description (required), pronunciation (optional)

**Status**: ✅ Complete  
**Files**: `src/components/words/multi-word-row.tsx`, `src/components/words/word-add-edit-modal.tsx`

## Technical Stack

### Frontend
- React 18 + TypeScript
- Vite (fast build tool)
- React Router v7 (navigation)
- Tailwind CSS v4 (styling)
- Lucide React (icon library)
- Framer Motion (animations)

### Database
- Dexie 4.x (IndexedDB wrapper)
- Client-side persistence only (no backend)

### Build & Development
- Node.js + npm
- ESLint for code quality
- TypeScript compiler for type safety

## Acceptance Criteria

### Word Model
- [x] Includes optional `pronunciation?: string` field
- [x] Pronunciation displays on flashcard
- [x] Field supports in forms (single & bulk entry)

### TTS Feature
- [x] 🔊 button triggers normal-speed (1×) speech synthesis
- [x] 🐢 button triggers slow-speed (0.4×) speech synthesis
- [x] Buttons appear on flashcard front face
- [x] Speech cancels when new button clicked
- [x] Feature hidden if browser lacks speechSynthesis API
- [x] Buttons don't trigger card flip (stopPropagation)

### Bulk Entry Form
- [x] "Multiple" tab accessible in add-word modal
- [x] Dynamic row addition/removal
- [x] All three fields present: word, description, pronunciation
- [x] Validation: word + description required, pronunciation optional
- [x] Submits multiple words in single operation
- [x] Form resets after successful submission

## Non-Functional Requirements

### Performance
- Fast study session load (< 1s for typical folder)
- Smooth card flip animation
- Responsive TTS (< 200ms synthesis start)

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive buttons
- Keyboard navigation support
- Respects prefers-reduced-motion for animations

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation if TTS unavailable
- IndexedDB required

### Data Storage
- Client-side only (no backend dependencies)
- Persistent IndexedDB storage
- No data synchronization across devices

## Success Metrics

1. **User can study efficiently**: SRS calculates accurate next-review dates
2. **Vocabulary learning**: Pronunciation aids and TTS increase retention
3. **Bulk data entry**: Multi-row form saves time for large imports
4. **Engagement**: Smooth animations and responsive UI encourage daily use
5. **Code Quality**: No TypeScript errors, ESLint passing, modular architecture

## Known Limitations

- Client-side storage only (data tied to device)
- No user authentication or cloud sync
- TTS quality depends on OS speech synthesis engine
- No custom voice selection
- English focus (pronunciation field is flexible but optimized for English)

## Future Enhancements (Backlog)

- Cloud synchronization across devices
- User authentication and profiles
- Spaced repetition analytics dashboard
- Custom study session options (time limits, card subsets)
- Markdown support in descriptions
- Audio file uploads for custom pronunciation
- Multi-language support
- Offline mode indicator

## Development Status

**Current Version**: 0.0.0  
**Last Updated**: 2026-05-07  
**Build Status**: ✅ Passing

**Completed Phases**:
- Core SRS algorithm
- Folder & word management
- Study session UI
- Statistics tracking
- Pronunciation field
- TTS integration
- Bulk word entry

**Next Phase**: Quality assurance and user testing
