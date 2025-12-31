import { test, expect } from '@playwright/test';

// Helper function to login
async function login(page: import('@playwright/test').Page) {
  const email = process.env.TEST_USER;
  const password = process.env.TEST_PSW;

  if (!email || !password) {
    throw new Error('TEST_USER and TEST_PSW environment variables are required');
  }

  await page.goto('/login');

  // Wait for the login form to be visible
  await expect(page.locator('form')).toBeVisible();

  // Fill in credentials
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  // Click sign in and wait for navigation
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 15000 }),
    page.locator('button', { hasText: 'Sign In' }).click(),
  ]);
}

test.describe('Login', () => {
  test('should login and redirect to dashboard', async ({ page }) => {
    await login(page);

    // Verify we're on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText(/dashboard/i);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('invalid@test.com');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.locator('button', { hasText: 'Sign In' }).click();

    // Should stay on login page with error
    await expect(page).toHaveURL(/\/login\?error=/);
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});

test.describe('App Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to facilities page', async ({ page }) => {
    await page.locator('a[href="/facilities"]').click();
    await expect(page).toHaveURL('/facilities');
    await expect(page.locator('h1')).toContainText(/facilities/i);
  });

  test('should navigate to contacts page', async ({ page }) => {
    await page.locator('a[href="/contacts"]').click();
    await expect(page).toHaveURL('/contacts');
    await expect(page.locator('h1')).toContainText(/contacts/i);
  });

  test('should navigate to pipeline page', async ({ page }) => {
    await page.locator('a[href="/pipeline"]').click();
    await expect(page).toHaveURL('/pipeline');
    await expect(page.locator('h1')).toContainText(/pipeline/i);
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.locator('a[href="/tasks"]').click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toContainText(/tasks/i);
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.locator('a[href="/activities"]').click();
    await expect(page).toHaveURL('/activities');
    await expect(page.locator('h1')).toContainText(/activities/i);
  });
});
