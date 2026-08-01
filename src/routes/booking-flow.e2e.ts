import { expect, test } from '@playwright/test';

const travelDate = () => new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);

test('a traveller can search, pick seats and pay through to a confirmed booking', async ({
	page
}) => {
	await page.goto(`/search/bus?from=dhaka&to=coxs-bazar&date=${travelDate()}&pax=2`);

	await expect(page.getByRole('heading', { name: /dhaka — cox's bazar/i })).toBeVisible();

	await page
		.getByRole('link', { name: /select seats/i })
		.first()
		.click();
	await expect(page).toHaveURL(/\/trip\//);

	// Two free seats: anything selectable and not already taken.
	const freeSeats = page.locator('button[aria-pressed="false"]:not([disabled])');
	await freeSeats.nth(0).click();
	await freeSeats.nth(1).click();

	const names = page.locator('input[id^="name-"]');
	await expect(names).toHaveCount(2);
	await names.nth(0).fill('Ayesha Rahman');
	await names.nth(1).fill('Imran Hossain');

	await page.locator('#contact-name').fill('Ayesha Rahman');
	await page.locator('#contact-email').fill('ayesha@example.com');
	await page.locator('#contact-phone').fill('01712345678');

	await page.getByRole('button', { name: /continue/i }).click();
	await expect(page).toHaveURL(/\/checkout\//);

	await page.locator('#card-number').fill('4242424242424242');
	await page.locator('#card-expiry').fill('09/29');
	await page.locator('#card-cvc').fill('123');
	await page.getByRole('button', { name: /^pay/i }).click();

	await expect(page).toHaveURL(/\/bookings\/[A-Z0-9]{6}/);
	await expect(page.getByRole('heading', { name: /you are booked/i })).toBeVisible();
	await expect(page.getByText('Ayesha Rahman').first()).toBeVisible();
	await expect(page.getByText('Imran Hossain').first()).toBeVisible();
});

test('an unknown page shows a friendly message rather than a stack trace', async ({ page }) => {
	const response = await page.goto('/no-such-page');
	expect(response?.status()).toBe(404);
	await expect(page.getByText(/this page has moved or no longer exists/i)).toBeVisible();
});

test('a booking cannot be opened with the reference alone', async ({ page }) => {
	await page.goto('/bookings/ABC123');
	await expect(page.getByText(/we need your email as well/i)).toBeVisible();
});
