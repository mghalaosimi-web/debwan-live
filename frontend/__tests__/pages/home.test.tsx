import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '@/app/(user)/home/page'

describe('HomePage', () => {
  it('renders the Debwan Live home experience in Arabic RTL', () => {
    render(<HomePage />)
    expect(screen.getByText('DEBWAN LIVE')).toBeInTheDocument()
    expect(screen.getByText('بوابتك إلى القنوات المباشرة وكرة القدم والأفلام والمسلسلات. التصفح متاح الآن دون تسجيل دخول.')).toBeInTheDocument()
  })

  it('provides links to the four main content sections', () => {
    render(<HomePage />)
    expect(document.querySelector('a[href="/channels"]')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /مركز كرة القدم/i })).toHaveAttribute('href', '/football')
    expect(screen.getByRole('link', { name: /الأفلام/i })).toHaveAttribute('href', '/vod')
    expect(screen.getByRole('link', { name: /المسلسلات/i })).toHaveAttribute('href', '/series')
  })

  it('clearly warns that content depends on configured and verified sources', () => {
    render(<HomePage />)
    expect(screen.getByText('تنبيه حول توفر المحتوى')).toBeInTheDocument()
    expect(screen.getByText(/لن نعرض روابط وهمية أو مصادر بث غير موثوقة/)).toBeInTheDocument()
  })
})
