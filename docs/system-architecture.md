# System Architecture

## High-Level Overview

A client-side React flashcard application using IndexedDB for persistence. The app implements spaced repetition learning (SM-2 algorithm) to optimize vocabulary retention through intelligent scheduling.

```
┌─────────────────────────────────────────────────────────┐
│                    React UI Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Pages        │  │ Components   │  │ Custom Hooks  │ │
│  │ (Routes)     │  │ (UI)         │  │ (State)       │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────┐
│              Database Layer (Dexie)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ Queries      │  │ Schema       │  │ Migrations    │ │
│  │ (word-,      │  │ (Indexes)    │  │ (versioning)  │ │
│  │  folder-,    │  │              │  │               │ │
│  │  session-)   │  │              │  │               │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────┴──────────────────────────────┐
│                   IndexedDB Storage                     │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ folders      │  │ words        │  │ sessions      │ │
│  │ (metadata)   │  │ (SRS metrics)│  │ (learning)    │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Core Layers

### 1. UI Layer (React Components)

#### Pages (Full Routes)
- **home-page.tsx**: Folder list, create/delete folders
- **folder-detail-page.tsx**: Words in folder, add/edit/delete words, import
- **study-session-page.tsx**: Interactive flashcard study loop
- **stats-page.tsx**: Learning progress and analytics

#### Components (Reusable)
- **flip-card.tsx**: 3D card with word (front) + definition (back), TTS buttons
- **swipe-card.tsx**: Gesture wrapper for mobile swipe interaction
- **multi-word-row.tsx**: Dynamic row for bulk word entry (new)
- **word-add-edit-modal.tsx**: Single word form OR multi-row bulk form
- **word-import-modal.tsx**: CSV/text import interface

#### Hooks (Custom State Management)
- **use-words.ts**: Word CRUD, filtering by folder
- **use-folders.ts**: Folder CRUD, listing
- **use-stats.ts**: Aggregate statistics (total studied, pass rate, etc.)

### 2. Database Layer (Dexie + IndexedDB)

#### Tables
```typescript
folders: ++id, name
├─ id: number (primary key)
├─ name: string
├─ description?: string
└─ createdAt: Date

words: ++id, folderId, nextReview
├─ id: number (primary key)
├─ folderId: number (foreign key)
├─ word: string
├─ description: string
├─ pronunciation?: string (NEW)
├─ easeFactor: number (SM-2 metric)
├─ interval: number (days until next review)
├─ repetitions: number (total review count)
├─ nextReview: Date (when to show again)
└─ lastReview?: Date

sessions: ++id, folderId, date
├─ id: number (primary key)
├─ folderId: number
├─ date: Date
├─ totalCards: number
├─ knownCount: number
└─ forgotCount: number
```

#### Query Functions
- **word-queries.ts**:
  - `getWordsByFolder(folderId)`: List words for study
  - `addWord(word)`: Create word (single or bulk)
  - `updateWord(word)`: Modify word + SRS metrics
  - `deleteWord(id)`: Remove word
  - `getCardsToDueToday()`: Due cards for study

- **folder-queries.ts**:
  - `getFolders()`: List all folders
  - `addFolder(folder)`: Create folder
  - `deleteFolder(id)`: Remove folder and its words
  - `updateFolder(folder)`: Modify folder metadata

- **session-queries.ts**:
  - `createSession(folderId)`: Start study session
  - `recordResponse(sessionId, wordId, correct)`: Update SRS metrics
  - `getSessionStats(folderId)`: Aggregate stats by folder

### 3. Business Logic Layer

#### SRS Algorithm (src/lib/srs.ts)
SM-2 spaced repetition implementation:
```typescript
export function calculateNextReview(
  quality: number,           // 0–5: user's recall rating
  easeFactor: number,        // Current ease (1.3–5.0)
  interval: number,          // Days since last review
  repetitions: number        // Total review count
): { easeFactor: number; interval: number; nextReview: Date }
```

**Algorithm Steps**:
1. Adjust ease factor based on quality: `EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))`
2. Calculate new interval: `interval' = interval * EF` (first review: 1 day, second: 3 days)
3. Set next review: `today + interval'`
4. Ensure ease factor ≥ 1.3

#### TTS Module (src/lib/tts.ts)
Wrapper around Web Speech API:
```typescript
export function speak(text: string, rate: number): void
  // rate: 1.0 (normal), 0.4 (slow)
  // Cancels previous speech, speaks new text

export function cancelSpeech(): void
  // Stop ongoing speech synthesis
```

#### Word Import Parser (src/lib/parse-word-import.ts)
Parse CSV/text for bulk imports:
```typescript
export function parseWordImport(text: string): ParsedWord[]
  // Splits by newline, extracts word|definition or custom format
  // Returns array of { word, description, pronunciation? }
```

### 4. UI Framework Stack

- **React 18**: Component rendering, hooks
- **React Router v7**: Page navigation
- **Tailwind CSS v4**: Styling (dark theme)
- **Framer Motion**: Animations (card flip, transitions)
- **Lucide React**: Icons (delete, settings, etc.)

## Data Flow

