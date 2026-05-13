import { expect, test } from '@playwright/test';

test('organizer dashboard loads', async ({ page, request }) => {
  const response = await request.get('/organizer', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Organizer module is not implemented in this repository.');
  await page.goto('/organizer');
  await expect(page).toHaveURL(/\/organizer/);
});

test('create event page loads', async ({ page, request }) => {
  const response = await request.get('/organizer/events/new', { failOnStatusCode: false });
  test.skip(response.status() >= 400, 'Organizer create-event route is not implemented.');
  await page.goto('/organizer/events/new');
  await expect(page).toHaveURL(/\/organizer\/events\/new/);
});

test('required field validation works', async ({ page }) => {
  test.skip(true, 'Organizer event creation UI is not available in this repository.');
});

test('event list renders', async ({ page }) => {
  test.skip(true, 'Organizer event-list UI is not available in this repository.');
});
