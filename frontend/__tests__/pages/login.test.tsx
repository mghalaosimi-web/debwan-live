import React from 'react'
import { render } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'

const mockRedirect = jest.fn()

jest.mock('next/navigation', () => ({
  redirect: (destination: string) => mockRedirect(destination),
}))

describe('LoginPage', () => {
  beforeEach(() => mockRedirect.mockClear())

  it('redirects the legacy login route to the public landing page', () => {
    render(<LoginPage />)
    expect(mockRedirect).toHaveBeenCalledWith('/')
  })
})