### Study Session Flow
```
1. User opens folder
   ↓ useWords(folderId)
   → Fetch words from DB
   → Filter by nextReview ≤ today (due cards)

2. User starts study
   → Display flip-card with first word
   → User can click TTS buttons (🔊 or 🐢) before flipping

3. User reveals definition (tap card)
   → Card flips 180°
   → Shows definition on back

4. User marks response
   ↓ (Got it / Forgot)
   → calculateNextReview() applies SM-2 algorithm
   → updateWord() persists new SRS metrics
   → recordResponse() logs session progress

5. Session complete
   → Show summary (total, correct, forgotten)
   → Update stats (use-stats hook aggregates)
```

### Bulk Word Entry Flow
```
1. User clicks "Add Words" → "Multiple" tab
   ↓ word-add-edit-modal.tsx shows multi-row form

2. User fills rows (word, description, pronunciation)
   ↓ multi-word-row.tsx state management

3. User adds/removes rows dynamically
   → onChange handlers update local state
   → onRemove handlers delete rows

4. User clicks "Add All"
   ↓ Validate all rows (word + description required)

5. Submit to DB
   → for each row: addWord(wordData)
   → Update folder word count in stats
   → Reset form

6. User sees confirmation
   ↓ Words added to folder
```

## Component Interaction Graph

```
App.tsx (Router)
├── home-page.tsx
│   ├── use-folders.ts ──→ folder-queries.ts ──→ DB
│   └── word-add-edit-modal.tsx
│       ├── multi-word-row.tsx (NEW)
│       └── word-import-modal.tsx
│
├── folder-detail-page.tsx
│   ├── use-words.ts ──→ word-queries.ts ──→ DB
│   ├── word-list.tsx
│   │   └── word-row.tsx
│   └── word-add-edit-modal.tsx
│       └── multi-word-row.tsx (NEW)
│
├── study-session-page.tsx
│   ├── use-words.ts ──→ word-queries.ts ──→ DB
│   ├── swipe-card.tsx
│   │   └── flip-card.tsx (uses tts.ts)
│   └── session-complete.tsx
│
└── stats-page.tsx
    └── use-stats.ts ──→ session-queries.ts ──→ DB
```

## State Management Strategy

### Local Component State
- Form inputs (controlled components)
- UI state (modal open/close, loading indicators)

### Custom Hooks (Server State)
- Words, folders, sessions managed in hooks
- Hooks fetch from DB on mount
- Updates persist to DB immediately (no Redux-like queue)

### No Global State
- Context not used (overhead for small app)
- Hooks communicate via callbacks (parent → child)
- Database is single source of truth

## Persistence Strategy

### IndexedDB
- **Pros**: Structured data, indexes, transactions, large capacity
- **Cons**: No cross-device sync, no backup
- **Usage**: Store all words, folders, sessions locally

### No Backend
- Simplifies development (no server needed)
- Data stays on user's device
- Future: can add cloud sync in Phase 5

## Performance Optimizations

### Rendering
- React.memo on expensive components (flip-card, word-list rows)
- useReducedMotion respected for animations
- Lazy loading of routes (React Router splitting)

### Database
- Indexes on `folderId`, `nextReview` for fast filtering
- Batch updates (transaction-like with Dexie)

### Bundle
- Tree-shaking (Vite, Tailwind)
- Code splitting by route
- No large dependencies (Web Speech API is native)

## Error Handling Strategy

### Database Failures
- Try-catch in all queries
- Log to console (client-side only)
- Graceful fallback: show cached data if possible

### TTS Unavailable
- Check `window.speechSynthesis` exists
- Hide TTS buttons if unsupported
- No error shown to user (graceful degradation)

### Invalid Data
- TypeScript prevents most invalid data
- Form validation before submission (word + description required)
- Database constraints (NOT NULL on key fields)

## Security Model

### No Authentication
- Demo app (no users)
- All data stored locally in IndexedDB

### Input Validation
- Trim whitespace
- React auto-escapes HTML (prevents XSS)
- No SQL injection (IndexedDB uses queries, not SQL strings)

### Data Privacy
- All data stays on device
- No tracking or analytics
- No network requests (except page load)

## Accessibility Architecture

### Semantic HTML
- Pages use `<main>`, `<nav>`, `<section>`
- Buttons have `aria-label`
- Form labels linked to inputs

### Keyboard Navigation
- Tab order follows visual flow
- Buttons clickable via Enter/Space
- Modal focus trap (where applicable)

### Motion Preferences
- Framer Motion checks `useReducedMotion()`
- Animations disabled if user prefers reduced motion
- Fallback to opacity changes

## Scalability Considerations

### Current Limits (Fine)
- 1000+ words per folder (IndexedDB handles)
- 100+ study sessions (aggregation queries may slow)
- Single device, no sync

### Future Scaling (Phase 5+)
- Cloud backend: PostgreSQL for structured data
- Server-side SRS calculations
- Multi-user sync engine
- Real-time collaboration

## Dependencies & External APIs

### Browser APIs
- **Web Speech API**: Text-to-speech (no fallback)
- **IndexedDB**: Data persistence (required)
- **Fetch API**: Future cloud sync

### NPM Dependencies
- React, React Router, Dexie, Tailwind, Framer Motion
- All well-maintained, stable versions

### No External Services
- No analytics, no ads, no tracking
- No third-party APIs (fully client-side)
