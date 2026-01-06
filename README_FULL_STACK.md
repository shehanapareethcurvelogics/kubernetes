# Full Stack Django + React Authentication App

A complete full-stack application with Django REST API backend and React frontend.

## 📁 Project Structure

```
kubernetes/
├── backend/                 # Django Backend
│   ├── authentication/     # Auth app
│   ├── django_auth_project/ # Django project settings
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── UserInfo.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── docker-compose.yml      # Docker orchestration
```

## 🚀 Quick Start

### Option 1: Run Everything with Docker (Recommended) ✅

```bash
# Start everything (backend + frontend + database)
docker-compose up --build
```

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:8000

**That's it!** Everything runs in Docker containers.

### Option 2: Development Mode (Hot Reload)

```bash
# Start backend and database
docker-compose up db backend

# In another terminal, start frontend locally
cd frontend
npm install
npm run dev
```

**Frontend:** http://localhost:5173 (Vite dev server)  
**Backend:** http://localhost:8000

### Option 2: Run Locally (Without Docker)

#### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Features

### Backend (Django)
- ✅ User Registration API
- ✅ User Login API
- ✅ Get Current User API
- ✅ Logout API
- ✅ Session-based authentication
- ✅ PostgreSQL database
- ✅ CORS configured for React frontend

### Frontend (React)
- ✅ Beautiful signup page
- ✅ Login page
- ✅ User info display
- ✅ Session management
- ✅ Error handling
- ✅ Responsive design

## 📡 API Endpoints

All endpoints are prefixed with `/api/auth/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/register/` | POST | Create new user account |
| `/login/` | POST | Authenticate user |
| `/user/` | GET | Get current user info |
| `/logout/` | POST | Logout user |

See `API_DOCUMENTATION.md` for detailed API docs.

## 🧪 Testing the App

1. **Start Backend:**
   ```bash
   docker-compose up
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser:**
   - Go to http://localhost:5173
   - Click "Sign up" to create an account
   - Fill out the form and submit
   - You'll be automatically logged in
   - See your user information displayed
   - Click "Logout" to log out

## 🔧 Configuration

### Backend CORS Settings
Already configured in `backend/django_auth_project/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
]
```

### Frontend Proxy
Configured in `frontend/vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

## 📝 Development

### Backend Development
- Django runs on port 8000
- Hot reload enabled (code changes reflect immediately)
- Database migrations: `docker-compose exec backend python manage.py migrate`

### Frontend Development
- React runs on port 5173
- Hot reload enabled
- Uses Vite for fast development

## 🐳 Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs db

# Execute commands in backend
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py migrate
```

## 📚 Documentation

- **Backend API:** See `API_DOCUMENTATION.md`
- **Frontend:** See `frontend/README.md`
- **Docker:** See `HOW_TO_BUILD_IMAGE.md`

## 🎨 UI Preview

### Signup Page
- Clean form with username, email, password fields
- Optional first name and last name
- Password confirmation
- Error messages for validation

### Login Page
- Simple username/password form
- Error handling for invalid credentials
- Link to signup page

### User Info Page
- Displays user ID, username, email
- Shows first name and last name if provided
- Logout button
- Beautiful card layout

## 🔐 Security Notes

- Passwords are hashed (never stored in plain text)
- Session-based authentication
- CORS configured for specific origins
- CSRF protection enabled

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Make sure backend is running on port 8000
- Check CORS settings in Django
- Verify proxy configuration

### Database errors
- Run migrations: `docker-compose exec backend python manage.py migrate`
- Check database container is running: `docker-compose ps`

### Port already in use
- Change ports in `docker-compose.yml` or `vite.config.js`

## 📦 Technologies Used

### Backend
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- Docker

### Frontend
- React 18
- Vite
- CSS (no framework)

## 🎓 Learning Resources

- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- React: https://react.dev/
- Vite: https://vite.dev/

---

**Happy Coding!** 🚀

