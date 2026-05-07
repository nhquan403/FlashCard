# Development Roadmap

## Overview

Flashcard/Quiz application with spaced repetition learning. Current focus: core feature completion and quality assurance.

## Phase Status Summary

| Phase | Status | Progress | Target |
|-------|--------|----------|--------|
| Foundation | ✅ Complete | 100% | Q1 2026 |
| Core Features | ✅ Complete | 100% | Q2 2026 |
| UX Enhancements | ✅ Complete | 100% | Q2 2026 |
| Quality Assurance | 🔄 In Progress | 90% | Q2 2026 |

## Phase Details

### Phase 1: Foundation (COMPLETE)
Build core infrastructure and data models.

**Completed**:
- [x] Vite + React + TypeScript setup
- [x] Dexie IndexedDB integration
- [x] TypeScript types (Folder, Word, StudySession)
- [x] Database schema and migrations
- [x] React Router navigation

**Duration**: 1–2 weeks  
**Status**: ✅ Complete

---

### Phase 2: Core Features (COMPLETE)
Implement essential SRS functionality.

**Completed**:
- [x] Folder CRUD operations
- [x] Word CRUD operations
- [x] SM-2 spaced repetition algorithm
- [x] Study session logic (mark correct/incorrect)
- [x] Session tracking and statistics
- [x] Word import from CSV/text
- [x] Home page (folder list)
- [x] Folder detail page (word list)
- [x] Study session page (flashcard UI)
- [x] Stats page (learning progress)

**Duration**: 3–4 weeks  
**Status**: ✅ Complete

---

### Phase 3: UX Enhancements (COMPLETE)
Improve user experience and add convenience features.

**Completed**:
- [x] Responsive design (mobile-first)
- [x] Bottom navigation bar
- [x] Framer Motion animations (card flip, transitions)
- [x] Tailwind CSS dark theme
- [x] Pronunciation field on Word model
- [x] Pronunciation display on flashcard
- [x] Text-to-Speech (TTS) integration
  - [x] Dual-speed speech buttons (🔊 fast, 🐢 slow)
  - [x] TTS buttons on flashcard front face
  - [x] Speech synthesis via Web Speech API
- [x] Bulk word entry (multi-row form)
  - [x] "Multiple" tab in add-word modal
  - [x] Dynamic row add/remove
  - [x] Pronunciation field in multi-row entry

**Duration**: 2–3 weeks  
**Status**: ✅ Complete

---

### Phase 4: Quality Assurance (IN PROGRESS)
Test, review, and finalize for release.

**In Progress**:
- [ ] Unit tests for SRS algorithm
- [ ] Component integration tests
- [ ] E2E user flow tests
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization (bundle size, load time)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Bug fixes from testing

**Target**: Q2 2026  
**Est. Duration**: 2 weeks

---

## Future Roadmap (Backlog)

### Phase 5: Cloud Sync (Planned)
Enable cross-device synchronization.

**Features**:
- User authentication (email/password)
- Cloud backend (Node.js + PostgreSQL)
- Data sync to server
- Account management page

**Priority**: Medium  
**Est. Effort**: 3–4 weeks

---

### Phase 6: Advanced Analytics (Planned)
Deeper learning insights.

**Features**:
- Heatmap of review dates
- Learning curve graph
- Time-to-mastery estimates
- Difficulty distribution chart

**Priority**: Low  
**Est. Effort**: 1–2 weeks

---

### Phase 7: Custom Study Options (Planned)
Flexible study session configuration.

**Features**:
- Time-limited sessions
- Card subset selection (by difficulty, date range)
- Study priorities (new vs review)
- Session scheduling

**Priority**: Low  
**Est. Effort**: 2 weeks

---

## Milestone Timeline

| Milestone | Target Date | Status |
|-----------|------------|--------|
| MVP (Phases 1–2) | Q1 2026 | ✅ Complete |
| UX Enhancements (Phase 3) | Q2 2026 | ✅ Complete |
| QA & Bug Fixes (Phase 4) | Q2 2026 | 🔄 In Progress |
| v1.0 Release | June 2026 | 🎯 On Track |
| Cloud Sync (Phase 5) | Q3 2026 | 📋 Planned |

---

## Latest Updates (v0.0.0)

**2026-05-07**:
- ✅ Pronunciation field added to Word model
- ✅ Pronunciation text display on flashcard
- ✅ TTS integration with dual-speed buttons
- ✅ Bulk word entry (multi-row form) implemented
- 🔄 Moving into QA phase

---

## Dependencies & Blockers

**No current blockers**. All planned Phase 4 tasks are unblocked.

### External Dependencies
- Web Speech API (for TTS) — browser-dependent
- IndexedDB (for persistence) — standard in modern browsers

---

## Success Criteria for Each Phase

### Phase 4 (Current)
- [ ] All unit tests passing (100% coverage on SRS)
- [ ] No console errors in dev/prod builds
- [ ] Lighthouse score > 90 (Performance, Accessibility)
- [ ] All WCAG 2.1 AA violations fixed
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Performance: initial load < 3s on 4G

---

## Notes

- Features are prioritized by learning impact (SRS > UX > Analytics)
- Mobile-first approach ensures accessibility
- Client-side storage simplifies initial development (cloud sync deferred to Phase 5)
- TTS leverages native browser APIs (no external dependency)
