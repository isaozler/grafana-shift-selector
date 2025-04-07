import { test, expect } from '@playwright/test';

test('should load grafana', async ({ page }) => {
  await page.goto('http://localhost:3000');

  expect(page.url()).toBe('http://localhost:3000/');
  expect(await page.title()).toBe('Grafana');
});
