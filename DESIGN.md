---
version: alpha
name: Kids Chess
description: Warm, calm, child-first chess UI with tactile tablet controls and focused moments of play.
colors:
  slate-ink: "#1f2933"
  parchment: "#f7f4ee"
  paper-card: "rgba(255, 255, 255, 0.9)"
  frosted-header: "rgba(247, 244, 238, 0.8)"
  muted-slate: "#5b6775"
  linen-line: "#e0d8cc"
  felt-green: "#2f7c6d"
  takeback-amber: "#d28a54"
  check-red: "#ca5544"
  board-sage: "#8aa091"
  board-ivory: "#f1e9dd"
  warm-cream: "#f7f2e9"
  night-canvas: "#1a1d23"
  night-panel: "rgba(45, 50, 58, 0.9)"
  night-header: "rgba(26, 29, 35, 0.9)"
  night-text: "#e8e6e3"
  night-muted: "#9ca3af"
  night-line: "#3d4654"
  night-mint: "#4ade9a"
  disabled-cloud: "#cbd5e0"
  disabled-slate: "#4a5568"
typography:
  display:
    fontFamily: "ui-serif, 'Times New Roman', serif"
    fontSize: "64px"
    fontWeight: 700
    lineHeight: 1.5
  headline:
    fontFamily: "ui-serif, 'Times New Roman', serif"
    fontSize: "44px"
    fontWeight: 700
    lineHeight: 1.5
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.5
  body-lg:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  control:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  eyebrow:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Trebuchet MS', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.24em"
rounded:
  brand: "12px"
  control: "16px"
  card: "20px"
  frame: "24px"
  dialog: "28px"
  pill: "999px"
spacing:
  micro: "4px"
  xs: "6px"
  sm: "8px"
  compact: "10px"
  md: "12px"
  control-y: "14px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "28px"
  3xl: "32px"
  4xl: "40px"
  5xl: "48px"
  6xl: "56px"
  7xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.slate-ink}"
    textColor: "{colors.parchment}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.pill}"
    padding: "16px 48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  button-undo:
    backgroundColor: "{colors.takeback-amber}"
    textColor: "{colors.warm-cream}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-game:
    backgroundColor: "{colors.slate-ink}"
    textColor: "{colors.warm-cream}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  card-action:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.card}"
    padding: "28px"
  panel:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  difficulty-control:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.felt-green}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    size: "40px"
    height: "40px"
    width: "40px"
  navigation:
    backgroundColor: "{colors.frosted-header}"
    textColor: "{colors.slate-ink}"
    typography: "{typography.label}"
    padding: "20px 48px"
  dialog:
    backgroundColor: "{colors.paper-card}"
    textColor: "{colors.slate-ink}"
    rounded: "{rounded.dialog}"
    padding: "40px"
---

# Design System: Kids Chess

## Overview

**Creative North Star: "The Friendly Chess Club"**

The Friendly Chess Club treats a family tablet like a welcoming game table: warm parchment, slate ink, and restrained felt green create a calm place to play. A traditional serif voice gives chess its sense of occasion, while direct system sans-serif text keeps every choice legible and immediate for young children.

Interfaces are spacious, centered, and softly contained. Large touch targets feel tactile and forgiving without becoming toy-like. The system stays warm, calm, capable, and playful in moments—never babyish. Magic is deliberately concentrated in wins and encouragement so gameplay itself remains focused.

**Key Characteristics:**

- Warm parchment and slate neutrals anchored by restrained felt green.
- Traditional serif display type paired with highly legible system sans-serif controls.
- Rounded, tactile controls and softly layered containers sized for young hands.
- Calm gameplay surfaces with celebratory emoji and motion reserved for rewards.
- Parallel light and dark themes that preserve semantic roles.

## Colors

The palette combines the familiarity of paper and chess felt with quiet semantic colors that explain state without turning the board into an arcade.

### Primary

- **Felt Green** (`felt-green`): The interaction accent for selection, winning states, hover borders, and affirmative emphasis; it should remain scarce enough to carry meaning.
- **Board Sage** (`board-sage`): The darker board square, softened so long games stay visually calm.

