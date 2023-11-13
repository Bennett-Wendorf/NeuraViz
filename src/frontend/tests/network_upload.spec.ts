import { test, expect } from '@playwright/test';

let uploadNetworkHelper = async (page) => {
    await page.locator('#model-upload').setInputFiles('tests/file_inputs/STE_Iris.pth');
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
    await page.locator('#model-upload').setInputFiles('tests/file_inputs/STE_Iris.pth');
    await page.getByRole('button', { name: 'Upload' }).click();
    await expect(page.locator('#model-upload')).toHaveValue('C:\\fakepath\\STE_Iris.pth');
    await expect(page.locator('#model-upload-readout')).toHaveText('STE_Iris.pth');
    await expect(page.locator('#model-validation')).toHaveText('Model is valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-success/);
    let toast = await page.locator('#toast-0');
    await toast.waitFor({ state: "visible" });
    await expect(toast.locator('p')).toHaveText('Model uploaded successfully');
    await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();
});

test('Upload valid model: Graph', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    await expect(await page.isVisible('#graph_container > #graph > svg')).toBeTruthy();
    
    let graph = await page.locator('#graph_container > #graph');
    await expect(graph.locator('svg > g > g > line')).toHaveCount(56);
    await expect(graph.locator('svg > g > g > circle')).toHaveCount(6);
    await expect(graph.locator('svg > g > g > rect')).toHaveCount(4);
    await expect(graph.locator('svg > g > g > g > g > g > rect')).toHaveCount(1);

    await expect(graph.locator('svg > g > g:nth-child(1) > line:nth-child(2)')).toHaveAttribute('marker-end', "url(#arrow)");
    await expect(graph.locator('svg > g > g:nth-child(1) > line:nth-child(27)')).toHaveAttribute('marker-end', "url(#arrow)");

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

test('Graph persists refresh', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);
    await page.reload();
    await expect(await page.isVisible('#graph_container > #graph > svg')).toBeTruthy();
    await expect(page.locator('#model-upload-readout')).toHaveText('STE_Iris.pth');
    await expect(page.locator('#model-validation')).toHaveText('Model is valid');
    await expect(page.locator('#model-validation')).toHaveClass(/text-success/);
    await expect(page.getByRole('button', { name: 'Upload' })).toBeDisabled();

    await expect(await page.locator('#pan-center > button')).not.toBeDisabled();
    await expect(await page.locator('#zoom-in > button')).not.toBeDisabled();
    await expect(await page.locator('#zoom-out > button')).not.toBeDisabled();
});

test('Links are color graded', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);

    let inputLine = await page.locator('g:nth-child(1) > line:nth-child(1)').first();
    await expect(inputLine).toHaveClass(/stroke-neutral-800/);
    await expect(inputLine).toHaveClass(/dark:stroke-neutral-400/);
    await expect(inputLine).toHaveClass(/fill-neutral-800/);
    await expect(inputLine).toHaveClass(/dark:fill-neutral-400/);

    let midLine = await page.locator('g:nth-child(1) > line:nth-child(5)');
    await expect(midLine).toHaveClass(/stroke-linkcolorgradientlight-300/);
    await expect(midLine).toHaveClass(/dark:stroke-linkcolorgradientdark-300/);
    await expect(midLine).toHaveClass(/fill-linkcolorgradientlight-300/);
    await expect(midLine).toHaveClass(/dark:fill-linkcolorgradientdark-300/);
});

test('Nodes are color graded', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);

    let inputNode = await page.locator('g:nth-child(4) > rect:nth-child(1)');
    await expect(inputNode).toHaveClass(/stroke-black/);
    await expect(inputNode).toHaveClass(/fill-neutral-400/);
    await expect(inputNode).toHaveClass(/dark:fill-neutral-600/);

    let midNode = await page.locator('g:nth-child(3) > circle:nth-child(1)');
    await expect(midNode).toHaveClass(/stroke-black/);
    await expect(midNode).toHaveClass(/fill-nodecolorgradientlight-300/);
    await expect(midNode).toHaveClass(/dark:fill-nodecolorgradientdark-300/);
});

test('Color key shows', async ({ page }) => {
    await page.goto('/');

    await expect(await page.locator('#key-label')).toBeVisible();
});

test('Node details show', async ({ page }) => {
    await page.goto('/');
    await uploadNetworkHelper(page);

    let inputNode = await page.locator('g:nth-child(4) > rect:nth-child(1)');
    await inputNode.click();
    await expect(await page.locator('div[role="dialog"]')).toBeVisible();
    await expect(await page.locator('div[role="dialog"] h3')).toContainText("This is an input node.");
    await page.locator('button[aria-label="Close"]').click();
    await expect(await page.locator('div[role="dialog"]')).not.toBeVisible();

    let midNode = await page.locator('g:nth-child(3) > circle:nth-child(1)');
    await midNode.click();
    await expect(await page.locator('div[role="dialog"]')).toBeVisible();
    await expect(await page.locator('div[role="dialog"] h3')).toContainText("-0.132");
    await page.locator('button[aria-label="Close"]').click();
    await expect(await page.locator('div[role="dialog"]')).not.toBeVisible();
});