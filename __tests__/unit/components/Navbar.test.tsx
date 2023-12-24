import { render, screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import Navbar from '@/components/Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />)
  })

  it('renders navbar', () => {
    const logo = screen.getByTestId('logo')

    expect(logo).toBeInTheDocument()
    expect(logo.closest('a')).toHaveAttribute('href', '/')
  })

  it.each([
    ['Search', '/search'],
    ['My Games', '/list'],
    ['Add from scratch', '/custom'],
  ])('renders "%s" menu with proper href', (name, href) => {
    const menuItems = screen.getByTestId('menu-items')
    const menuItem = within(menuItems).getByRole('button', { name: name })

    expect(menuItem).toBeInTheDocument()
    expect(menuItem.closest('a')).toHaveAttribute('href', href)
  })
})
