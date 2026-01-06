# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Make sure Docker is running
Open Docker Desktop and wait until it's fully started.

### Step 2: Build and start containers
```bash
docker-compose up --build
```

This will:
- Download PostgreSQL image
- Build Django application image
- Create database tables
- Start the server on http://localhost:8000

### Step 3: Test the API

**Register a new user:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"testuser\", \"email\": \"test@example.com\", \"password\": \"test123\", \"password2\": \"test123\"}"
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"username\": \"testuser\", \"password\": \"test123\"}"
```

**Get current user:**
```bash
curl -X GET http://localhost:8000/api/auth/user/ \
  -b cookies.txt
```

## 📖 Learn More

See `README.md` for detailed explanations of:
- How Django works
- How Docker works
- Project structure
- API endpoints
- Troubleshooting

## 🛑 Stop the Application

Press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

