import { test, expect } from '@playwright/test';

let uploadNetworkHelper = async (page) => {
    await page.locator('#model-upload').setInputFiles('tests/file_inputs/standard_example.pth');
    await page.getByRole('button', { name: 'Upload' }).click();
    await page.locator('#graph_container > #graph').waitFor({ state: "visible" });
}

test('No network displayed when no network is uploaded', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#graph_container > #upload_text')).toHaveText('Please upload a model to continue...');
});

test('Upload empty model: Sidebar', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#model-upload')).toHaveValue('');
    await expect(page.locator('#model-validation')).toHaveText('Model is not valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-error/);
});

test('Upload valid model: Sidebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('#model-upload').setInputFiles('tests/file_inputs/standard_example.pth');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#model-upload')).toHaveValue('C:\\fakepath\\standard_example.pth');
    await expect(page.locator('#model-validation')).toHaveText('Model is valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-success/);
    let toast = await page.locator('#toast-0');
    await toast.waitFor({ state: "visible" });
    await expect(toast.locator('p')).toHaveText('Model uploaded successfully');
});

test('Upload valid model: Graph', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    await expect(await page.isVisible('#graph_container > #graph > svg')).toBeTruthy();
    
    let graph = await page.locator('#graph_container > #graph');
    await expect(graph.locator('svg > g > g > line')).toHaveCount(30);
    await expect(graph.locator('svg > g > g > circle')).toHaveCount(13);

    await expect(await page.locator('#pan-center > button')).not.toBeDisabled();
    await expect(await page.locator('#zoom-in > button')).not.toBeDisabled();
    await expect(await page.locator('#zoom-out > button')).not.toBeDisabled();
});

test('Graph zoom in', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    await page.locator('#zoom-in > button').click();
    await expect(page.locator('#graph_container > #graph > svg > g')).toHaveAttribute('transform', 'translate(0,0) scale(1.2)');
});

test('Graph zoom out', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    await page.locator('#zoom-out > button').click();
    await expect(page.locator('#graph_container > #graph > svg > g')).toHaveAttribute('transform', 'translate(0,0) scale(0.8)');
});

test('Graph center', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    let graph = await page.locator('#graph_container > #graph > svg');
    await graph.dragTo(page.locator('#pan-center'));
    await expect(graph.locator('g').first()).not.toHaveAttribute('transform', 'translate(0,0) scale(1)');
    await page.locator("#pan-center > button").click();
    await page.waitForTimeout(500);
    await expect(graph.locator('g').first()).toHaveAttribute('transform', 'translate(0,0) scale(1)');
});