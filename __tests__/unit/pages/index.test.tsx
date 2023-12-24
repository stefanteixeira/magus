import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  beforeEach(() => {
    render(<Home />)
  })

  it('renders title', () => {
    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })

  it.each([
    ['Search', '/search'],
    ['My Games', '/list'],
    ['Stats', '/stats'],
    ['Add from scratch', '/custom'],
  ])('renders "%s" button with proper href', (name, href) => {
    const button = screen.getByRole('button', { name: name })

    expect(button).toBeInTheDocument()
    expect(button.closest('a')).toHaveAttribute('href', href)
  })
})
