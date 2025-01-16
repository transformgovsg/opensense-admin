import { expect, test as setup } from '@playwright/test';

import { login } from './utils/auth.js';
import { authFileAdmin, authFileSU } from './utils/sessions.js';

setup('authenticate as superuser', async ({ page }) => {
  await login(page, process.env.E2E_SU_USERNAME, process.env.E2E_SU_PASSWORD);
  await expect(page.getByText('Welcome to Sense Admin!')).toBeVisible(); // Check that the input is visible
  await page.context().storageState({ path: authFileSU });
});

setup('authenticate as organization admin', async ({ page }) => {
  await login(page, process.env.E2E_ADMIN_USERNAME, process.env.E2E_ADMIN_PASSWORD);
  await expect(page.getByText('Welcome to Sense Admin!')).toBeVisible(); // Check that the input is visible
  await page.context().storageState({ path: authFileAdmin });
});
