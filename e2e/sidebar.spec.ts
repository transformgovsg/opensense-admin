import { expect, test } from '@playwright/test';

import { authFileAdmin } from './utils/sessions.js';

test.describe('Sidebar for Admin', () => {
  test.use({ storageState: authFileAdmin });

  test('Dashboard Loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Sense Admin!' })).toBeVisible();
  });
});
