# Code Standards & Architecture

## Project Structure

```
src/
├── types/                      # TypeScript interfaces & types
│   └── index.ts               # Folder, Word, StudySession
├── lib/                        # Utility functions & algorithms
│   ├── tts.ts                 # Text-to-speech wrapper
│   ├── srs.ts                 # SM-2 spaced repetition algorithm
│   └── parse-word-import.ts   # CSV/text parsing utilities
├── db/                         # Database layer (Dexie)
│   ├── database.ts            # Schema & initialization
│   ├── queries.ts             # General/utility queries
│   ├── word-queries.ts        # Word CRUD & filtering
│   ├── folder-queries.ts      # Folder operations
│   └── session-queries.ts     # Study session tracking
├── hooks/                      # React custom hooks
│   ├── use-words.ts           # Word state & operations
│   ├── use-folders.ts         # Folder state & operations
│   └── use-stats.ts           # Statistics aggregation
├── pages/                      # Full-page components (routes)
│   ├── home-page.tsx          # Folder list
│   ├── folder-detail-page.tsx # Word list for folder
│   ├── study-session-page.tsx # Flashcard study interface
│   └── stats-page.tsx         # Learning statistics dashboard
├── components/                 # Reusable UI components
│   ├── flashcard/
│   │   ├── flip-card.tsx      # 3D flip card (word + definition + TTS)
│   │   ├── swipe-card.tsx     # Swipe gesture wrapper
│   │   └── session-complete.tsx # End-of-session summary
│   ├── words/
│   │   ├── word-list.tsx      # Words table
│   │   ├── word-row.tsx       # Individual word row
│   │   ├── multi-word-row.tsx # Multi-entry row for bulk add
│   │   ├── word-add-edit-modal.tsx # Single/bulk word form
│   │   └── word-import-modal.tsx # CSV import dialog
│   └── ui/
│       ├── bottom-nav.tsx     # Mobile navigation bar
│       ├── top-nav.tsx        # Header/top bar
│       └── responsive-sheet.tsx # Mobile-friendly sheet component
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | kebab-case.tsx | `flip-card.tsx`, `word-list.tsx` |
| TypeScript utilities | kebab-case.ts | `parse-word-import.ts`, `use-words.ts` |
| Hooks | `use-{name}.ts` | `use-words.ts`, `use-stats.ts` |
| Database queries | `{domain}-queries.ts` | `word-queries.ts`, `folder-queries.ts` |
| Pages | `{page-name}-page.tsx` | `home-page.tsx`, `study-session-page.tsx` |

## TypeScript Strict Mode

All code uses TypeScript strict mode. No `any` types without explicit justification.

```typescript
// ✅ Good: explicit types
const words: Word[] = [];
function getFolder(id: number): Folder | undefined { }

// ❌ Avoid: implicit any
const data: any = {};
function process(item) { }
```

## React Hooks & Patterns

### Custom Hooks
- Use `use{Name}` naming
- Keep hooks focused (single responsibility)
- Avoid circular dependencies between hooks

```typescript
// ✅ Good: focused hook
export function useWords(folderId: number) {
  const [words, setWords] = useState<Word[]>([]);
  // ... fetch and manage words
  return { words, addWord, deleteWord, updateWord };
}
```

### Component Props
- Define props as interfaces
- Use optional props carefully (provide defaults)
- Destructure in function parameters

```typescript
interface FlipCardProps {
  word: string;
  description: string;
  isFlipped: boolean;
  onClick: () => void;
  pronunciation?: string;  // Optional field
}

