import { expect, test } from '@playwright/test';
import cuid2 from '@paralleldrive/cuid2';

import { authFileAdmin, authFileSU } from './utils/sessions.js';
import { addUserToOrg, createUser } from './utils/db.js';

const userTypes = [
  {
    userType: 'Superuser',
    authFile: authFileSU,
  },
  {
    userType: 'Organization Admin',
    authFile: authFileAdmin,
  },
];

userTypes.forEach(({ userType, authFile }) => {
  test.describe(`Managing Organization as ${userType}`, () => {
    test.use({ storageState: authFile });

    ['Members', 'Admins'].forEach((tabName) => {
      test.describe(`${tabName}`, () => {
        if (tabName === 'Admins' && userType === 'Organization Admin') {
          return;
        }
        test('Create new User [non-existing] under an Organization', async ({ page }) => {
          await page.goto('/admin/resources/Organization');

          // Click on 'Test Organization'
          await page.getByRole('cell', { name: 'Test Organization' }).click({ timeout: 5000 });

          // Navigate to the tab
          await page.getByRole('tab', { name: tabName }).click();

          await page.locator('.adminjs_Loader').nth(0).waitFor({
            timeout: 10000,
            state: 'detached',
          });

          // Click the 'Create new Item' button
          await page.getByTestId('action-new').click();

          // Fill in the form
          const email = `${cuid2.createId()}@tech.gov.sg`;
          await page.getByLabel('Email').fill(email);
          await page.getByLabel('Remote Id').fill(email);

          // Save the new user
          await page.getByTestId('button-save').click();

          // check for success message
          await expect(page.getByText('Successfully created a new record')).toBeVisible();
        });

        test('Remove User from an Organization', async ({ page }) => {
          const user = await createUser();
          await addUserToOrg('Test Organization', user.id, tabName === 'Members' ? 'member' : 'admin');

          await page.goto('/admin/resources/Organization');
          await page.getByRole('cell', { name: 'Test Organization' }).click();
          await page.getByRole('tab', { name: tabName }).click();
          await page.locator('.adminjs_Loader').nth(0).waitFor({
            timeout: 10000,
            state: 'detached',
          });

          await page
            .getByRole('row', { name: new RegExp(`^${user.id.substring(0, 10)}`) })
            .locator('button[color=danger]')
            .click();
          await page.getByRole('button', { name: 'Remove relation' }).click();

          // wait for refresh
          await page.locator('button[color=danger]').nth(0).waitFor({ timeout: 5000 });

          // no longer visible
          await expect(page.getByRole('row', { name: user.id })).not.toBeVisible();
        });

        if (userType === 'Superuser') {
          test('Add an existing User under an Organization', async ({ page }) => {
            const user = await createUser();
            const username = user.email.split('@')[0];

            await page.goto('/admin/resources/Organization');

            // Click on 'Test Organization'
            await page.getByRole('cell', { name: 'Test Organization' }).click({ timeout: 5000 });

            // Navigate to the tab
            await page.getByRole('tab', { name: tabName }).click();

            // Click the 'Add existing item' button
            await page.getByText('Add existing item').click();

            // Select the existing user
            await page.locator('.adminjs_Select').click();
            await page.getByRole('option', { name: new RegExp(`^${username}`) }).click();

            // Submit the form
            await page.getByRole('button', { name: 'Submit' }).click();

            // Verify the user was added
            await expect(page.getByRole('cell', { name: user.email })).toBeVisible();
          });
        }
      });
    });
  });
});
