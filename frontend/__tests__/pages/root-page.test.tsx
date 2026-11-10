import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Public landing page', () => {
  it('renders the Debwan Live brand and Arabic welcome content', () => {
    render(<Home />)
    expect(screen.getByText('دبوان لايف')).toBeInTheDocument()
    expect(screen.getByText('عالم المشاهدة', { exact: false })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ابدأ المشاهدة/i })).toHaveAttribute('href', '/home')
  })

  it('describes the main platform sections', () => {
    render(<Home />)
    expect(screen.getByText('التلفزيون المباشر')).toBeInTheDocument()
    expect(screen.getByText('مركز كرة القدم')).toBeInTheDocument()
    expect(screen.getByText('الأفلام والمسلسلات')).toBeInTheDocument()
  })

  it('offers public discovery without requiring an account', () => {
    render(<Home />)
    expect(screen.getByText(/تصفح أقسام المنصة مباشرة دون إنشاء حساب أو إدخال كلمة مرور/)).toBeInTheDocument()
  })
})
