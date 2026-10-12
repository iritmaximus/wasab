import { AxeBuilder } from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';
import { apps } from '../src/apps';

const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', (err) => errors.push(err.message));
      await use(errors);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has the title and heading', async ({ page }) => {
  await expect(page).toHaveTitle('pumppi.dev');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('pumppi.dev');
});

test('links to every app', async ({ page }) => {
  await expect(page.getByRole('link')).toHaveCount(apps.length);
  for (const app of apps) {
    await expect(page.locator(`a[href="${app.url}"]`)).toBeVisible();
  }
});

test('clicking anywhere on a card follows its link', async ({ page }) => {
  await page.route('https://meal.pumppi.dev/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<title>mealie stub</title>' }),
  );
  // the description sits under the link's ::after overlay, so click by coordinates
  const box = await page.getByText('Recipes and meal plans').boundingBox();
  if (!box) throw new Error('description not rendered');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL('https://meal.pumppi.dev/');
});

test('search filters and Escape resets', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Search apps' });
  // the shortcut is registered in an effect that can land after the load event;
  // only press again while unfocused, a "/" typed into the box would fail the next check
  await expect(async () => {
    if (!(await search.evaluate((el) => el === document.activeElement))) {
      await page.keyboard.press('/');
    }
    await expect(search).toBeFocused({ timeout: 500 });
  }).toPass();
  await expect(search).toHaveValue('');

  await search.fill('grafana');
  await expect(page.getByRole('link')).toHaveCount(1);
  await expect(page.getByRole('link')).toHaveAttribute('href', 'https://grafana.pumppi.dev');

  await search.fill('zzz');
  await expect(page.getByRole('status')).toHaveText('No apps match “zzz”.');

  await search.press('Escape');
  await expect(page.getByRole('link')).toHaveCount(apps.length);
});

test('fits every app on one screen without scrolling', async ({ page }) => {
  const { scrollHeight, clientHeight } = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  expect(scrollHeight).toBeLessThanOrEqual(clientHeight);
  for (const link of await page.getByRole('link').all()) {
    await expect(link).toBeInViewport({ ratio: 1 });
  }
});

test('has no horizontal scroll', async ({ page }) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

for (const colorScheme of ['light', 'dark'] as const) {
  test(`has no accessibility violations in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
