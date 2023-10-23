import { test, expect } from '@playwright/test';

test('Light mode is default', async ({ page }) => {
    await page.goto('/');
    await expect(await page.locator('html')).not.toHaveClass(/dark/);
});

test('Toggle to dark mode', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('dark_mode_button').click();
    await expect(await page.locator('html')).toHaveClass(/dark/);
});

test('Toggle BACK to light mode', async ({ page }) => {
    await page.goto('/');
    let darkModeButton = await page.getByTestId('dark_mode_button');
    await darkModeButton.click();
    await expect(await page.locator('html')).toHaveClass(/dark/);
    await darkModeButton.click();
    await expect(await page.locator('html')).not.toHaveClass(/dark/);
});