import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Signup from './Signup'

// Mock fetch globally
global.fetch = vi.fn()

describe('Signup Component', () => {
  const mockOnSuccess = vi.fn()
  const mockOnSwitchToLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    fetch.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders signup form with all fields', () => {
    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('allows user to fill in all form fields', async () => {
    const user = userEvent.setup()
    const { container } = render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    // Get references to all input fields
    const usernameInput = screen.getByLabelText(/username/i)
    const emailInput = screen.getByLabelText(/email/i)
    const firstNameInput = screen.getByLabelText(/first name/i)
    const lastNameInput = screen.getByLabelText(/last name/i)
    
    // For password fields, access directly by id to avoid asterisk regex issues
    // Inputs have id="password" and id="password2"
    // user.type() works with any input element, including those from querySelector
    const passwordInput = container.querySelector('input#password')
    const confirmPasswordInput = container.querySelector('input#password2')
    
    // Verify inputs exist before typing
    expect(passwordInput).toBeTruthy()
    expect(confirmPasswordInput).toBeTruthy()
    
    // Type into all fields
    await user.type(usernameInput, 'newuser')
    await user.type(emailInput, 'newuser@example.com')
    await user.type(firstNameInput, 'John')
    await user.type(lastNameInput, 'Doe')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    // Verify all values
    expect(usernameInput).toHaveValue('newuser')
    expect(emailInput).toHaveValue('newuser@example.com')
    expect(firstNameInput).toHaveValue('John')
    expect(lastNameInput).toHaveValue('Doe')
    // For querySelector elements, check value directly
    expect(passwordInput.value).toBe('password123')
    expect(confirmPasswordInput.value).toBe('password123')
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'different123')
    
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
    
    expect(fetch).not.toHaveBeenCalled()
  })

  it('calls onSuccess after successful registration', async () => {
    const user = userEvent.setup()
    const mockUserData = { id: 1, username: 'newuser', email: 'newuser@example.com' }
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: mockUserData })
    })

    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    await user.type(screen.getByLabelText(/username/i), 'newuser')
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument()
    })

    // Fast-forward timers to trigger setTimeout
    vi.advanceTimersByTime(1000)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUserData)
    })
  })

  it('shows error message on failed registration', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ username: ['This username is already taken'] })
    })

    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    await user.type(screen.getByLabelText(/username/i), 'existinguser')
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/username is already taken/i)).toBeInTheDocument()
    })
    
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('calls onSwitchToLogin when login link is clicked', async () => {
    const user = userEvent.setup()
    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)

    expect(mockOnSwitchToLogin).toHaveBeenCalledTimes(1)
  })

  it('shows loading state during registration', async () => {
    const user = userEvent.setup()
    fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(<Signup onSuccess={mockOnSuccess} onSwitchToLogin={mockOnSwitchToLogin} />)
    
    await user.type(screen.getByLabelText(/username/i), 'newuser')
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    const submitButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(submitButton)

    expect(screen.getByText(/creating account/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})

