import { test, expect } from '@playwright/test'

test.describe.parallel('Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search')
  })

  test('performs a search', async ({ page }) => {
    await page.getByTestId('name').fill('Skies of Arcadia')
    await page.getByTestId('platform').selectOption('Dreamcast')
    await page.getByTestId('search').click()

    await expect(page.getByTestId('search-result-0')).toBeVisible()
  })

  test('shows error message when no search results are found', async ({
    page,
  }) => {
    await page.getByTestId('name').fill('Game that does not exist')
    await page.getByTestId('search').click()

    await expect(page.getByTestId('info-alert')).toBeVisible()
  })
})
