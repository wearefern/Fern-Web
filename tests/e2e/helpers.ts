import { APIRequestContext, expect, Page } from '@playwright/test';

export async function routeExists(request: APIRequestContext, path: string): Promise<boolean> {
  const response = await request.get(path, { failOnStatusCode: false });
  return response.status() < 400;
}

export async function requireRouteOrSkip(request: APIRequestContext, path: string): Promise<void> {
  const exists = await routeExists(request, path);
  expect(exists, `Route ${path} is not implemented in this repo`).toBeTruthy();
}

export async function clearCartStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.removeItem('fern-cart');
  });
}
