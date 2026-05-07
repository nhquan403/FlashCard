# Mobile UX Redesign: Touch Targets, Responsive Cards, Sheet Modals

**Date**: 2026-05-07 14:32
**Severity**: Medium
**Component**: Mobile UI (Vite + React 18 + Tailwind v4)
**Status**: Resolved

## What Happened

Completed 4-phase mobile UX overhaul targeting touch usability, responsive typography, and modal abstraction on flashcard study app.

## The Brutal Truth

Touch targets were atrocious—44px minimum hit zones required some weird negative margin padding (`p-2 -m-1`) that felt hacky until I realized that's the standard workaround. Viewport height was broken everywhere (`100vh` on mobile includes address bar). The real win was killing 60+ lines of duplicate modal boilerplate by extracting `ResponsiveSheet`—should have done that first pass instead of copy-pasting.

## Technical Details

**Phase 1—Touch & Layout**: Icon buttons `p-2 -m-1` for 44px zones. All `100vh` → `100dvh`. Modal overflow: `max-h-[calc(100dvh-2rem)] overflow-y-auto`. Responsive padding `px-4 sm:px-6`.

**Phase 2—Flashcard Study**: FlipCard height `clamp(220px,50vw+80px,340px)`. Swipe threshold now `innerWidth * 0.25` (was hardcoded 80px). Added `useReducedMotion()` for fade animation fallback. Haptic: `navigator.vibrate(10)` with feature check. Tailwind v4 arbitrary values: `[perspective:1000px]` instead of inline.

**Phase 3—Sheet Modal Abstraction**: New `ResponsiveSheet` component detects viewport—mobile `< 640px` slides bottom sheet, desktop shows centered dialog. Body scroll lock on mount. Safe area inset for notch: `pb-[env(safe-area-inset-bottom,0px)]`. Killed 4 redundant modal implementations.

**Phase 4—Polish**: Folder cards gradient + `border border-white/5` + `shadow-lg shadow-black/20`. Bottom nav `backdrop-blur-md` glassmorphism. Recharts Legend hidden, dark tooltip, YAxis off mobile.

## What We Tried

Initially tried `overflow: hidden` on html—broke scroll restoration. Switched to body only. Debounced swipe events—unnecessary, threshold-based filtering enough.

## Root Cause Analysis

Viewport height bug existed because no one tested on actual phones (simulator shows address bar state incorrectly). Modal duplication because each modal was copy-pasted from the previous one—pattern went unnoticed until third instance.

## Lessons Learned

- Touch targets demand negative margins—accept it, don't fight it
- `100dvh` > `100vh` on mobile, always
- Extract UI patterns at first repetition, not third
- Responsive swipe thresholds > magic numbers
- `useReducedMotion` is mandatory, not nice-to-have

## Next Steps

Monitor real device metrics post-deploy. Test on iPhone 12 mini (smallest current device). Consider SafeAreaView wrapper for Edge-to-edge layouts if needed.

**Build**: 254 KB gzip, 0 TS errors.
