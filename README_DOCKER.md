# Docker Setup Guide

## 🐳 Running with Docker

### Production Mode (Built React App)

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5433

### Development Mode (Hot Reload)

For development with hot reload:

```bash
# Start backend and database
docker-compose up db backend

# In another terminal, start frontend in dev mode
cd frontend
npm install
npm run dev
```

Or use the dev compose file:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## 📦 Services

### 1. Database (PostgreSQL)
- **Image:** `postgres:15-alpine`
- **Port:** `5433:5432`
- **Volume:** `postgres_data`

### 2. Backend (Django)
- **Build:** `./backend`
- **Port:** `8000:8000`
- **Hot Reload:** Enabled (volume mounted)

### 3. Frontend (React + Nginx)
- **Build:** `./frontend`
- **Port:** `3000:80`
- **Serves:** Built React app via Nginx

## 🔧 Docker Commands

### Start Services
```bash
docker-compose up
```

### Build and Start
```bash
docker-compose up --build
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# Follow logs
docker-compose logs -f backend
```

### Execute Commands
```bash
# Django commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
docker-compose exec backend python manage.py shell

# Frontend commands (if using dev mode)
docker-compose exec frontend npm install
```

### Rebuild Specific Service
```bash
docker-compose build backend
docker-compose build frontend
docker-compose up --no-deps backend  # Start without dependencies
```

## 🏗️ How It Works

### Frontend Dockerfile (Production)

1. **Builder Stage:**
   - Uses Node.js 18
   - Installs dependencies
   - Builds React app (`npm run build`)

2. **Production Stage:**
   - Uses Nginx Alpine
   - Copies built files
   - Serves on port 80

### Nginx Configuration

- Serves React app from `/usr/share/nginx/html`
- Proxies `/api/*` requests to backend
- Handles SPA routing (all routes → index.html)
- Enables gzip compression

### Network

All services are on the same Docker network:
- Frontend can access backend via `http://backend:8000`
- Backend can access database via `db:5432`

## 🚀 Quick Start

```bash
# 1. Clone/navigate to project
cd kubernetes

# 2. Start everything
docker-compose up --build

# 3. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Frontend Can't Connect to Backend
- Check backend is running: `docker-compose ps`
- Check CORS settings in Django
- Verify nginx proxy config

### Rebuild After Code Changes
```bash
# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Rebuild backend
docker-compose build backend
docker-compose up -d backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

## 📝 Development vs Production

### Production (docker-compose.yml)
- Frontend: Built React app served by Nginx
- Backend: Django with hot reload (volume mounted)
- Fast, optimized, ready for deployment

### Development (docker-compose.dev.yml)
- Frontend: Vite dev server with hot reload
- Backend: Django with hot reload
- Slower builds, but instant code changes

## 🎯 Recommended Workflow

### For Development:
```bash
# Terminal 1: Backend + Database
docker-compose up db backend

# Terminal 2: Frontend (local)
cd frontend
npm run dev
```

### For Production Testing:
```bash
docker-compose up --build
# Test at http://localhost:3000
```

---

**Everything runs in Docker!** 🐳

