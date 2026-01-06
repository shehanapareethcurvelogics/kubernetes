# React Frontend - Django Auth App

A modern React frontend built with Vite for the Django authentication API.

## Features

- ✅ User Registration (Signup)
- ✅ User Login
- ✅ User Info Display
- ✅ Session Management
- ✅ Beautiful UI with gradient design

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login component
│   │   ├── Signup.jsx         # Signup component
│   │   └── UserInfo.jsx       # User info display component
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styles
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## API Integration

The frontend connects to the Django backend API at `http://localhost:8000/api/auth/`

### Endpoints Used:

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/user/` - Get current user
- `POST /api/auth/logout/` - User logout

## Features

### 1. Signup Page
- Username, email, password fields
- Password confirmation
- Optional first name and last name
- Form validation
- Auto-login after successful registration

### 2. Login Page
- Username and password fields
- Error handling
- Session management

### 3. User Info Page
- Displays user information
- Shows ID, username, email, name
- Logout button

## Development

The app uses:
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS** - Styling (no framework)

## Proxy Configuration

Vite is configured to proxy API requests to the Django backend:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

This allows the frontend to make requests to `/api/auth/...` which are automatically forwarded to `http://localhost:8000/api/auth/...`

## CORS

Make sure Django CORS settings allow requests from `http://localhost:5173` (already configured in `backend/django_auth_project/settings.py`)

## Troubleshooting

### API requests failing
- Make sure Django backend is running on port 8000
- Check CORS settings in Django
- Verify proxy configuration in `vite.config.js`

### Session not persisting
- Make sure `credentials: 'include'` is set in fetch requests (already configured)
- Check browser console for CORS errors