export default function FlipCard({ word, description, isFlipped, onClick, pronunciation }: FlipCardProps) {
  // Component code
}
```

## Database Layer (Dexie)

### Schema Definition
- Define schema in `database.ts`
- Use clear table and index names
- Include timestamps (createdAt, updatedAt)

```typescript
// ✅ Good schema
export const db = new Dexie('QuizDB') as Database;
db.version(1).stores({
  folders: '++id, name',
  words: '++id, folderId, nextReview',
  sessions: '++id, folderId, date',
});
```

### Query Functions
- Organize by domain: `word-queries.ts`, `folder-queries.ts`
- Use descriptive function names
- Return typed results

```typescript
// ✅ Good query function
export async function getWordsByFolder(folderId: number): Promise<Word[]> {
  return db.words
    .where('folderId')
    .equals(folderId)
    .toArray();
}
```

## Styling with Tailwind CSS

### Principles
- Use Tailwind utilities instead of custom CSS
- Dark theme primary (light theme supported via class toggle)
- Mobile-first responsive design

### Common Classes
```
Dark backgrounds: bg-gray-900, bg-gray-800, bg-gray-700
Text: text-gray-100, text-gray-400, text-gray-500
Borders: border-gray-700, border-gray-600
Focus states: focus:border-blue-500, focus:outline-none
Responsive: md:, lg:, xl: prefixes
```

### Animations
- Use Framer Motion for complex animations
- Keep animations under 500ms (reduces cognitive load)
- Respect `prefers-reduced-motion`

```typescript
// ✅ Good: respects motion preferences
const prefersReduced = useReducedMotion() ?? false;
<div style={{
  transition: prefersReduced ? 'opacity 200ms' : 'transform 500ms',
}}>
```

## Error Handling

### Database Operations
- Use try-catch blocks
- Log errors for debugging
- Provide user-friendly feedback

```typescript
// ✅ Good error handling
async function addWord(word: Word) {
  try {
    const id = await db.words.add(word);
    return { success: true, id };
  } catch (error) {
    console.error('Failed to add word:', error);
    return { success: false, error };
  }
}
```

### Component Error Boundaries
- Use error boundaries for component trees
- Provide fallback UI

## Testing Standards

### Unit Tests
- Test business logic (SRS, parsing, calculations)
- Aim for 80%+ coverage on utility functions
- Use meaningful test descriptions

### Integration Tests
- Test database operations (queries return expected data)
- Test hook interactions

### E2E Tests
- User flows: folder creation → study session → stats view
- TTS functionality activation
- Multi-row form submission

## Code Quality Guidelines

### Readability
- Keep functions under 50 lines where possible
- Use descriptive variable/function names
- Add comments for non-obvious logic

```typescript
// ✅ Good: clear variable names
const nextReviewDate = calculateNextReview(word.easeFactor, word.interval);

// ❌ Avoid: single-letter or unclear names
const nrd = calc(w.ef, w.i);
```

### Performance
- Avoid unnecessary re-renders (use React.memo for expensive components)
- Cache calculations where appropriate
- Lazy-load routes

```typescript
// ✅ Good: memoized component
const FlipCard = React.memo(function FlipCard({ word, description }: Props) {
  // Component code
});
```

### DRY Principle
- Extract common patterns into utilities or custom hooks
- Avoid duplicating conditional logic

## Accessibility Standards

### Semantics
- Use semantic HTML: `<button>`, `<nav>`, `<main>`
- Proper heading hierarchy
- ARIA labels for icon buttons

```typescript
// ✅ Good accessibility
<button
  onClick={handleSpeak}
  aria-label="Speak pronunciation"
  title="Normal speed"
>
  🔊
</button>
```

### Keyboard Navigation
- All interactive elements keyboard-accessible
- Visible focus indicators
- Tab order follows visual flow

### Color Contrast
- Text contrast ratio ≥ 4.5:1 (WCAG AA)
- Don't rely on color alone to convey meaning

## Git Commit Conventions

Use conventional commit format:

```
feat: add pronunciation field to Word model
fix: correct SRS calculation for ease factor
docs: update codebase summary
refactor: extract TTS logic into separate utility
test: add unit tests for SM-2 algorithm
```

**Format**: `{type}: {description}`
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation only
- `refactor`: code restructuring (no behavior change)
- `test`: test files or coverage improvements
- `chore`: build, dependencies, configuration

## Performance Checklist

- [ ] Components use React.memo for expensive renders
- [ ] No console warnings in production build
- [ ] Database queries indexed appropriately
- [ ] Lazy load routes
- [ ] CSS tree-shaken by Tailwind (no unused styles)
- [ ] Image optimization (if applicable)
- [ ] Bundle size < 500KB gzipped

## Security Practices

- No sensitive data in localStorage (use IndexedDB for temporary data)
- Sanitize user input before display (React auto-escapes)
- HTTPS only in production
- No hardcoded secrets
- Validate data on client (server validation not needed for demo)

## Development Workflow

1. Create feature branch: `git checkout -b feat/feature-name`
2. Follow TypeScript strict mode
3. Write tests for utility functions
4. Run `npm run lint` before commit
5. Run `npm run build` to verify no errors
6. Commit with conventional message
7. Submit PR for review
8. Merge after approval

## Dependencies

### Core Dependencies
- `react@18`: UI library
- `react-router-dom@7`: Navigation
- `dexie@4`: IndexedDB wrapper
- `tailwindcss@4`: Styling
- `framer-motion`: Animations
- `lucide-react`: Icons

### Development Dependencies
- `typescript`: Type checking
- `eslint`: Linting
- `vite`: Build tool

### Policy
- Minimize dependencies
- Use native browser APIs (e.g., Web Speech API for TTS)
- Prefer utility functions over heavy libraries
