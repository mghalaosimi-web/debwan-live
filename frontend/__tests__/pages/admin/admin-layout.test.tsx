import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminLayout from '@/app/admin/layout'

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: 'es', changeLanguage: jest.fn() } }),
}))

jest.mock('lucide-react', () => ({
  Menu: (props: any) => <span data-testid="menu-icon" {...props}>Menu</span>,
  X: (props: any) => <span data-testid="close-icon" {...props}>Close</span>,
}))

describe('AdminLayout', () => {
  it('renders the admin navigation and child content', () => {
    render(<AdminLayout><div>Admin child content</div></AdminLayout>)
    expect(screen.getAllByText('DEBWAN LIVE').length).toBeGreaterThan(0)
    expect(screen.getByText('admin.adminPanel')).toBeInTheDocument()
    expect(screen.getByText('admin.dashboard')).toBeInTheDocument()
    expect(screen.getByText('admin.channels')).toBeInTheDocument()
    expect(screen.getByText('Admin child content')).toBeInTheDocument()
  })

  it('communicates the temporary open-access development mode', () => {
    render(<AdminLayout><div>Content</div></AdminLayout>)
    expect(screen.getByText('Open access mode')).toBeInTheDocument()
    expect(screen.getByText('Authentication postponed')).toBeInTheDocument()
  })

  it('opens and closes the mobile sidebar', () => {
    render(<AdminLayout><div>Content</div></AdminLayout>)
    fireEvent.click(screen.getAllByTestId('menu-icon')[0].closest('button')!)
    expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('close-icon').closest('button')!)
  })

  it('closes the mobile sidebar when its overlay is clicked', () => {
    const { container } = render(<AdminLayout><div>Content</div></AdminLayout>)
    fireEvent.click(screen.getAllByTestId('menu-icon')[0].closest('button')!)
    const overlay = container.querySelector('.bg-black\\/50')
    expect(overlay).toBeTruthy()
    fireEvent.click(overlay!)
  })
})
