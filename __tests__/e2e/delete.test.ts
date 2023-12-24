import { test, expect } from '@playwright/test'

const getGamesCount = (countBadge: string) => {
  const match = countBadge.match(/Listing (\d+) games/)
  if (!match || !match[1]) {
    throw new Error(`Unable to parse games count from "${countBadge}"`)
  }

  return parseInt(match[1])
}

test.describe('Delete', () => {
  test('deletes a game', async ({ page }) => {
    await page.goto('/list')
    await expect(page.getByTestId('name-0')).toBeVisible()

    const gamesCountLocator = page.getByTestId('games-count')
    const countBadge = await gamesCountLocator.textContent()
    const gamesCount = getGamesCount(countBadge as string)

    await page.getByTestId('delete-5').click()
    await page.getByTestId('modal-confirm').click()

    await expect(gamesCountLocator).toHaveText(
      `Listing ${gamesCount - 1} games`
    )
  })
})