### Secondary

- **Takeback Amber** (`takeback-amber`): Reserved for undo and recoverable actions, where warmth communicates that mistakes are safe.

### Tertiary

- **Check Red** (`check-red`): Reserved for threats, check, and other urgent chess state; it is never general decoration.

### Neutral

- **Parchment** (`parchment`): The light-theme canvas and inverse text foundation.
- **Paper Card** (`paper-card`): The translucent surface for cards, setup panels, and the board frame.
- **Slate Ink** (`slate-ink`): Primary text, strong controls, and brand blocks.
- **Muted Slate** (`muted-slate`): Supporting copy, hints, and low-emphasis labels.
- **Linen Line** (`linen-line`): Fine borders and dividers that define containment without visual weight.
- **Board Ivory** (`board-ivory`): The lighter board square and a warm companion to Board Sage.
- **Night Canvas, Panel, Text, Muted, Line, and Mint** (`night-*`): A role-for-role dark-theme translation rather than a separate visual identity.
- **Disabled Cloud and Slate** (`disabled-*`): The unavailable-control pairing.

### Named Rules

**The Calm Field Rule.** Felt Green is an accent, not a wash; the board and surrounding canvas stay quiet enough for chess state to lead.

**The State Color Rule.** Amber means recoverable action and red means chess danger; never reuse either as casual decoration.

**The Theme Parity Rule.** Dark mode changes luminance, not hierarchy, meaning, or component behavior.

## Typography

**Display Font:** UI Serif with Times New Roman fallback

**Body Font:** UI Sans Serif with the system interface stack

**Character:** The serif voice makes titles feel like a real game invitation, while the system sans-serif voice keeps controls familiar, fast, and readable. Neither voice should become ornate.

### Hierarchy

- **Display** (700, fluid 40–64px, 1.5): The start-screen product title only.
- **Headline** (700, fluid 32–44px, 1.5): Setup and major task headings.
- **Title** (600, 22px, 1.5): Mode names and prominent component labels.
- **Body Large** (400, 20px, 1.5): Introductory guidance and short subtitles.
- **Body** (400, 16px, 1.5): Descriptions and supporting instructions.
- **Control** (600, 18px, 1.5): Primary game and dialog actions.
- **Label** (600, 14px, 1.5): Navigation and compact utility labels.
- **Eyebrow** (400, 12px, 0.24em tracking, uppercase): The single trust promise above the start title.

### Named Rules

**The Two-Voice Rule.** Serif type names important moments; sans-serif type operates the product. Do not introduce a third voice.

## Layout

The application uses a centered, single-task spatial model inside a fluid page container (1100px maximum). Desktop page padding expands from 20px to 64px, while primary vertical rhythm uses 16px, 20px, 24px, 28px, 32px, and 40px steps.

The start screen uses an auto-fitting two-card grid with 240px minimum columns and an 840px maximum span. Setup panels stop at 560px. The chess frame remains square, uses the smaller viewport axis (`min(90vw, 90vh)`), and stops at 600px.

At 720px and below, the sticky header stacks and navigation wraps. At 600px and below, game headers and color choices stack, control padding reduces, and the primary setup action expands to full width.

### Named Rules

**The One-Task Center Rule.** Give the active choice or chessboard the visual center; surrounding navigation stays secondary.

**The Tablet-First Rule.** Size and space interactions for young hands, and never require precise dragging to complete a core action.

## Elevation & Depth

Depth is softly layered rather than dramatic. Translucent cards sit on a warm atmospheric canvas, one-pixel linen borders preserve their edges, and ambient shadows distinguish resting surfaces from elevated or interactive states. Hover movement is restrained to 1–4px.

### Shadow Vocabulary

- **Ambient Low** (`0 12px 24px rgba(31, 41, 51, 0.08)`): Resting cards, setup panels, and the board frame.
- **Ambient High** (`0 18px 40px rgba(31, 41, 51, 0.14)`): Primary actions, dialogs, and hovered action cards.
- **Dark Ambient Low** (`0 12px 24px rgba(0, 0, 0, 0.2)`): Dark-theme replacement for Ambient Low.
- **Dark Ambient High** (`0 18px 40px rgba(0, 0, 0, 0.3)`): Dark-theme replacement for Ambient High.
- **Selection Halo** (`0 0 0 3px rgba(47, 124, 109, 0.2)`): The selected color choice.

