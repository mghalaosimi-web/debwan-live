import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import UserLayout from '@/app/(user)/layout'

let mockPathname = '/home'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

jest.mock('@/components/ui/global-search', () => ({
  __esModule: true,
  default: () => <div data-testid="global-search">Search</div>,
}))

jest.mock('lucide-react', () => ({
  Menu: (props: any) => <span data-testid="menu-icon" {...props}>Menu</span>,
  X: (props: any) => <span data-testid="x-icon" {...props}>X</span>,
}))

describe('UserLayout', () => {
  beforeEach(() => { mockPathname = '/home' })

  it('renders the public user shell and child page without an auth context', () => {
    render(<UserLayout><div>Page Content</div></UserLayout>)
    expect(screen.getByText('Page Content')).toBeInTheDocument()
    expect(screen.getByText('DEBWAN LIVE')).toBeInTheDocument()
    expect(screen.getByTestId('global-search')).toBeInTheDocument()
  })

  it('renders the primary navigation links', () => {
    render(<UserLayout><div>Content</div></UserLayout>)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav.querySelector('a[href="/home"]')).toBeInTheDocument()
    expect(nav.querySelector('a[href="/channels"]')).toBeInTheDocument()
    expect(nav.querySelector('a[href="/vod"]')).toBeInTheDocument()
    expect(nav.querySelector('a[href="/series"]')).toBeInTheDocument()
    expect(nav.querySelector('a[href="/guide"]')).toBeInTheDocument()
  })

  it('marks the current route accessibly', () => {
    mockPathname = '/channels'
    render(<UserLayout><div>Content</div></UserLayout>)
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav.querySelector('a[href="/channels"]')).toHaveAttribute('aria-current', 'page')
  })

  it('opens and closes the mobile navigation', () => {
    render(<UserLayout><div>Content</div></UserLayout>)
    fireEvent.click(screen.getByLabelText('Open navigation menu'))
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Close navigation menu'))
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
  })

  it('provides a skip-to-content link', () => {
    render(<UserLayout><div>Content</div></UserLayout>)
    expect(screen.getByText('Saltar al contenido principal')).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).toBeInTheDocument()
  })
})
