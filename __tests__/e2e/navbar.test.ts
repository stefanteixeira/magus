import { test, expect } from '@playwright/test'

test.describe.parallel('Navbar', () => {
  test('shows menu items on Desktop viewport', async ({ page }) => {
    await page.goto('/')

    const menuItems = page.getByTestId('menu-items')

    await expect(menuItems.locator('a')).toHaveCount(4)
    await expect(page.getByTestId('hamburger-menu-items')).not.toBeVisible()
  })

  test('shows hamburger menu on Mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await page.goto('/')

    await page.getByTestId('hamburger-menu').click()

    const hamburgerMenuItems = page.getByTestId('hamburger-menu-items')

    await expect(hamburgerMenuItems.locator('a')).toHaveCount(4)
    await expect(page.getByTestId('menu-items')).not.toBeVisible()
  })

  test('expands hamburger menu on Mobile and navigates to a menu item', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 })

    await page.goto('/')

    await page.getByTestId('hamburger-menu').click()

    const hamburgerMenuItems = page.getByTestId('hamburger-menu-items')
    await hamburgerMenuItems.getByText('Search').click()

    await expect(page).toHaveURL('/search')
  })
})
