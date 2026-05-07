# Quiz App Documentation

A React + TypeScript flashcard application with spaced repetition learning (SM-2 algorithm), IndexedDB persistence, and modern UX.

## Quick Navigation

### For New Developers
Start here to understand the project:
1. **[Codebase Summary](./codebase-summary.md)** — Tech stack, features overview, file structure
2. **[Code Standards](./code-standards.md)** — File organization, naming conventions, patterns to follow
3. **[System Architecture](./system-architecture.md)** — Data flow, component hierarchy, database design

### For Product & Planning
- **[Project Overview & PDR](./project-overview-pdr.md)** — Features, requirements, acceptance criteria
- **[Development Roadmap](./development-roadmap.md)** — Timeline, phases, milestones, backlog

### For Maintainers
- **[Code Standards](./code-standards.md)** — Git workflow, linting, TypeScript strict mode
- **[System Architecture](./system-architecture.md)** — Performance considerations, error handling, security

---

## Feature Highlights

### Core Learning System
- **Spaced Repetition (SM-2)**: Intelligent review scheduling based on recall quality
- **Study Sessions**: Interactive flashcard UI with flip animation
- **Folder Organization**: Group words by topic or language

### User Experience
- **Pronunciation Field** (NEW): Optional pronunciation guide displayed on flashcard
- **Text-to-Speech** (NEW): 🔊 (fast) and 🐢 (slow) speed buttons for word pronunciation
- **Bulk Word Entry** (NEW): Multi-row form for adding multiple words at once
- **Statistics Dashboard**: Track learning progress, success rates, and study history

### Technical Highlights
- **Client-side**: No backend required, all data stored in IndexedDB
- **Modern Stack**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Accessible**: Keyboard navigation, ARIA labels, respects motion preferences
- **Performance**: Fast load times, smooth animations, optimized queries

---

## Documentation Overview

| Document | Purpose | Audience |
|----------|---------|----------|
| **codebase-summary.md** | High-level overview of architecture, tech stack, and key components | Developers, tech leads |
| **code-standards.md** | Development guidelines, file structure, patterns, and quality standards | All developers |
| **system-architecture.md** | Deep dive into layers, data flow, database design, and integrations | Architects, senior devs |
| **project-overview-pdr.md** | Feature specifications, requirements, acceptance criteria, and product status | Product managers, QA, devs |
| **development-roadmap.md** | Project timeline, phase progress, milestones, and future enhancements | Project managers, product team |

---

## Latest Changes (v0.0.0)

**2026-05-07 — Feature Complete**

Three new features added and documented:

1. **Pronunciation Field**
   - Optional `pronunciation?: string` on Word model
   - Displayed under word text on flashcard front
   - Supported in both single and bulk word entry forms

2. **Text-to-Speech (TTS)**
   - Dual-speed buttons: 🔊 (normal 1×) and 🐢 (slow 0.4×)
   - Located on flashcard front face
   - Uses Web Speech API, gracefully hidden if unavailable
   - Implementation: `src/lib/tts.ts`

3. **Bulk Word Entry (Multi-Row Form)**
   - "Multiple" tab in add-word modal
   - Add/remove rows dynamically
   - All three fields: word (required), description (required), pronunciation (optional)
   - Submit multiple words in single operation
   - Component: `src/components/words/multi-word-row.tsx`

See **[Development Roadmap](./development-roadmap.md#phase-3-ux-enhancements-complete)** for details.

---

## Project Structure

```
src/
├── types/                    # TypeScript interfaces
├── lib/                      # Utilities & algorithms
│   ├── tts.ts               # Text-to-speech
│   ├── srs.ts               # SM-2 spaced repetition
│   └── parse-word-import.ts # CSV parsing
├── db/                       # Database layer (Dexie)
├── hooks/                    # Custom React hooks
├── pages/                    # Full-page components
└── components/               # Reusable UI components
    ├── flashcard/           # Study interface
    └── words/               # Word management
```

For complete details, see **[Code Standards](./code-standards.md#project-structure)**.

---

## Development Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Build for production
npm run lint     # Check code quality (ESLint)
npm run preview  # Preview production build
```

---

## Key Resources

### Architecture & Design
- **[System Architecture](./system-architecture.md)** — Complete technical overview
- **[Code Standards](./code-standards.md)** — Patterns and conventions

### Features & Requirements
- **[Project Overview & PDR](./project-overview-pdr.md)** — What's implemented, what's planned
- **[Development Roadmap](./development-roadmap.md)** — Timeline and phases

### Onboarding
1. Read **[Codebase Summary](./codebase-summary.md)** (10 min)
2. Browse **[Code Standards](./code-standards.md)** for structure (15 min)
3. Dive into **[System Architecture](./system-architecture.md)** for details (20 min)
4. Check specific component files in `src/` as needed

---

## Documentation Standards

All documentation:
- ✅ Verified against actual codebase
- ✅ Include code examples with correct syntax
- ✅ Link to relevant files and related docs
- ✅ Keep files under 800 lines for readability
- ✅ Use clear, direct language
- ✅ Update after code changes

---

## Questions or Issues?

Refer to the appropriate documentation:
- **"How do I add a word?"** → Check [System Architecture: Study Flow](./system-architecture.md#study-session-flow)
- **"Where's the TTS code?"** → See [Codebase Summary: TTS Library](./codebase-summary.md#tts-library-srclibttsts)
- **"What's the project timeline?"** → Review [Development Roadmap](./development-roadmap.md)
- **"How should I name files?"** → Follow [Code Standards: File Naming](./code-standards.md#file-naming-conventions)

---

**Last Updated**: 2026-05-07  
**Version**: 0.0.0  
**Status**: Phase 3 Complete, Phase 4 In Progress (QA)
