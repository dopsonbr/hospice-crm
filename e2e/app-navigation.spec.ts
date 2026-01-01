import { test, expect } from '@playwright/test';

// Authentication tests are skipped when TEST_USR/TEST_PSW are not configured
// These tests require a running Supabase instance with valid credentials
const hasAuthCredentials = !!(process.env.TEST_USR && process.env.TEST_PSW);

// Helper function to login (only used when auth credentials are available)
async function login(page: import('@playwright/test').Page) {
  const email = process.env.TEST_USR!;
  const password = process.env.TEST_PSW!;

  await page.goto('/login');
  await expect(page.locator('form')).toBeVisible();
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);

  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 15000 }),
    page.locator('button', { hasText: 'Sign In' }).click(),
  ]);
}

test.describe('Login Page UI', () => {
  test('should display login form elements', async ({ page }) => {
    await page.goto('/login');

    // Verify the page title
    await expect(page.locator('h1')).toContainText('HospicePro CRM');

    // Verify form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Sign In' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Sign Up' })).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('label[for="email"]')).toContainText('Email');
    await expect(page.locator('label[for="password"]')).toContainText('Password');
  });

  test('should display error message when error query param is present', async ({ page }) => {
    await page.goto('/login?error=Invalid%20credentials');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});

test.describe('Login Authentication', () => {
  test.skip(!hasAuthCredentials, 'Skipped: TEST_USR and TEST_PSW environment variables required');

  test('should login and redirect to dashboard', async ({ page }) => {
    await login(page);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText(/dashboard/i);
  });
});

test.describe('App Navigation', () => {
  test.skip(!hasAuthCredentials, 'Skipped: TEST_USR and TEST_PSW environment variables required');

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
    await page.getByRole('link', { name: 'Pipeline' }).click();
    await expect(page).toHaveURL('/pipeline');
    await expect(page.locator('h1')).toContainText(/pipeline/i);
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.getByRole('link', { name: 'Tasks' }).click();
    await expect(page).toHaveURL('/tasks');
    await expect(page.locator('h1')).toContainText(/tasks/i);
  });

  test('should navigate to activities page', async ({ page }) => {
    await page.getByRole('link', { name: 'Activities' }).click();
    await expect(page).toHaveURL('/activities');
    await expect(page.locator('h1')).toContainText(/activities/i);
  });
});
