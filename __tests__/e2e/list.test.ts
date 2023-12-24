import { test, expect, Locator } from '@playwright/test'

const filterOptions = [
  ['platform', 'Nintendo Switch'],
  ['shelf', 'Wishlist'],
  ['genre', 'Role-playing (RPG)'],
]

test.describe.parallel('List', () => {
  let gamesCountLocator: Locator

  test.beforeEach(async ({ page }) => {
    await page.goto('/list')
    await expect(page.getByTestId('name-0')).toBeVisible()

    gamesCountLocator = page.getByTestId('games-count')
  })

  for (const [filterName, filterValue] of filterOptions) {
    test(`filters by ${filterName}`, async ({ page }) => {
      const gamesCount = await gamesCountLocator.textContent()

      await page.getByTestId(`filter-${filterName}`).selectOption(filterValue)

      await expect(gamesCountLocator).not.toHaveText(gamesCount as string)
    })
  }

  test('clears enabled filters', async ({ page }) => {
    const gamesCount = await gamesCountLocator.textContent()

    const [filterName, filterValue] = filterOptions[0]
    await page.getByTestId(`filter-${filterName}`).selectOption(filterValue)

    await expect(gamesCountLocator).not.toHaveText(gamesCount as string)

    await page.getByTestId('btn-clear-filters').click()

    await expect(gamesCountLocator).toHaveText(gamesCount as string)
  })

  test('opens details page when game name is clicked', async ({ page }) => {
    const firstGame = page.getByTestId('name-0')
    const gameName = await firstGame.textContent()

    await firstGame.click()

    await expect(page.locator('h1')).toHaveText(gameName as string)
    expect(page.url()).toContain('/details/')
  })
})
