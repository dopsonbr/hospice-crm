import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    const email = process.env.TEST_USER;
    const password = process.env.TEST_PSW;

    if (!email || !password) {
      throw new Error('TEST_USER and TEST_PSW environment variables are required');
    }

    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to dashboard after login
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/dashboard/i);
  });

  test('should navigate to facilities page', async ({ page }) => {
    await page.click('a[href="/facilities"]');
    await expect(page).toHaveURL('/facilities');
    await expect(page.locator('h1')).toContainText(/facilities/i);
  });

  test('should navigate to contacts page', async ({ page }) => {
    await page.click('a[href="/contacts"]');
    await expect(page).toHaveURL('/contacts');
    await expect(page.locator('h1')).toContainText(/contacts/i);
  });

  test('should navigate to pipeline page', async ({ page }) => {
    await page.click('a[href="/pipeline"]');
    await expect(page).toHaveURL('/pipeline');
    await expect(page.locator('h1')).toContainText(/pipeline/i);
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.click('a[href="/tasks"]');
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toContainText(/tasks/i);
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.click('a[href="/activities"]');
    await expect(page).toHaveURL('/activities');
    await expect(page.locator('h1')).toContainText(/activities/i);
  });
});
