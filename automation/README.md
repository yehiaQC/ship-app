# ShipTest: Automated Tests

Playwright + TypeScript UI and API tests using the Page Object Model.

## What is covered
**E2E-001 Happy path** (`tests/ui/happy-path.spec.ts`, tagged `@smoke`):

1. Log in with valid credentials (seeded KSA user) and check the sender card is pre-filled.
2. Create a shipment: receiver in the UAE (IntraGulf), a 2 kg package, the Gulf Standard service, price > 0; save it as a draft. The draft shows in the list.
3. Finalize it from the row's actions menu: the status becomes Finalized and a tracking number appears.

The test cleans up after itself by deleting only the shipment it created.

The full scenario list and status are in [docs/test-scenarios.md](docs/test-scenarios.md).

## Project structure
```
.
├── playwright.config.ts   # base URL, browsers, reporters, projects (ui / api)
├── src/
│   ├── pages/             # Page Objects: locators + user actions per page
│   ├── api/               # ApiClient used by API tests and for test-data setup
│   ├── fixtures/          # custom `test` that injects page objects and the API client
│   └── data/              # test data builders
├── tests/
│   ├── ui/                # browser tests (happy path first, then the rest)
│   └── api/               # REST API tests
├── docs/test-scenarios.md # scenario inventory + known bugs

```

## Setup
Requirements: Node.js 20+ and VS Code with the **Playwright Test for VS Code** extension (recommended automatically when you open the folder).

```bash
npm install
npx playwright install chromium
cp .env.example .env    # then set E2E_USER_PASSWORD (seeded password, see ../README.md "Logging in")
```

The app under test is started automatically by Playwright (`npm --prefix .. run dev`, if it is not already running on port 3000, see `webServer` in playwright.config.ts).

## Running the tests
| Command | What it does |
|---|---|
| `npm test` | Run everything (UI + API) headless |
| `npm run test:smoke` | Only the happy-path tests tagged `@smoke` |
| `npm run test:ui` / `npm run test:api` | Only UI / only API tests |
| `npm run test:headed` | Watch the browser while UI tests run |
| `npm run test:ui-mode` | Playwright UI mode: pick, watch, time-travel debug |
| `npx playwright test tests/ui/happy-path.spec.ts` | Run one file |
| `npx playwright test -g "finalizes"` | Run tests whose title matches |
| `npm run report` | Open the HTML report of the last run |

In VS Code: open the **Testing** sidebar (flask icon) to run or debug any test with one click, set breakpoints, and use **Pick locator**.

## Reports
After a run, `playwright-report/index.html` holds the HTML report. Failed tests include a screenshot, video and trace (open the trace with one click from the report).
A JUnit file is written to `test-results/junit.xml` for CI tools.

## Known application bugs
Tests that found real bugs are kept and marked with `test.fail(...)` and a `bug` annotation, so the suite stays green while the bug exists. When the bug is fixed, the test will report "expected to fail but passed" — remove the `test.fail` line then.

None found in the happy path. Open defects from the manual QA cycle (BUG-001..007) are outside this flow.

## CI
The workflow `../.github/workflows/e2e.yml` (repo root) installs and seeds the app, then runs this suite on pushes to `main` / `ship-app-home-branch` and on pull requests. It uploads the HTML report as an artifact. Add the repository secret `E2E_USER_PASSWORD` (GitHub > Settings > Secrets and variables > Actions).
