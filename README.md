# Django Authentication API with Docker

A complete Django REST API application with user registration and login endpoints, containerized with Docker.

## 📚 Table of Contents

1. [What is This Project?](#what-is-this-project)
2. [Prerequisites](#prerequisites)
3. [Project Structure Explained](#project-structure-explained)
4. [Step-by-Step Setup](#step-by-step-setup)
5. [Understanding Docker](#understanding-docker)
6. [Understanding Django](#understanding-django)
7. [API Endpoints](#api-endpoints)
8. [Testing the API](#testing-the-api)
9. [Common Commands](#common-commands)

---

## What is This Project?

This is a **Django REST API** that provides:
- **User Registration**: Create new user accounts
- **User Login**: Authenticate existing users
- **Get Current User**: Retrieve logged-in user information

All running in **Docker containers** for easy setup and deployment.

---

## Prerequisites

Before starting, make sure you have installed:

1. **Docker Desktop** (includes Docker and Docker Compose)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify installation: `docker --version` and `docker-compose --version`

2. **Git** (optional, for version control)
   - Download: https://git-scm.com/downloads

---

## Project Structure Explained

```
django-auth-project/
│
├── authentication/              # Django app (module) for authentication
│   ├── __init__.py             # Makes Python treat this as a package
│   ├── admin.py                # Django admin configuration
│   ├── apps.py                 # App configuration
│   ├── models.py               # Database models (tables)
│   ├── serializers.py          # Convert data to/from JSON
│   ├── urls.py                 # URL routes for this app
│   └── views.py                # Request handlers (endpoints)
│
├── django_auth_project/        # Main Django project folder
│   ├── __init__.py
│   ├── settings.py             # Project configuration
│   ├── urls.py                 # Main URL routing
│   └── wsgi.py                 # WSGI config for deployment
│
├── .dockerignore               # Files to exclude from Docker build
├── Dockerfile                  # Instructions to build Docker image
├── docker-compose.yml          # Multi-container setup configuration
├── manage.py                   # Django's command-line utility
├── requirements.txt            # Python package dependencies
└── README.md                   # This file
```

### Key Concepts:

- **Django Project**: The entire application (`django_auth_project/`)
- **Django App**: A module/component (`authentication/`)
- **Docker Image**: A snapshot of your application
- **Docker Container**: A running instance of an image

---

## Step-by-Step Setup

### Step 1: Create Project Directory

```bash
mkdir django-auth-project
cd django-auth-project
```

### Step 2: Create Files

All files are already created in this project! But here's what each does:

#### **requirements.txt**
Lists all Python packages needed:
- `Django`: Web framework
- `djangorestframework`: For building REST APIs
- `django-cors-headers`: Allow frontend to make requests
- `psycopg2-binary`: PostgreSQL database adapter

#### **Dockerfile**
Step-by-step instructions to build your application image:
1. Start with Python 3.11
2. Set working directory
3. Install dependencies
4. Copy code
5. Expose port 8000
6. Run migrations and start server

#### **docker-compose.yml**
Orchestrates multiple containers:
- **db service**: PostgreSQL database
- **web service**: Django application

### Step 3: Build and Run with Docker

```bash
# Build images and start containers
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

**What happens:**
1. Docker reads `docker-compose.yml`
2. Pulls PostgreSQL image
3. Builds Django image from `Dockerfile`
4. Creates network between containers
5. Starts both containers
6. Django runs migrations (creates database tables)
7. Server starts on http://localhost:8000

### Step 4: Verify It's Working

Open your browser: http://localhost:8000

You should see Django's default page or an error (which is normal - we haven't created a homepage).

---

## Understanding Docker

### What is Docker?

Docker packages your application and its dependencies into a **container** - a lightweight, portable environment that runs the same way everywhere.

### Key Docker Concepts:

1. **Image**: A template/blueprint (like a class in programming)
   - Example: `python:3.11-slim`, `postgres:15-alpine`

2. **Container**: A running instance of an image (like an object)
   - Multiple containers can run from the same image

3. **Dockerfile**: Instructions to build an image
   ```
   FROM python:3.11-slim    # Start with this base image
   WORKDIR /app              # Set working directory
   COPY . .                  # Copy files
   RUN pip install ...       # Install packages
   CMD python app.py         # Run this command
   ```

4. **docker-compose.yml**: Defines multiple containers and how they connect
   - Services (containers)
   - Networks (how containers communicate)
   - Volumes (persistent storage)

### Why Use Docker?

- **Consistency**: Works the same on Windows, Mac, Linux
- **Isolation**: Each app has its own environment
- **Easy Setup**: No need to install Python, PostgreSQL, etc. on your machine
- **Portability**: Run anywhere Docker is installed

---

## Understanding Django

### What is Django?

Django is a Python web framework that follows the **MVC (Model-View-Controller)** pattern, called **MVT (Model-View-Template)** in Django.

### Django Architecture:

1. **Models** (`models.py`): Define database structure
   ```python
   class User(models.Model):
       username = models.CharField(max_length=100)
       email = models.EmailField()
   ```

2. **Views** (`views.py`): Handle requests and return responses
   ```python
   def register_user(request):
       # Process registration
       return Response({'message': 'Success'})
   ```

3. **URLs** (`urls.py`): Map URLs to views
   ```python
   path('register/', views.register_user)
   ```

4. **Serializers** (`serializers.py`): Convert between Python objects and JSON
   ```python
   class UserSerializer(serializers.ModelSerializer):
       class Meta:
           model = User
           fields = ['username', 'email']
   ```

### Request Flow:

```
1. User sends request → http://localhost:8000/api/auth/register/
2. Django checks urls.py → Finds matching pattern
3. Calls view function → register_user(request)
4. View uses serializer → Validates data
5. View uses model → Saves to database
6. View returns response → JSON data
```

---

## API Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register/`

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "password2": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

**Success Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
}
```

**Error Response (400):**
```json
{
    "password": ["Password fields didn't match."],
    "email": ["Enter a valid email address."]
}
```

### 2. Login User

**Endpoint:** `POST /api/auth/login/`

**Request Body:**
```json
{
    "username": "john_doe",
    "password": "securepassword123"
}
```

**Success Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
}
```

**Error Response (400):**
```json
{
    "non_field_errors": ["Unable to log in with provided credentials."]
}
```

### 3. Get Current User

**Endpoint:** `GET /api/auth/user/`

**Headers:** (Set automatically after login via cookies)
```
Cookie: sessionid=<session_id>
```

**Success Response (200):**
```json
{
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
}
```

---

## Testing the API

### Using cURL (Command Line)

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:8000/api/auth/user/ \
  -b cookies.txt
```

### Using Postman

1. **Register:**
   - Method: POST
   - URL: `http://localhost:8000/api/auth/register/`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
         "username": "testuser",
         "email": "test@example.com",
         "password": "testpass123",
         "password2": "testpass123"
     }
     ```

2. **Login:**
   - Method: POST
   - URL: `http://localhost:8000/api/auth/login/`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
         "username": "testuser",
         "password": "testpass123"
     }
     ```
   - Postman will automatically save cookies

3. **Get Current User:**
   - Method: GET
   - URL: `http://localhost:8000/api/auth/user/`
   - Cookies will be sent automatically

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000/api/auth"

# Register
response = requests.post(f"{BASE_URL}/register/", json={
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "password2": "testpass123"
})
print(response.json())

# Login (creates session)
session = requests.Session()
response = session.post(f"{BASE_URL}/login/", json={
    "username": "testuser",
    "password": "testpass123"
})
print(response.json())

# Get current user (uses session)
response = session.get(f"{BASE_URL}/user/")
print(response.json())
```

---

## Common Commands

### Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs web

# Rebuild after code changes
docker-compose up --build

# Execute command in running container
docker-compose exec web python manage.py createsuperuser

# Access database
docker-compose exec db psql -U django_user -d django_auth_db
```

### Django Commands (inside container)

```bash
# Create superuser (admin)
docker-compose exec web python manage.py createsuperuser

# Create migrations (after model changes)
docker-compose exec web python manage.py makemigrations

# Apply migrations
docker-compose exec web python manage.py migrate

# Access Django shell
docker-compose exec web python manage.py shell

# Collect static files
docker-compose exec web python manage.py collectstatic
```

---

## Learning Path

1. **Understand the Flow:**
   - Request → URL → View → Serializer → Model → Database → Response

2. **Experiment:**
   - Modify serializers to add validation
   - Add new fields to registration
   - Create new endpoints

3. **Read Django Documentation:**
   - https://docs.djangoproject.com/
   - https://www.django-rest-framework.org/

4. **Next Steps:**
   - Add JWT authentication (token-based)
   - Add password reset functionality
   - Add email verification
   - Connect a React frontend

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead of 8000
```

### Database Connection Error
- Make sure `db` service is running: `docker-compose ps`
- Check database credentials in `docker-compose.yml` and `settings.py`

### Module Not Found
- Rebuild containers: `docker-compose up --build`
- Check `requirements.txt` includes the package

---

## Security Notes

⚠️ **This is a development setup!** For production:

1. Change `SECRET_KEY` in `settings.py`
2. Set `DEBUG = False`
3. Configure `ALLOWED_HOSTS` properly
4. Use environment variables for sensitive data
5. Add HTTPS/SSL
6. Use stronger password validation
7. Implement rate limiting
8. Add CSRF protection for API endpoints

---

## License

This project is for educational purposes.

Happy Learning! 🚀

