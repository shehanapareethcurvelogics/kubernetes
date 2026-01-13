# React Testing Guide

Complete guide for testing the React frontend application using Vitest and React Testing Library.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Running Tests](#running-tests)
4. [Test Structure](#test-structure)
5. [Writing Tests](#writing-tests)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This project uses:
- **Vitest** - Fast unit test framework (Vite-native)
- **React Testing Library** - Simple and complete testing utilities
- **jsdom** - DOM implementation for Node.js (for browser environment simulation)

### Why These Tools?

- **Vitest**: Fast, compatible with Vite, and has great TypeScript support
- **React Testing Library**: Encourages testing user behavior, not implementation details
- **jsdom**: Provides browser-like environment for testing React components

---

## Setup

### Prerequisites

The testing dependencies are already configured in `package.json`. If you need to install them:

```bash
cd frontend
npm install
```

### Test Configuration

Tests are configured in `vite.config.js`:

```javascript
test: {
  globals: true,           // Use global test functions (describe, it, expect)
  environment: 'jsdom',    // Browser-like environment
  setupFiles: './src/test/setup.js',  // Test setup file
  css: true,               // Process CSS files
}
```

### Test Setup File

The `src/test/setup.js` file:
- Extends Vitest's `expect` with jest-dom matchers
- Cleans up after each test to prevent test pollution

---

## Running Tests

### Basic Commands

```bash
# Run tests in watch mode (default)
npm test

# Run tests once and exit
npm test -- --run

# Run tests with UI (interactive)
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode

By default, tests run in watch mode:
- Tests re-run automatically when files change
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

### Filtering Tests

```bash
# Run tests matching a pattern
npm test -- Login

# Run tests in a specific file
npm test -- Login.test.jsx

# Run tests matching a pattern in file name
npm test -- --grep "renders"
```

---

## Test Structure

### File Naming Convention

- Test files: `ComponentName.test.jsx` (next to component)
- Setup files: `src/test/setup.js`

### Test File Example

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Component from './Component'

describe('Component', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should do something', () => {
    // Test implementation
  })
})
```

---

## Writing Tests

### Basic Component Test

```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

it('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Testing User Interactions

```javascript
import userEvent from '@testing-library/user-event'

it('handles button click', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  
  render(<Button onClick={handleClick} />)
  
  const button = screen.getByRole('button')
  await user.click(button)
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Testing Async Operations

```javascript
import { waitFor } from '@testing-library/react'

it('loads data asynchronously', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' })
  })

  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument()
  })
})
```

### Mocking Fetch API

```javascript
global.fetch = vi.fn()

beforeEach(() => {
  fetch.mockClear()
})

it('makes API call', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ user: { id: 1 } })
  })

  // Your test code
})
```

### Testing Form Inputs

```javascript
it('handles form input', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)
  
  const input = screen.getByLabelText(/username/i)
  await user.type(input, 'testuser')
  
  expect(input).toHaveValue('testuser')
})
```

---

## Test Coverage

### Current Test Coverage

The project includes tests for:

- ✅ **App Component** - Main app logic, authentication flow, form switching
- ✅ **Login Component** - Form rendering, input handling, error states, API calls
- ✅ **Signup Component** - Form validation, password matching, API calls
- ✅ **UserInfo Component** - User data display, logout functionality

### Running Coverage

```bash
npm run test:coverage
```

This generates a coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

---

## Best Practices

### 1. Test User Behavior, Not Implementation

✅ **Good:**
```javascript
expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
```

❌ **Bad:**
```javascript
expect(component.state.isLoading).toBe(false)
```

### 2. Use Accessible Queries

Prefer queries that users would use:
1. `getByRole` - Most accessible
2. `getByLabelText` - For form inputs
3. `getByText` - For visible text
4. `getByTestId` - Last resort

### 3. Clean Up After Tests

Tests automatically clean up via `setup.js`, but you can manually clean up:

```javascript
afterEach(() => {
  cleanup()
})
```

### 4. Mock External Dependencies

Always mock API calls and external services:

```javascript
global.fetch = vi.fn()
```

### 5. Use Descriptive Test Names

✅ **Good:**
```javascript
it('shows error message when login fails', () => {})
```

❌ **Bad:**
```javascript
it('test login', () => {})
```

### 6. Test One Thing Per Test

Each test should verify one specific behavior:

```javascript
it('renders username field', () => {})
it('validates username is required', () => {})
it('shows error for invalid username', () => {})
```

### 7. Use `waitFor` for Async Updates

```javascript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

---

## Common Testing Patterns

### Testing Component Props

```javascript
it('calls onSuccess with user data', async () => {
  const onSuccess = vi.fn()
  const mockUser = { id: 1, username: 'test' }
  
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ user: mockUser })
  })

  render(<Login onSuccess={onSuccess} />)
  
  // Simulate login
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(mockUser)
  })
})
```

### Testing Error States

```javascript
it('displays error message on API failure', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error: 'Invalid credentials' })
  })

  render(<Login />)
  
  // Trigger error
  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
  })
})
```

### Testing Loading States

```javascript
it('shows loading state during API call', async () => {
  fetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves

  render(<Login />)
  
  // Trigger action that causes loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

### Testing Conditional Rendering

```javascript
it('renders different content based on state', () => {
  const { rerender } = render(<App user={null} />)
  expect(screen.getByText(/login/i)).toBeInTheDocument()

  rerender(<App user={{ id: 1, username: 'test' }} />)
  expect(screen.getByText(/welcome/i)).toBeInTheDocument()
})
```

---

## Troubleshooting

### Tests Not Running

**Problem:** Tests don't run or show errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Mock Not Working

**Problem:** `fetch` mock doesn't work

**Solution:**
```javascript
// Make sure to clear mocks between tests
beforeEach(() => {
  fetch.mockClear()
})
```

### Async Test Failing

**Problem:** Test fails with "act" warnings or timing issues

**Solution:**
```javascript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Component Not Rendering

**Problem:** Component doesn't render in test

**Solution:**
- Check if component has required props
- Verify imports are correct
- Check for console errors

### Coverage Not Generating

**Problem:** Coverage report not showing

**Solution:**
```bash
# Install coverage provider
npm install --save-dev @vitest/coverage-v8

# Run with coverage
npm run test:coverage
```

---

## Example Test Files

### Login Component Test

See `src/components/Login.test.jsx` for complete example covering:
- Form rendering
- User input handling
- API calls
- Error states
- Loading states
- Callback functions

### Signup Component Test

See `src/components/Signup.test.jsx` for:
- Form validation
- Password matching
- Field requirements
- Success/error handling

### UserInfo Component Test

See `src/components/UserInfo.test.jsx` for:
- Data display
- Conditional rendering
- User interactions

### App Component Test

See `src/App.test.jsx` for:
- Authentication flow
- Component switching
- State management

#### Complete Example: Testing Logout Flow

This example demonstrates testing a complete user flow: login → logout. It shows how to:
- Mock multiple API calls in sequence
- Test async state updates
- Verify component switching

```javascript
it('handles logout correctly', async () => {
  // STEP 1: Setup user event simulator
  const user = userEvent.setup()
  
  // STEP 2: Create mock user data
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com'
  }

  // STEP 3: Mock initial auth check API call
  // When App mounts, useEffect calls checkAuth() which fetches '/api/auth/user/'
  // This mock returns the user data, simulating an authenticated user
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockUser
  })

  // STEP 4: Render App component
  // App mounts → useEffect runs → checkAuth() called → fetch('/api/auth/user/')
  // Mock returns mockUser → setUser(mockUser) → Component re-renders → Shows UserInfo
  render(<App />)
  
  // STEP 5: Wait for authentication to complete
  // waitFor waits until "Welcome" text appears, confirming user is logged in
  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })

  // STEP 6: Mock logout API call (SETUP BEFORE ACTION)
  // ⚠️ IMPORTANT: Mock is set up NOW, but will be USED when logout button is clicked
  // When handleLogout() calls fetch('/api/auth/logout/'), this mock will intercept it
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({})
  })

  // STEP 7: Find logout button
  const logoutButton = screen.getByRole('button', { name: /logout/i })
  
  // STEP 8: Click logout button (TRIGGERS MOCK)
  // onClick fires → handleLogout() called → fetch('/api/auth/logout/') called
  // Mock intercepts fetch → returns success → setUser(null) → Component re-renders → Shows Login
  await user.click(logoutButton)

  // STEP 9: Verify logout was successful
  // waitFor waits for login form to appear and welcome message to disappear
  await waitFor(() => {
    // Login form should be visible (username field exists)
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    // Welcome message should be gone (UserInfo component removed)
    expect(screen.queryByText(/welcome, testuser/i)).not.toBeInTheDocument()
  }, { timeout: 3000 })
})
```

**What Happens Step-by-Step:**

1. **Setup**: Create user simulator and mock user data
2. **Mock Auth Check**: Prepare mock for initial authentication API call
3. **Render**: App component mounts and checks authentication
4. **Wait for Auth**: Verify user is logged in (Welcome text appears)
5. **Mock Logout**: Prepare mock for logout API call (before clicking)
6. **Find Button**: Locate logout button on screen
7. **Click Button**: Simulate user clicking logout
   - This triggers `handleLogout()`
   - Which calls `fetch('/api/auth/logout/')`
   - Our mock intercepts and returns success
   - `setUser(null)` is called
   - Component re-renders with login form
8. **Verify**: Check that login form appears and welcome message disappears

**Key Concepts Demonstrated:**

- **Mock Setup Before Action**: Mock is prepared before the action that triggers it
- **Sequential Mocks**: `mockResolvedValueOnce` handles multiple fetch calls in order
- **Async State Updates**: Using `waitFor` to handle React state updates
- **Component Switching**: Testing that UI changes based on state (UserInfo → Login)

---

## CI/CD Integration

### Running Tests in CI

Add to your CI pipeline (e.g., Jenkinsfile):

```groovy
stage('Test Frontend') {
  steps {
    dir('frontend') {
      sh 'npm install'
      sh 'npm test -- --run'
    }
  }
}
```

### Skipping Tests

To skip tests during build:

```bash
SKIP_TESTS=true npm run build
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

## Quick Reference

```bash
# Run tests
npm test

# Run once
npm test -- --run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- Login

# Run tests matching pattern
npm test -- --grep "renders"
```

---

**Happy Testing!** 🧪✨

