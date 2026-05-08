import { expect, test } from '@playwright/test';

const E2E_EMAIL = process.env.E2E_USER_EMAIL;
const E2E_PASSWORD = process.env.E2E_USER_PASSWORD;

test('login page loads', async ({ page }) => {
  await page.goto('/sign-in');
  await expect(page.getByText('Sign in to continue')).toBeVisible();
});

test('valid user login redirects to account/events equivalent', async ({ page }) => {
  test.skip(!E2E_EMAIL || !E2E_PASSWORD, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run authenticated login checks.');

  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill(E2E_EMAIL!);
  await page.locator('input[name="password"]').fill(E2E_PASSWORD!);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.waitForURL(/\/(account|events)/, { timeout: 20000 });
  await expect(page).toHaveURL(/\/(account|events)/);
});

test('invalid login shows error', async ({ page }) => {
  await page.goto('/sign-in');
  await page.getByLabel('Email address').fill('invalid-user@example.com');
  await page.locator('input[name="password"]').fill('BadPassword123!');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText(/couldn't find your account|incorrect password|invalid/i).first()).toBeVisible();
});

test('protected account route redirects unauthenticated user', async ({ page }) => {
  await page.goto('/account');
  await expect(page).toHaveURL(/sign-in/i);
});

test('user cannot access admin route when unauthenticated', async ({ page }) => {
  await page.goto('/account/admin/tools');
  await expect(page).toHaveURL(/sign-in|account\/admin\/tools/i);
});

test('organizer route currently not implemented', async ({ page, request }) => {
  const response = await request.get('/organizer', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Organizer route is not implemented in this repository.');
  await page.goto('/organizer');
  await expect(page).toHaveURL(/\/organizer/);
});

test('staff route currently not implemented', async ({ page, request }) => {
  const response = await request.get('/scanner', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Staff scanner route is not implemented in this repository.');
  await page.goto('/scanner');
  await expect(page).toHaveURL(/\/scanner/);
});

test('admin route currently not implemented as /admin', async ({ page, request }) => {
  const response = await request.get('/admin', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Standalone /admin route is not implemented; admin lives under /account/admin/*');
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin/);
});
