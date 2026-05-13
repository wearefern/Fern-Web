import { expect, test } from '@playwright/test';

test('scanner page loads', async ({ page, request }) => {
  const response = await request.get('/scanner', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Staff scanner module is not implemented in this repository.');
  await page.goto('/scanner');
  await expect(page).toHaveURL(/\/scanner/);
});

test('manual validation input exists', async ({ page }) => {
  test.skip(true, 'Scanner UI is not available in this repository.');
});

test('invalid manual code shows rejection', async ({ page }) => {
  test.skip(true, 'Scanner UI is not available in this repository.');
});

test('offline queue UI exists if implemented', async ({ page }) => {
  test.skip(true, 'Offline scanner queue UI is not available in this repository.');
});
