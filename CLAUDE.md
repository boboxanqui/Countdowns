# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` / `ng serve` — run the dev server at http://localhost:4200/ (uses `development` config by default)
- `npm run build` / `ng build` — production build, output to `dist/2022.08-countdowns`
- `npm run watch` — incremental dev build with `--watch`
- `npm test` / `ng test` — run unit tests via Karma/Jasmine
  - Run a single spec file: `ng test --include='**/countdown.service.spec.ts'`
- `ng generate component component-name` — scaffold a component (style: scss by default per `angular.json`)

## Architecture

This is an Angular 13 app (strict mode) backed by Firebase (Auth + Firestore) for countdown timers, using `@angular/fire`, Angular Material, and `@ngx-translate` for i18n (default language `es`, translations in `src/assets/i18n/{en,es}.json`).

### Data flow & state

- `CountdownService` (`src/app/service/countdown.service.ts`) holds the in-memory source of truth `_countdowns: Countdown[]` and mirrors writes to Firestore at `userUID/{UID}/countdowns/{id}`. `setCountdowns()` does a diffed merge (comparing JSON minus the ephemeral `timeLeft` field) so Firestore snapshot updates don't blow away locally-ticking countdown state.
- `AuthService` (`src/app/service/auth.service.ts`) wraps Firebase Auth (email/password, Google, GitHub), exposes `userData` (a `UserData` snapshot) and `activeUser$` (a `Subject<boolean>`) for login state.
- `AppComponent` (`src/app/app.component.ts`) is the orchestrator: it subscribes to `onAuthStateChanged`, maps Firestore `CountdownFirestore` docs (with Firestore `Timestamp`-like `{seconds, nanoseconds}` dates) into app-level `Countdown` objects (plain `Date`s), and runs the central 1-second `setInterval` timer that updates every countdown's `timeLeft` and triggers confetti when a countdown hits zero.
- Two `Countdown`-shaped interfaces exist in `src/app/interfaces.ts`: `Countdown` (app-side, `Date` fields, has transient `timeLeft`) and `CountdownFirestore` (wire format, dates as `CreationDateClass {seconds, nanoseconds}`). Conversion between them happens in `AppComponent.ngOnInit`.
- A countdown is considered "active" when `!closed && !removed`; `AppComponent.countdowns` and the Firestore subscription both filter on this.

### Confetti

`CanvasConfettiService` (`src/app/service/canvas-confetti.service.ts`) wraps `canvas-confetti`. `confetti(id, duration)` bursts from a specific `card-{id}` element's bounding box; `sidesConfetti(duration)` fires from both screen edges (used when a countdown's dialog is open). `AppComponent.launchConfetti` decides which to use based on whether `MatDialog.getDialogById('countdown-dialog-id-{id}')` is currently open.

### Components

- `NewCountdownComponent` — creation form dialog, opened from `AppComponent.openNewCountdownForm` (gated: anonymous users can only create one countdown before being prompted to log in via `loginToCreate`)
- `CountdownCardComponent` (`src/app/components/countdown-card/`) — card display for a single countdown, rendered with element id `card-{id}`
- `CountdownDialogComponent` — detail dialog for a countdown, given DOM id `countdown-dialog-id-{id}`
- `AuthDialogComponent` — login/register dialog (email/password + OAuth)
- `NavbarComponent` (in `SharedModule`) — theme toggle and language switch
- `DatePipe` (`src/app/pipe/date.pipe.ts`) — custom date formatting pipe, declared at the app module level

### Theming & i18n

Light/dark theme is applied as a body class (`light-theme`/`dark-theme`) via `Renderer2` and persisted to `localStorage` under `darkMode`. Locale data for `es` is registered globally in `app.module.ts`.

### Firebase

Firebase project config lives in `src/environments/environment.ts` (dev) / `environment.prod.ts` (prod), swapped via `fileReplacements` in `angular.json`. Firestore security rules are in `firestore.rules` (note: currently a permissive open-access rule with an expiry date — check this before relying on it).
