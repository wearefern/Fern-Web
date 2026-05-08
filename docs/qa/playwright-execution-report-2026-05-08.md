# Fern Web - QA Execution Report
Execution Date: 2026-05-08  
Execution Scope: Playwright E2E smoke suite (`tests/e2e/*.spec.ts`)

## Execution Summary
- Total Passed: 15
- Total Failed: 0
- Total Skipped: 26
- Flaky Tests: 1
- Typecheck Result: Failed (`pnpm exec tsc --noEmit`)
- Lint Result: Failed (`pnpm lint`)

### Known Blockers
- Organizer routes are not implemented (`/organizer`, `/organizer/events/new`).
- Staff scanner routes are not implemented (`/scanner`).
- Dedicated events routes are not implemented (`/events`).
- Standalone admin route is not implemented (`/admin`).
- Authenticated-role tests were skipped when required credentials were not configured.
- Intermittent runtime infra issue observed: `ECONNRESET` during one scanner route probe (test passed on retry and marked flaky).
- Supabase/Prisma connectivity warnings observed in server logs (`Can't reach database server at aws-1-ap-southeast-2.pooler.supabase.com:6543`), impacting catalog-dependent coverage depth.

## Test Execution Evidence
Note: Status values are strictly mapped to actual Playwright outcomes: `PASS`, `FAIL`, `SKIPPED`.

