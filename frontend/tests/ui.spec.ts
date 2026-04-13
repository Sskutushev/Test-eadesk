import { test, expect } from '@playwright/test';

test('home renders and scenario panel exists', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Observability')).toBeVisible();
  await expect(page.getByText('Run a scenario')).toBeVisible();
});
