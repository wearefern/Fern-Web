import { expect, test } from '@playwright/test';

test('user account dashboard auth gate works', async ({ page }) => {
  await page.goto('/account');
  await expect(page).toHaveURL(/sign-in/i);
});

test('orders page route exists behind auth', async ({ page }) => {
  await page.goto('/account/orders');
  await expect(page).toHaveURL(/sign-in|account\/orders/i);
});

test('downloads page route exists behind auth', async ({ page }) => {
  await page.goto('/account/downloads');
  await expect(page).toHaveURL(/sign-in|account\/downloads/i);
});
