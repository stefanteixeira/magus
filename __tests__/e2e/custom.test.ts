import { ShelfNames } from '@/types/types'
import { test, expect, Page } from '@playwright/test'
import dayjs from 'dayjs'

const today = dayjs().format('YYYY-MM-DD')
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const gameData = {
  name: 'Custom Game',
  coverUrl: 'https://i.imgur.com/eOtEAB7.jpeg',
  platform: 'PlayStation 4',
  genre: 'Adventure',
  releaseDate: yesterday,
  finishedDate: today,
  myRating: 5,
  shelf: ShelfNames.Wishlist,
  summary: 'Some very descriptive summary',
}

const setDateField = async (page: Page, locator: string, date: string) => {
  await page.getByTestId(locator).click()
  await page.getByTitle(date).first().click({ force: true })
  await expect(page.getByTestId(locator).getAttribute('title')).not.toBe('')
}

const fillFormFields = async (page: Page, game: any) => {
  await page.getByTestId('name').fill(game.name)
  await page.getByTestId('cover-url').fill(game.coverUrl)
  await page.getByTestId('platform').selectOption(game.platform)
  await page.getByTestId('genre').fill(game.genre)
  await setDateField(page, 'release-date', game.releaseDate)
  await setDateField(page, 'finished-date', game.finishedDate)
  await page.getByTestId(`rating-${gameData.myRating}`).click()
  await page.getByTestId(`shelf-${gameData.shelf}`).click()
  await page.getByTestId('summary').fill(game.summary)
}

const addCustomGame = async (page: Page, game: any) => {
  await fillFormFields(page, game)
  await page.getByTestId('btn-add').click()

  await page.waitForURL('/list')
  await expect(page.getByTestId('name-0')).toBeVisible()
}

test.describe('Custom', () => {
  test('adds a game from scratch', async ({ page }) => {
    await page.goto('/custom')

    await addCustomGame(page, gameData)

    await page.getByTestId('last-page').click()

    await page.locator('a').filter({ hasText: gameData.name }).first().click()

    await expect(page.locator('h1')).toHaveText(gameData.name)
  })
})
