# Flashcard Vocabulary App - Full Frontend Completion

**Date**: 2026-05-07 20:11
**Severity**: Low (Completion)
**Component**: React Frontend / IndexedDB
**Status**: Resolved

## What Happened

Completed a full-stack frontend flashcard web app in 7 phases: Vite scaffolding → Dexie.js IndexedDB → folder/word CRUD → flashcard study with SM-2 algorithm → progress stats with Recharts → responsive dual navigation. All TypeScript strict mode, zero build errors.

## Key Technical Gotchas

1. **Tailwind v4 + 3D Transforms**: CSS `transform-style: preserve-3d` and `transform: rotateY(180deg)` *cannot* use utility classes—must be inline styles. Wasted 30min debugging flipped card rendering.

2. **Vite CLI + Non-Empty Directory**: `npm create vite@latest` rejected directory with existing `package.json`. Manual scaffold required (copied template files, installed deps). Worth documenting for future projects.

3. **IndexedDB Bulk Operations**: Used `db.transaction()` wrapper around `bulkAdd(2000 items)` to ensure atomic import or rollback. Single call was silently failing on large batches.

4. **Dexie `useLiveQuery` Timing**: Component renders before query resolves; must guard with `!data ? "loading" : data.length`. Recharts throws if array undefined.

## Implementation Reality

Built this *alone* across 7 focused phases. No external API. Pure frontend. Storage is ephemeral per-browser (IndexedDB). SM-2 spaced repetition capped at 365 days per card. Drag threshold for swipe cards: ±80px (lower = too sensitive, higher = hard to trigger on mobile).

## What Worked Well

- Dexie eliminates boilerplate—`useLiveQuery` just works
- Framer Motion swipe gestures feel native
- Recharts v3 stacked bar saved hours vs custom chart
- Bottom nav hidden on desktop (Tailwind breakpoint) = no duplication

## Bundle Metrics

- JS gzipped: 255 KB
- Build time: ~2s
- TypeScript errors: 0

## Lessons for Next Time

- Document Tailwind v4 limitations upfront (3D transforms, some CSS features)
- Test bulk DB operations with realistic data sizes (1000+) during dev
- Verify Framer Motion drag thresholds on real mobile, not just browser
- IndexedDB persistence is **per-origin**—different domains = different stores

## Technical Stack

Vite 5 + React 18 + TypeScript + Tailwind CSS v4 + Dexie.js + Framer Motion + Recharts + React Router v6 + lucide-react
