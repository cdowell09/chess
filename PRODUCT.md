# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Children ages 3–7 are the primary users. They usually play on a shared family tablet with little or occasional adult help. In friend mode, two children share one device and take turns on the same board.

## Product Purpose

Kids Chess helps a young child start, understand, and finish a complete chess game without unnecessary setup or distractions. Success means the child can play independently and enjoyably against an adjustable computer opponent or a nearby friend.

Lessons, puzzles, and online multiplayer are not currently part of the product.

## Positioning

Kids Chess combines a child-first chess interaction model with a forgiving local computer opponent, same-device play, and a trust-preserving experience with no ads, accounts, or tracking. Its tap-tap controls, visible move guidance, easy undo, and offline support are designed to let very young beginners play real chess with minimal adult intervention.

## Operating Context

- Used primarily on family tablets at home or while traveling, including in airplane mode after the app has been opened online once.
- A child chooses either computer or friend mode from the main menu.
- Computer mode adds two setup choices: playing color and one of ten difficulty levels.
- Friend mode goes directly to a shared, pass-and-play board.
- Moves use a tap-piece, tap-destination interaction rather than requiring precise dragging.
- Settings and appearance preferences remain on the device.

## Capabilities and Constraints

- Play a complete legal chess game against a local computer opponent or a friend sharing the device.
- Ten computer difficulty levels range from highly forgiving and mostly random to a stronger evaluation-based opponent.
- Choose White or Black in computer mode; the board follows the player's orientation.
- Show legal destinations, selected and recent moves, threatened pieces, check state, turn state, and game results.
- Undo mistakes, restart the current game, replay with the same settings, or return to the main menu.
- Provide visible and audible feedback for selections, moves, captures, checks, and wins.
- Support light and dark appearance preferences.
- Run as an installable tablet-first web app and support offline use after initial caching.
- Keep current product data local; the existing experience requires no backend.
- Preserve the permanent commitments to no ads, no accounts, no tracking, touch-friendly controls, tap-tap moves, move guidance, undo, encouraging language, and offline support.

The current implementation uses React, Vite, chess.js, react-chessboard, browser audio, local storage, and a service worker. The computer opponent runs locally and does not use Stockfish despite the historical hook filename.

## Brand Commitments

- Product name: **Kids Chess**.
- Core trust promise: **No Ads. Just Chess.**
- Voice is short, direct, encouraging, and non-punitive, especially after mistakes or losses.
- The experience should support independent play without sounding instructional, competitive, or patronizing.

## Evidence on Hand

- Product overview and operating instructions: `README.md`
- Primary workflow and navigation: `src/App.jsx`
- Mode selection and product copy: `src/components/StartScreen.jsx`
- Color and difficulty setup: `src/components/GameSetup.jsx`
- Board interaction and feedback: `src/components/ChessGame.jsx`
- End-game messaging: `src/components/GameOverModal.jsx`
- Local computer behavior: `src/hooks/useStockfish.js`
- Offline behavior and install metadata: `public/sw.js` and `public/manifest.webmanifest`
- Existing app icon: `public/icons/icon.svg`

There are no confirmed testimonials, usage metrics, learning-outcome studies, customer logos, awards, or benchmark claims. Future work must not fabricate them.

## Product Principles

1. **Start playing quickly.** Keep choices limited and make the route from opening the app to the first move obvious.
2. **Guide through interaction.** Use legal moves, threatened-piece cues, turn states, and immediate feedback instead of requiring lessons or dense instructions.
3. **Make mistakes inexpensive.** Preserve undo, easy restarts, and supportive outcomes so experimentation feels safe.
4. **Earn family trust.** Keep the experience ad-free, account-free, tracking-free, local-first, and usable offline.
5. **Design for young hands and shared tablets.** Favor large targets, tap-tap actions, simple language, and straightforward pass-and-play behavior.

## Accessibility & Inclusion

The product must accommodate young children who may have limited reading ability, developing motor precision, or little familiarity with chess interfaces. Controls should remain large and touch-friendly; core actions should not depend on dragging; labels and status messages should stay short and concrete; and game state should remain visible rather than relying only on sound.

A formal accessibility conformance target and the required scope of keyboard and screen-reader support remain open decisions. No WCAG conformance claim has been established.
