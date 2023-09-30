import { test, expect } from '@playwright/test';

test('No network displayed when no network is uploaded', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#graph_container > #upload_text')).toHaveText('Please upload a model to continue...');
});

test('Upload invalid model: Sidebar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#model-upload')).toHaveValue('');
    await expect(page.locator('#model-validation')).toHaveText('Model is not valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-error/);
});

test.describe('Network is displayed when a network is uploaded', () => {
    let page: any;
    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
    })

    test('01. Upload valid model: Sidebar', async () => {
        await page.goto('/');
    await page.locator('#model-upload').setInputFiles('tests/file_inputs/standard_example.pth');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#model-upload')).toHaveValue('C:\\fakepath\\standard_example.pth');
    await expect(page.locator('#model-validation')).toHaveText('Model is valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-success/);
    });

    test('02. Upload valid model: Graph', async () => {
        await page.goto('/');
        await expect(await page.isVisible('#graph_container > #graph')).toBeTruthy();
        await expect(await page.isVisible('#graph_container > #graph > svg')).toBeTruthy();
        await expect(await page.locator('#pan-center > button')).not.toBeDisabled();
        await expect(await page.locator('#zoon-in > button')).not.toBeDisabled();
        await expect(await page.locator('#zoom-out > button')).not.toBeDisabled();
    });
});