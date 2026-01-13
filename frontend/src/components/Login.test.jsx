import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

// Mock fetch globally - This replaces the real fetch function with a fake one
// Why? We don't want to make real API calls in tests (slow, unreliable)
global.fetch = vi.fn()

describe('Login Component', () => {
  // Create mock functions - These track if/when they're called
  // Think of them as "spies" that watch what happens
  const mockOnSuccess = vi.fn()  // Will track if onSuccess is called
  const mockOnSwitchToSignup = vi.fn()  // Will track if switch to signup is called

  beforeEach(() => {
    // Before EACH test, reset everything
    // This ensures tests don't affect each other
    vi.clearAllMocks()  // Clear all mock function calls
    fetch.mockClear()   // Clear fetch mock history
  })

  it('renders login form with all fields', () => {
    // STEP 1: RENDER - Show the Login component on screen (virtually)
    // This is like opening the page in a browser, but invisible
    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    // STEP 2: FIND & VERIFY - Check if all form elements exist
    // getByLabelText finds an input by its label text
    // toBeInTheDocument checks if it exists on the page
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()  // Find "Username" field
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()  // Find "Password" field
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()  // Find "Login" button
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()  // Find signup link text
  })

  it('allows user to type in username and password fields', async () => {
    // STEP 1: SETUP - Create a user event simulator
    // This is like creating a virtual user that can interact with the page
    const user = userEvent.setup()
    
    // STEP 2: RENDER - Show the Login form
    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    // STEP 3: FIND ELEMENTS - Locate the input fields on the page
    // Store them in variables so we can use them later
    const usernameInput = screen.getByLabelText(/username/i)  // Find username field
    const passwordInput = screen.getByLabelText(/password/i)  // Find password field

    // STEP 4: SIMULATE USER TYPING - This is the key part!
    // user.type() simulates a real user typing character by character
    // What happens behind the scenes:
    //   1. Focuses the field (like clicking on it)
    //   2. Types each character: 't' → 'e' → 's' → 't' → 'u' → 's' → 'e' → 'r'
    //   3. Each character triggers: keydown → input → change → keyup events
    //   4. React's onChange handler fires for each character
    //   5. Component state updates
    //   6. Component re-renders with new value
    // await = Wait for typing to finish before continuing
    await user.type(usernameInput, 'testuser')  // Type "testuser" in username field
    await user.type(passwordInput, 'testpass123')  // Type "testpass123" in password field

    // STEP 5: VERIFY - Check if the fields contain what we typed
    // toHaveValue checks the actual value in the input field
    // This verifies that typing actually worked!
    expect(usernameInput).toHaveValue('testuser')  // Check: Does username field contain "testuser"?
    expect(passwordInput).toHaveValue('testpass123')  // Check: Does password field contain "testpass123"?
  })

  it('calls onSwitchToSignup when sign up link is clicked', async () => {
    const user = userEvent.setup()
    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpButton)

    expect(mockOnSwitchToSignup).toHaveBeenCalledTimes(1)
  })

  it('shows error message on failed login', async () => {
    // STEP 1: SETUP - Create user simulator
    const user = userEvent.setup()
    
    // STEP 2: MOCK API RESPONSE - Tell fetch what to return when called
    // This simulates what the server would return if login fails
    // mockResolvedValueOnce = "When fetch is called once, return this value"
    fetch.mockResolvedValueOnce({
      ok: false,  // Request failed (like 401 Unauthorized)
      json: async () => ({ non_field_errors: ['Invalid credentials'] })  // Error message
    })

    // STEP 3: RENDER - Show the login form
    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    // STEP 4: FIND ELEMENTS - Locate form fields and button
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    // STEP 5: SIMULATE USER FILLING FORM
    // User types username
    await user.type(usernameInput, 'wronguser')  // Types "wronguser"
    // User types password
    await user.type(passwordInput, 'wrongpass')  // Types "wrongpass"
    
    // STEP 6: SIMULATE USER CLICKING SUBMIT
    // What happens when button is clicked:
    //   1. Form's onSubmit handler fires
    //   2. Form data is collected: { username: 'wronguser', password: 'wrongpass' }
    //   3. fetch('/api/auth/login/') is called with this data
    //   4. Our mock returns the error response
    //   5. Component receives error and shows error message
    await user.click(submitButton)

    // STEP 7: VERIFY ERROR MESSAGE APPEARS
    // waitFor = Wait for something to happen (because API calls are async)
    // This waits until the error message appears on screen
    // Why waitFor? Because the API call takes time, error might not appear immediately
    await waitFor(() => {
      // Check: Is "Invalid credentials" text visible on screen?
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
    // ✅ Test passes if error message appears!
  })

  it('calls onSuccess with user data on successful login', async () => {
    // STEP 1: SETUP
    const user = userEvent.setup()
    
    // STEP 2: PREPARE MOCK USER DATA - This is what the API will return
    const mockUserData = { id: 1, username: 'testuser', email: 'test@example.com' }
    
    // STEP 3: MOCK SUCCESSFUL API RESPONSE
    // When fetch is called, return a successful response with user data
    fetch.mockResolvedValueOnce({
      ok: true,  // Request succeeded (like 200 OK)
      json: async () => ({ user: mockUserData })  // Return user data
    })

    // STEP 4: RENDER LOGIN FORM
    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    // STEP 5: FIND FORM ELEMENTS
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    // STEP 6: USER FILLS FORM
    await user.type(usernameInput, 'testuser')      // Type username
    await user.type(passwordInput, 'testpass123')   // Type password
    
    // STEP 7: USER SUBMITS FORM
    // What happens:
    //   1. Button clicked → Form submits
    //   2. API call made → fetch('/api/auth/login/')
    //   3. Mock returns success with user data
    //   4. Component calls onSuccess(mockUserData)
    await user.click(submitButton)

    // STEP 8: VERIFY onSuccess WAS CALLED WITH CORRECT DATA
    // waitFor = Wait for async operation (API call) to complete
    // toHaveBeenCalledWith = Check if function was called with specific arguments
    await waitFor(() => {
      // Check: Was mockOnSuccess called with the user data?
      expect(mockOnSuccess).toHaveBeenCalledWith(mockUserData)
    })
    // ✅ Test passes if onSuccess was called with correct user data!
  })

  it('shows loading state during login', async () => {
    const user = userEvent.setup()
    fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'testpass123')
    await user.click(submitButton)

    expect(screen.getByText(/logging in/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('clears error when user starts typing', async () => {
    const user = userEvent.setup()
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ non_field_errors: ['Invalid credentials'] })
    })

    render(<Login onSuccess={mockOnSuccess} onSwitchToSignup={mockOnSwitchToSignup} />)
    
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /login/i })

    // Trigger error
    await user.type(usernameInput, 'wronguser')
    await user.type(passwordInput, 'wrongpass')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })

    // Start typing - error should clear
    await user.type(usernameInput, 'x')
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })
})

