import { test, expect } from '@playwright/test';

const baseFields = ['CIN', 'Company Name', 'Contact Email', 'Filing Period'];

const cases = [
  { path: '/forms/aoc4', heading: 'AOC4 Filing', field: 'Financial Summary' },
  { path: '/forms/aoc4cfs', heading: 'AOC4 CFS Filing', field: 'Consolidated Summary' },
  { path: '/forms/mgt7a', heading: 'MGT7A Filing', field: 'Shareholding Pattern' },
  {
    path: '/forms/msme',
    heading: 'MSME Form I',
    field: 'Outstanding Details',
    selectField: 'Half-Year Period',
    selectValue: 'April to September'
  },
  { path: '/forms/msme1', heading: 'MSME-1 Additional Return', field: 'Invoice Summary' },
  { path: '/forms/ndh1', heading: 'NDH-1 Return', field: 'Member Data' },
  { path: '/forms/ndh2', heading: 'NDH-2 Application', field: 'Extension Reason' }
];

test.describe('Phase 3 forms render', () => {
  for (const scenario of cases) {
    test(`renders ${scenario.heading}`, async ({ page }) => {
      await page.goto(scenario.path);
      await expect(page.getByRole('heading', { name: scenario.heading })).toBeVisible();

      for (const label of baseFields) {
        await page.getByLabel(label).fill('Test Value');
      }

      if (scenario.selectField && scenario.selectValue) {
        await page.getByLabel(scenario.selectField).selectOption(scenario.selectValue);
      }

      await page.getByLabel(scenario.field).fill('Sample text');
      await page.getByRole('button', { name: /submit/i }).click();
      await expect(page.getByText('Last submitted payload')).toBeVisible();
    });
  }
});
