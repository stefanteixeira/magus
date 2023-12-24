import { test, expect } from '@playwright/test'

test.describe('Edit', () => {
  test('edits game information', async ({ page }) => {
    const newName = 'Some New Game Name'

    await page.goto('/list')

    await page.getByTestId('edit-2').click()
    await page.getByTestId('name').fill(newName)
    await page.getByTestId('btn-edit').click()

    await page.waitForURL('/list')
    await page.reload()

    await expect(
      page.locator('a').filter({ hasText: newName }).first()
    ).toBeVisible()
  })
})
