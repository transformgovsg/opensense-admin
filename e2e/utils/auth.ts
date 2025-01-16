import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Username' }).waitFor({ timeout: 10000 });

  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill(username);

  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await page.getByRole('button', { name: 'submit' }).click();

  await page.waitForNavigation({ timeout: 30000 });
}
