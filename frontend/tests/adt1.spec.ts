import { test, expect } from '@playwright/test';

// Assumes `npm run start` is running locally when executing `npm run e2e`.
test('ADT1 form renders and validates required fields', async ({ page }) => {
  await page.goto('/forms/adt1');
  await expect(page.getByText('ADT1 Filing')).toBeVisible();

  await page.getByRole('button', { name: /submit/i }).click();
  await expect(page.getByText('ADT1 Filing')).toBeVisible();

  await page.getByLabel('CIN').fill('L12345MH2010PLC000001');
  await page.getByLabel('Company Name').fill('Comply Crafter Pvt Ltd');
  await page.getByRole('button', { name: /submit/i }).click();

  await expect(page.getByText('Last submitted payload')).toBeVisible();
});
