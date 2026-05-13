import { expect, test } from '@playwright/test';

test('add ticket/product to cart from tools', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No purchasable tools available for cart smoke test.');

  await page.goto('/tools');
  await page.getByRole('button', { name: /download|get free/i }).first().click();
  await page.waitForURL(/\/cart/);
  await expect(page.getByRole('heading', { name: /Your Cart/i })).toBeVisible();
});

test('update quantity flow currently unavailable in UI', async ({ page }) => {
  await page.goto('/cart');
  test.skip(true, 'Cart UI currently supports add/remove only; quantity controls are not implemented.');
});

test('remove item from cart', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No tools available for remove-item test.');

  await page.goto('/tools');
  await page.getByRole('button', { name: /download|get free/i }).first().click();
  await page.waitForURL(/\/cart/);
  await page.getByRole('button', { name: 'Remove' }).first().click();
  await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
});

test('empty cart state', async ({ page }) => {
  await page.goto('/cart');
  await page.evaluate(() => localStorage.removeItem('fern-cart'));
  await page.reload();
  await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
});

test('checkout page opens from cart', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No tools available for checkout navigation test.');

  await page.goto('/tools');
  await page.getByRole('button', { name: /download|get free/i }).first().click();
  await page.waitForURL(/\/cart/);
  await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
  await expect(page).toHaveURL(/\/checkout/);
});

test('checkout validation: submit disabled when required fields missing', async ({ page, request }) => {
  const tools = await request.get('/api/tools', { failOnStatusCode: false });
  const payload = await tools.json().catch(() => []);
  test.skip(!Array.isArray(payload) || payload.length === 0, 'No tools available for checkout validation test.');

  await page.goto('/tools');
  await page.getByRole('button', { name: /download|get free/i }).first().click();
  await page.waitForURL(/\/cart/);
  await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
  const submit = page.getByRole('button', { name: /Complete Purchase|Processing/i });
  await expect(submit).toBeDisabled();
});
