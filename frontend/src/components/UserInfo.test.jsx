import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserInfo from './UserInfo'

describe('UserInfo Component', () => {
  const mockOnLogout = vi.fn()

  it('renders user information correctly', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    // Check welcome message (includes first_name)
    expect(screen.getByText(/welcome, john/i)).toBeInTheDocument()
    
    // Check section header
    expect(screen.getByText(/your information/i)).toBeInTheDocument()
    
    // Check ID - use exact text match (component renders just the number)
    expect(screen.getByText('1')).toBeInTheDocument()
    
    // Check username - exact match
    expect(screen.getByText('testuser')).toBeInTheDocument()
    
    // Check email - exact match
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    
    // Check first name - verify label exists and value exists
    // Using getAllByText because "John" appears in welcome message too
    expect(screen.getByText(/first name:/i)).toBeInTheDocument()
    const johnElements = screen.getAllByText('John')
    expect(johnElements.length).toBeGreaterThan(0) // At least one "John" exists
    
    // Check last name - verify label exists and value exists
    expect(screen.getByText(/last name:/i)).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
  })

  it('displays username when first_name is not available', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument()
  })

  it('shows avatar with first letter of first_name', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    const avatar = screen.getByText('J')
    expect(avatar).toBeInTheDocument()
  })

  it('shows avatar with first letter of username when first_name is missing', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    const avatar = screen.getByText('T')
    expect(avatar).toBeInTheDocument()
  })

  it('does not display first_name field when not provided', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    expect(screen.queryByText(/first name/i)).not.toBeInTheDocument()
  })

  it('does not display last_name field when not provided', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    expect(screen.queryByText(/last name/i)).not.toBeInTheDocument()
  })

  it('calls onLogout when logout button is clicked', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)

    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('renders all required user fields', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe'
    }

    render(<UserInfo user={mockUser} onLogout={mockOnLogout} />)
    
    expect(screen.getByText(/^id:/i)).toBeInTheDocument()
    expect(screen.getByText(/username:/i)).toBeInTheDocument()
    expect(screen.getByText(/email:/i)).toBeInTheDocument()
    expect(screen.getByText(/first name:/i)).toBeInTheDocument()
    expect(screen.getByText(/last name:/i)).toBeInTheDocument()
  })
})

