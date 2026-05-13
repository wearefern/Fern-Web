# Playwright Execution Guide

## Start the app
1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. App should be available at `http://localhost:3000`

## Run Playwright tests
- Headless run: `pnpm test:e2e`
- Headed run: `pnpm test:e2e:headed`
- UI mode: `pnpm test:e2e:ui`

## Open HTML report
1. Run tests first.
2. Open report: `pnpm test:e2e:report`

## Artifacts location
- HTML report: `playwright-report/`
- Screenshots on failure: `test-results/**`
- Trace files on retry: `test-results/**`
- Videos on failure: `test-results/**`

## Credentials for authenticated suites
- User auth tests use:
  - `E2E_USER_EMAIL`
  - `E2E_USER_PASSWORD`
- Admin auth tests use:
  - `E2E_ADMIN_EMAIL`
  - `E2E_ADMIN_PASSWORD`

If credentials are not set, those tests are skipped and reported as skipped.

## Copy actual results into manual QA Google Doc
1. Run `pnpm test:e2e`.
2. Open `playwright-report/` and capture pass/fail/skip counts.
3. For failed tests, open failure screenshot and trace from `test-results/`.
4. In the Google Doc, paste:
   - Test name
   - Status (`Passed`, `Failed`, `Skipped`)
   - Evidence path (screenshot/trace)
   - Notes on route/data prerequisites (for skipped scenarios)
