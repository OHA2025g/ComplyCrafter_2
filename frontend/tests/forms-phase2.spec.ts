import { test, expect } from '@playwright/test';

const cases = [
  { path: '/forms/ben2', heading: 'BEN2 Filing', fields: ['CIN', 'Company Name'] },
  { path: '/forms/pas3', heading: 'PAS3 Filing', fields: ['CIN', 'Company Name'] },
  { path: '/forms/dpt3', heading: 'DPT3 Filing', fields: ['CIN', 'Company Name'] }
];

test.describe('Phase 2 forms render', () => {
  for (const scenario of cases) {
    test(`renders ${scenario.heading}`, async ({ page }) => {
      await page.goto(scenario.path);
      await expect(page.getByText(scenario.heading)).toBeVisible();
      for (const label of scenario.fields) {
        await page.getByLabel(label).fill('test');
      }
      await page.getByRole('button', { name: /submit/i }).click();
      await expect(page.getByText('Last submitted payload')).toBeVisible();
    });
  }
});
