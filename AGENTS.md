# AGENTS.md

## Fast Start (verified)

- Use `npm` (repo has `package-lock.json` and husky hooks call `npm run ...`).
- Core scripts: `npm run dev`, `npm run build`, `npm run type-check`, `npm run test:run`, `npm run test:coverage`, `npm run lint`.
- For a focused test: `npx vitest run path/to/file.test.ts` (or `npx vitest run -t "test name"`).

## Commit/Push Gates You Must Preempt

- Pre-commit runs, in order: `lint-staged` -> `tsc --noEmit` -> `stylelint "src/**/*.{vue,css,scss}"` -> `node scripts/check-test-coverage.mjs`.
- Pre-push runs: `npm run type-check` then `npm run test:run`.
- Commit messages are linted by commitlint (`@commitlint/config-conventional`): lowercase subject, no trailing period, header <= 100, kebab-case scope.

## Test-Coverage Hook Quirk (easy to miss)

- `scripts/check-test-coverage.mjs` fails commit if a staged `src/**/*.ts|vue` file has no companion test.
- Accepted companion files: `<dir>/__tests__/<Name>.test.ts`, `<dir>/__tests__/<Name>.spec.ts`, `<dir>/<Name>.test.ts`, `<dir>/<Name>.spec.ts`.
- Excluded from this rule include: `src/views/**`, `src/router/**`, `src/stores/**`, `src/base/**`, `src/locales/**`, `index.ts`, `*.d.ts`, assets/styles/icons.

## Architecture That Drives Safe Changes

- App entry: `src/main.ts`; router entry: `src/router/index.ts`; routed pages are thin wrappers in `src/views/**` that mount module presentation components.
- Feature modules live in `src/modules/**` and should keep data flow layered: presentation -> repository -> api service (`core/`, `data/`, `presentation/`; some modules also have `domain/` + `useCase/`).
- Reuse the singleton pattern used across controllers/repositories/api services (`getInstance()`), not ad-hoc new instances.
- Keep API/network logic out of Vue components; place it in module `data/` layer.

## i18n + Styling Constraints From Repo Rules

- User-facing strings should go through i18n and be added to both `src/locales/en.json` and `src/locales/ar.json`.
- Stylelint warns on literal color values (`#`, `rgb`, `hsl`) in many properties; prefer variables/tokens to avoid noisy lint failures.

## Source-of-Truth Warnings

- Module README files and some `index.ts` headers are stale copy-paste ("employee-email"); trust executable code/routes over those docs.
- `src/main.ts` imports `src/styles/main.min.css` (not `main.scss`), so verify global style edits against what is actually imported.
- Env selection comes from `VITE_APP_ENV`; current `.env`, `.env.production`, and `.env.development` all set `VITE_APP_ENV=production`.

## Agent Skills

- `code-review`: deep review of staged changes (security, architecture, maintainability).
- `feature-implementation`: build new module features while preserving layered architecture.
- `bug-investigation`: reproduce, isolate root cause, and ship minimal-risk fixes with regression tests.
- `release-readiness`: run pre-merge quality gates and report pass/fail status.

## Agent Rules

- Always preserve module layering (`presentation -> data/repository -> api service`) and existing singleton conventions.
- Never place network logic inside Vue components.
- Ensure every user-visible string is localized in `src/locales/en.json` and `src/locales/ar.json`.
- Prefer style tokens/variables over literal colors to avoid stylelint violations.
- For staged `src/**/*.ts|vue` changes, ensure companion tests exist unless the file is excluded by the coverage script.

## Agent Commands

- `feature`: implement features with architecture, i18n, tests, and type-check validation.
- `fix`: debug issues, apply minimal patch, and add regression coverage.
- `ship-check`: run lint/type/test and hook-aligned pre-merge checks.
