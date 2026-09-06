# MYTHOS UI SYSTEM — CANON DESIGN DOCTRINE v1

*Directive from BudE404, Sept 6 2026. The UI is not placed on top of the game — it is part of the world itself. The player interacts with an ancient mythic system that has been awakened for them.*

## I. INFORMATION HIERARCHY
- Descriptions, tooltips, detailed numbers, and secondary information live ON DEMAND — never on the face of the screen.
- **Tertiary information must never visually compete with the primary experience.**
- Pattern: card face carries the primary (name / epithet / role). **Hold** the card to reveal the numbers (hold-to-reveal tooltip, `.m-tip`).

## II. ARTWORK INTEGRATION
- Artwork is a fundamental part of the UI, not decoration: full-screen backgrounds, character cutouts, environmental scenes, layered illustrations, portraits, relic illustrations, elemental effects, atmospheric animation.
- **Reuse existing canon art wherever appropriate.** New art, when required, must match the project's established visual style and existing assets — it may never visually clash with the game.
- Pattern: `.m-art` full-screen canon backdrop + `.m-art-veil` radial veil so art never competes with foreground; slow parallax (`.m-root` `MUI.parallax`) makes the world breathe.

## III. MATERIAL & EFFECT LANGUAGE
- Restrained material system: dark refined surfaces · ancient metal · carved or engraved details · subtle stone/mineral elements · glass-like magical surfaces where appropriate · energy accents · soft glow · embossed symbols.
- **Elemental/divine effects are interactive feedback and emphasis — not decoration everywhere.**
- Buttons feel physical and responsive: pressed states push into the stone (`.m-btn.pressed`), soft stone-tick sound, haptic pulse.
- Important actions get subtle animation, glow, sound, tactile feedback (`.m-btn-primary`).
- Chamfered megalithic corners (`.m-chamfer` cuts) — never rounded plastic.

## IV. ANIMATION
- Cinematic but restrained motion: panels unfolding (`.m-unfold`), relic symbols illuminating (`.m-illum`), energy flowing through borders, artwork drifting with parallax, buttons reacting to touch, characters subtly animating behind menus, smooth screen transitions, dramatic transitions for major discoveries.
- **No excessive bouncing, spinning, or arcade-style UI animation.**
- Respect `prefers-reduced-motion`.

## V. MOBILE UX — TOUCH-FIRST
- Large touch targets (buttons ≥54px, cards ≥64px) · thumb-friendly controls · clear hierarchy · minimal text clutter · fast navigation · one-handed usability where practical · clear confirmation states · strong visual feedback · readability on small screens.
- Looks complex and premium; operates simply.

## VI. REUSABLE DESIGN SYSTEM
- The system files are `docs/ui/mythos-ui.css` (tokens + components) and `docs/ui/mythos-ui.js` (behaviors: tactile press + WebAudio stone/flame sounds, hold-reveal tooltips, parallax, unfold, chime).
- **Every future screen, character, faction, location, game mode, cinematic, and feature is built from these components so the visual identity never breaks.** New work pulls from the token set (`--m-*`), the component classes (`.m-*`), and the `MUI.*` behaviors.
- To add a screen: `.m-root` container + `.m-art` backdrop + `.m-panel` panels + `.m-btn`/`.m-card` controls + `data-tip` for tertiary numbers + `MUI.sweep()` after render.

*Applied to: menu shell v2 (docs/index.html). Retrofits of codex, gallery, and battle HUDs inherit from this system.*
