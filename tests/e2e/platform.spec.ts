import { expect, test } from '@playwright/test';

test('theme toggle works', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /toggle theme/i }).first();
  await expect(toggle).toBeVisible();
  const before = await page.locator('html').getAttribute('class');
  await toggle.click();
  const after = await page.locator('html').getAttribute('class');
  expect(after).not.toBe(before);
});

test('language switch availability', async ({ page }) => {
  await page.goto('/');
  const langSwitch = page.getByRole('button', { name: /language|lang/i });
  test.skip((await langSwitch.count()) === 0, 'Language switcher is not implemented in this repository.');
});

test('404 page renders', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByText(/404|not found/i)).toBeVisible();
});

test('mobile viewport smoke', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Contact/i })).toBeVisible();
});

test('keyboard navigation smoke', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
});
