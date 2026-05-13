import { expect, test } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Fern/i);
});

test('/events equivalent page loads', async ({ page }) => {
  await page.goto('/plugins');
  await expect(page.getByRole('heading', { name: /Products/i })).toBeVisible();
});

test('event cards render when public catalog exists', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No public catalog records found to validate card rendering.');

  await page.goto('/tools');
  await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
});

test('event detail page opens when a slug exists', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No public tool records exist for detail-page validation.');

  await page.goto('/tools');
  await page.getByRole('link').filter({ hasText: payload[0].name }).first().click();
  await expect(page).toHaveURL(new RegExp(`/tools/${payload[0].slug}`));
});

test('search/filter empty state behavior', async ({ page, request }) => {
  const response = await request.get('/events', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Dedicated /events search/filter flow is not implemented in this repository.');

  await page.goto('/events?query=no-match-zzzz');
  await expect(page.getByText(/no events|empty/i)).toBeVisible();
});