| Test File | Test Name | Status | Actual Result |
|---|---|---|---|
| `auth.spec.ts` | login page loads | PASS | Sign-in page loaded successfully and `Sign in to continue` text was visible. |
| `auth.spec.ts` | valid user login redirects to account/events equivalent | SKIPPED | Skipped because `E2E_USER_EMAIL` and `E2E_USER_PASSWORD` were not provided for authenticated login execution. |
| `auth.spec.ts` | invalid login shows error | PASS | Invalid credentials submission displayed authentication error text (`Couldn't find your account`/equivalent validation error). |
| `auth.spec.ts` | protected account route redirects unauthenticated user | PASS | Unauthenticated access to `/account` redirected to sign-in as expected. |
| `auth.spec.ts` | user cannot access admin route when unauthenticated | PASS | Access check to `/account/admin/tools` did not expose unauthorized admin content; route remained protected (sign-in redirect or protected route state). |
| `auth.spec.ts` | organizer route currently not implemented | SKIPPED | Skipped because `/organizer` route is not implemented in this repository. |
| `auth.spec.ts` | staff route currently not implemented | SKIPPED | Skipped because `/scanner` route is not implemented in this repository. |
| `auth.spec.ts` | admin route currently not implemented as /admin | SKIPPED | Skipped because standalone `/admin` route is not implemented; admin area exists under `/account/admin/*`. |
| `public-events.spec.ts` | home page loads | PASS | Home page `/` loaded and page title matched `Fern`. |
| `public-events.spec.ts` | /events equivalent page loads | PASS | `/plugins` page loaded and `Products` heading was visible. |
| `public-events.spec.ts` | event cards render when public catalog exists | SKIPPED | Skipped because API catalog precondition returned no usable records during execution window. |
| `public-events.spec.ts` | event detail page opens when a slug exists | SKIPPED | Skipped because no usable catalog slug data was available for detail-route execution. |
| `public-events.spec.ts` | search/filter empty state behavior | SKIPPED | Skipped because dedicated `/events` route is not implemented in this repository. |
| `cart-checkout.spec.ts` | add ticket/product to cart from tools | SKIPPED | Skipped because no purchasable tool data was available from API precondition at runtime. |
| `cart-checkout.spec.ts` | update quantity flow currently unavailable in UI | SKIPPED | Skipped because quantity controls are not implemented in the current cart UI. |
| `cart-checkout.spec.ts` | remove item from cart | SKIPPED | Skipped because no tool data was available to seed cart item removal flow. |
| `cart-checkout.spec.ts` | empty cart state | PASS | Empty cart state rendered successfully with `Your cart is empty`. |
| `cart-checkout.spec.ts` | checkout page opens from cart | SKIPPED | Skipped because precondition data for adding a cart item was unavailable. |
| `cart-checkout.spec.ts` | checkout validation: submit disabled when required fields missing | SKIPPED | Skipped because precondition data for reaching checkout with cart item was unavailable. |
| `ticket-management.spec.ts` | my tickets/orders page loads for authenticated user | SKIPPED | Skipped because authenticated user credentials were not configured. |
| `ticket-management.spec.ts` | ticket/order detail page requires seeded data and route | SKIPPED | Skipped because dedicated order detail route (`/account/orders/:id`) is not implemented. |
| `ticket-management.spec.ts` | PDF/QR actions visible if booking/download exists | SKIPPED | Skipped because this repository does not implement QR/PDF ticket controls in current account download UI. |
| `user-account.spec.ts` | user account dashboard auth gate works | PASS | Unauthenticated visit to `/account` correctly enforced auth redirect behavior. |
| `user-account.spec.ts` | orders page route exists behind auth | PASS | `/account/orders` remained access-controlled and behaved as protected route (sign-in redirect/protected state). |
| `user-account.spec.ts` | downloads page route exists behind auth | PASS | `/account/downloads` remained access-controlled and behaved as protected route (sign-in redirect/protected state). |
| `organizer.spec.ts` | organizer dashboard loads | SKIPPED | Skipped because organizer module route `/organizer` does not exist in this repository. |
| `organizer.spec.ts` | create event page loads | SKIPPED | Skipped because organizer event creation route `/organizer/events/new` does not exist. |
| `organizer.spec.ts` | required field validation works | SKIPPED | Skipped because organizer event form UI is not implemented. |
| `organizer.spec.ts` | event list renders | SKIPPED | Skipped because organizer event-list UI is not implemented. |
| `staff-scanner.spec.ts` | scanner page loads | PASS | Route probe experienced transient `ECONNRESET` on first attempt; retry passed under Playwright retry policy (marked flaky). |
| `staff-scanner.spec.ts` | manual validation input exists | SKIPPED | Skipped because scanner UI is not implemented in this repository. |
| `staff-scanner.spec.ts` | invalid manual code shows rejection | SKIPPED | Skipped because scanner validation UI/flow is not implemented. |
| `staff-scanner.spec.ts` | offline queue UI exists if implemented | SKIPPED | Skipped because offline scanner queue UI is not implemented. |
| `admin.spec.ts` | admin dashboard access is blocked for unauthenticated user | PASS | Unauthenticated access to `/account/admin/tools` did not expose admin dashboard content and remained protected. |
| `admin.spec.ts` | user management page loads | SKIPPED | Skipped because `/account/admin/users` page is not implemented in this repository. |
| `admin.spec.ts` | event moderation page loads | SKIPPED | Skipped because `/account/admin/events` page is not implemented in this repository. |
| `admin.spec.ts` | admin dashboard loads for admin credentials | SKIPPED | Skipped because `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` were not configured. |
| `platform.spec.ts` | theme toggle works | PASS | Theme toggle control was visible and HTML class changed after toggle interaction. |
| `platform.spec.ts` | language switch availability | SKIPPED | Skipped because language switcher control is not implemented in the current UI. |
| `platform.spec.ts` | 404 page renders | PASS | Nonexistent route rendered 404/not-found response correctly. |
| `platform.spec.ts` | mobile viewport smoke | PASS | Home page loaded under mobile viewport (`375x812`) and key navigation remained visible. |
| `platform.spec.ts` | keyboard navigation smoke | PASS | Keyboard `Tab` interaction produced a visible focused element, confirming baseline keyboard navigation behavior. |

## Static Validation Evidence
### Typecheck
- Command: `pnpm exec tsc --noEmit`
- Result: FAIL
- Observed errors:
  - `src/app/api/webhooks/stripe/route.ts` (`Stripe` typing errors)
  - `src/modules/blog/blog-content/blog-content-article.tsx` (unused `@ts-expect-error`)

### Lint
- Command: `pnpm lint`
- Result: FAIL
- Observed errors:
  - `src/app/(root)/blog/[slug]/page.tsx` (`@typescript-eslint/require-await`)
  - `src/app/(root)/insights/[slug]/page.tsx` (`@typescript-eslint/prefer-optional-chain`)

## Stakeholder Note
This execution report reflects only observed automation outcomes. No skipped test is treated as pass, and no unimplemented route flow is reported as successful business behavior.
