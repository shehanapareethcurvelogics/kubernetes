import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Mock fetch globally
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockClear()
  })

  it('shows loading state initially', () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves
    
    render(<App />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('renders login form when user is not authenticated', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/django auth app/i)).toBeInTheDocument()
      expect(screen.getByText(/sign in or create an account/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })
  })

  it('renders UserInfo when user is authenticated', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome, john/i)).toBeInTheDocument()
      expect(screen.getByText(/your information/i)).toBeInTheDocument()
    })
  })

  it('switches between login and signup forms', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })

    // Should show login form initially
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    
    // Switch to signup
    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })

    // Switch back to login
    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
    })
  })

  it('handles successful login and shows user info', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John'
    }

    // Initial auth check - not authenticated
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    })

    // Successful login
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUser })
    })

    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'testpass123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/welcome, john/i)).toBeInTheDocument()
    })
  })

  it('handles logout correctly', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })

    render(<App />)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({})
    })

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
      expect(screen.queryByText(/welcome, testuser/i)).not.toBeInTheDocument()
    }, { timeout: 3000 })
  })
})