### Named Rules

**The Soft Lift Rule.** Surfaces rest on borders and low shadow; high shadow and upward movement appear only when hierarchy or interaction earns them.

## Shapes

The form language is consistently generous and rounded. Brand marks use 12px corners, choice controls and the inner board use 16px, cards use 20px, the chess frame uses 24px, and dialogs use 28px. Navigation and action buttons use a full 999px pill. Equal-width difficulty controls are circular.

### Named Rules

**The Rounded Hierarchy Rule.** Radius grows with containment and importance; do not mix sharp rectangles into the established 12–28px family.

## Components

### Buttons

- **Primary:** Slate Ink on Parchment, 16px × 48px padding, 20px type, full pill, and Ambient High shadow; hover lifts 2px.
- **Ghost / Back:** Transparent with a Linen Line border, 10px × 16px padding, and full pill; hover shifts the border toward Felt Green and gains Ambient Low shadow.
- **Game Controls:** 14px × 28px padding and 18px semibold type. New Game uses Slate Ink; Undo uses Takeback Amber.
- **Disabled:** Disabled Cloud with Disabled Slate text and no interactive lift.
- **Focus:** The incumbent system leaves the browser focus outline intact; custom styling must never remove it without an equally visible replacement.

### Selection Controls

- **Color Choices:** 16px rounded tiles, 20px × 28px padding, strong black/white contrast, and a Felt Green selection border with a three-pixel halo.
- **Difficulty Scale:** Ten 40px circles progress from green through amber to red. The chosen level fills with its own color; unchosen levels use that color for the ring and numeral.

### Cards / Containers

- **Action Cards:** Paper Card background, Linen Line border, 20px corners, 28px padding, and Ambient Low shadow; hover lifts 4px and moves to Ambient High.
- **Setup Panels:** 20px corners, 24px padding, 560px maximum width, and Ambient Low shadow.
- **Board Frame:** Paper Card background, Linen Line border, 24px corners, 16px padding, and Ambient Low shadow around the 16px board.

### Navigation

The header is sticky and translucent with a 10px backdrop blur, a Linen Line divider, and 20px × 48px desktop padding. The brand combines a 36px rounded knight block with serif text. Navigation actions are compact pills; the active action gains a card surface and Ambient Low shadow.

### Chessboard

Board Ivory and Board Sage form the quiet base. Selection uses a translucent Felt Green wash, legal destinations use compact dark dots, recent moves use warm gold translucency, and threats use an inset Check Red ring. Check combines color with explicit status text.

### Dialogs

The game-over dialog uses a dark translucent overlay, a 28px Paper Card surface, 40px desktop padding, and Ambient High shadow. Entry uses a 400ms upward fade. The winner state adds a short celebratory scale, a bouncing emoji, and the signature unicorn flyby.

### Named Rules

**The Rewarded Whimsy Rule.** Keep routine gameplay calm; reserve animated emoji, rainbow effects, and larger gestures for wins and encouragement.

## Do's and Don'ts

### Do:

- Do use large, unmistakable targets and preserve tap-tap interaction.
- Do let Parchment, Slate Ink, and Paper Card carry most of every screen.
- Do reserve Felt Green for meaningful interaction and positive emphasis.
- Do preserve the same semantic color roles in light and dark themes.
- Do use low shadow at rest and high shadow only for priority or response.
- Do keep routine transitions between 150ms and 300ms, with longer motion reserved for dialogs and celebrations.

### Don't:

- Don't turn the product into a neon arcade, preschool toy, or corporate dashboard.
- Don't flood screens with primary colors or distribute whimsical decoration across routine gameplay.
- Don't repurpose Takeback Amber or Check Red as decorative accents.
- Don't add sharp-cornered cards or a third type family.
- Don't use heavy shadows or large movement on every control.
- Don't rely on animation, sound, or color alone to communicate game state.
