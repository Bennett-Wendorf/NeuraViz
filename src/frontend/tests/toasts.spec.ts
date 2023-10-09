import { test, expect } from '@playwright/test';

test('Send default toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('default-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something happened!');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-blue-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('Send default info toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('default-info-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something happened!');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-blue-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('Send default success toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('default-success-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something happened!');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-green-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('Send default error toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('default-error-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something happened!');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-red-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).toBeVisible();
});

test('Send default warning toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('default-warning-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something happened!');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-yellow-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('Send success success message toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('success-success-message-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText('Something was successful');
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-green-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('Send infinite timeout toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('infinite-timeout-toast').evaluate((el: HTMLElement) => el.click());
    await expect(page.locator('#toast-0 p')).toHaveText("I'll never leave!");
    await expect(page.locator('#toast-0 > div > div').first()).toHaveClass(/bg-blue-100/);
    await page.waitForTimeout(8000);
    await expect(page.locator('#toast-0')).toBeVisible();
});

test('Can close toast', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('infinite-timeout-toast').evaluate((el: HTMLElement) => el.click());
    await page.locator("#toast-0").waitFor({ state: "visible" });
    await page.locator("#toast-0 button").click();
    await page.waitForTimeout(500);
    await expect(page.locator('#toast-0')).not.toBeVisible();
});

test('A whole loaf of toasts', async ({ page }) => {
    await page.goto('/');
    for(let i = 0; i < 10; i++) {
        await page.getByTestId('infinite-timeout-toast').evaluate((el: HTMLElement) => el.click());
    }
    await expect(page.locator('.toast')).toHaveCount(5);
});