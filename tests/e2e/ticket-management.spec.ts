import { expect, test } from '@playwright/test';

const authMissing = !process.env.E2E_USER_EMAIL || !process.env.E2E_USER_PASSWORD;

test('my tickets/orders page loads for authenticated user', async ({ page }) => {
  test.skip(authMissing, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD for account tests.');
  await page.goto('/account/orders');
  await expect(page.getByRole('heading', { name: /Your Orders/i })).toBeVisible();
});

test('ticket/order detail page requires seeded data and route', async ({ page, request }) => {
  test.skip(true, 'No dedicated order detail route (/account/orders/:id) is implemented in this repository.');
  const response = await request.get('/account/orders/sample', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Order detail route unavailable.');
  await page.goto('/account/orders/sample');
  await expect(page).toHaveURL(/\/account\/orders\//);
});

test('PDF/QR actions visible if booking/download exists', async ({ page }) => {
  test.skip(authMissing, 'Set E2E credentials for download visibility checks.');
  await page.goto('/account/downloads');
  test.skip(true, 'Current app provides download actions but no QR/PDF ticket controls in UI.');
});
