# Django Backend Complete Guide - Beginner's Tutorial

## 🎯 What You'll Learn

This guide will teach you **everything** about your Django backend:
- Project structure and organization
- How each file works
- How requests flow through the system
- Key Django concepts
- How authentication works
- Step-by-step code explanations

---

## 📚 Table of Contents

1. [Django Overview](#1-django-overview)
2. [Project Structure](#2-project-structure)
3. [Understanding Each File](#3-understanding-each-file)
4. [Request Flow](#4-request-flow)
5. [Key Concepts Explained](#5-key-concepts-explained)
6. [Code Walkthrough](#6-code-walkthrough)
7. [How Authentication Works](#7-how-authentication-works)
8. [Practice Exercises](#8-practice-exercises)

---

## 1. Django Overview

### What is Django?

**Django** is a Python web framework that makes building web applications easier.

**Think of it like this:**
- **Without Django:** Write everything from scratch (HTTP handling, database, etc.)
- **With Django:** Django provides pre-built components, you just configure them

### Django Architecture (MVT Pattern)

Django uses **MVT** (Model-View-Template):

- **Model** = Database structure (tables, columns)
- **View** = Request handlers (what happens when someone visits a URL)
- **Template** = HTML pages (we're building API, so we skip this)

**For APIs:**
- **Model** = Database structure
- **View** = API endpoints (return JSON)
- **Serializer** = Converts data to/from JSON

---

## 2. Project Structure

### Your Backend Structure:

```
backend/
├── manage.py                    # Django's command-line utility
├── requirements.txt             # Python packages needed
├── Dockerfile                   # Docker configuration
│
├── django_auth_project/        # Main Django project folder
│   ├── __init__.py             # Makes it a Python package
│   ├── settings.py             # ALL configuration (database, apps, etc.)
│   ├── urls.py                 # Main URL routing (entry point)
│   └── wsgi.py                 # For production deployment
│
└── authentication/             # Your custom app (module)
    ├── __init__.py
    ├── models.py               # Database models (tables)
    ├── views.py                # Request handlers (endpoints)
    ├── serializers.py          # JSON converters
    ├── urls.py                 # App-specific URLs
    ├── admin.py                # Admin panel config
    └── migrations/             # Database migration files
```

### Key Concepts:

**Django Project** = The entire application (`django_auth_project/`)
- Contains settings, main URLs, configuration

**Django App** = A module/component (`authentication/`)
- Contains models, views, URLs for a specific feature
- You can have multiple apps in one project

---

## 3. Understanding Each File

### 📄 `manage.py` - Django's Command Center

**Location:** `backend/manage.py`

**What it does:**
- Django's command-line utility
- Used to run commands like `python manage.py runserver`
- Sets up Django environment

**Key Code:**
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_auth_project.settings')
```
**Meaning:** "Use settings from `django_auth_project/settings.py`"

**Common Commands:**
```bash
python manage.py runserver      # Start development server
python manage.py migrate         # Apply database changes
python manage.py createsuperuser # Create admin user
python manage.py shell           # Open Python shell
```

---

### ⚙️ `settings.py` - Configuration File

**Location:** `backend/django_auth_project/settings.py`

**What it does:**
- Contains **ALL** configuration for your Django app
- Database settings, installed apps, middleware, etc.

#### Key Sections:

##### 1. Installed Apps (`INSTALLED_APPS`)
```python
INSTALLED_APPS = [
    'django.contrib.admin',      # Admin panel
    'django.contrib.auth',       # Authentication system
    'rest_framework',            # Django REST Framework
    'authentication',            # Your custom app
]
```
**Meaning:** "These are the apps Django should use"

##### 2. Database Configuration (`DATABASES`)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'django_auth_db',
        'USER': 'django_user',
        'PASSWORD': 'django_pass',
        'HOST': 'db',  # Service name in Docker
        'PORT': '5432',
    }
}
```
**Meaning:** "Connect to PostgreSQL database"

##### 3. REST Framework Settings (`REST_FRAMEWORK`)
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```
**Meaning:** "Use session-based authentication"

##### 4. CORS Settings
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Allow frontend to make requests
]
```
**Meaning:** "Allow requests from these origins"

---

### 🗺️ `urls.py` (Main) - URL Router

**Location:** `backend/django_auth_project/urls.py`

**What it does:**
- Maps URLs to views (like a routing table)
- Entry point for all URLs

**Code Breakdown:**
```python
urlpatterns = [
    path('admin/', admin.site.urls),           # Admin panel
    path('api/auth/', include('authentication.urls')),  # Include auth URLs
]
```

**How it works:**
1. User visits: `http://localhost:8000/api/auth/register/`
2. Django checks `urls.py`
3. Finds `api/auth/` matches
4. Includes `authentication.urls`
5. Checks `authentication/urls.py` for `register/`
6. Calls `views.register_user()`

**Think of:** Like a phone directory - looks up where to route the call

---

### 🗺️ `urls.py` (App) - App URLs

**Location:** `backend/authentication/urls.py`

**What it does:**
- Defines URLs specific to authentication app
- Maps URLs to view functions

**Code Breakdown:**
```python
urlpatterns = [
    path('register/', views.register_user, name='register'),
    # URL pattern → View function → Name
]
```

**How it works:**
- `register/` = URL pattern (relative to `/api/auth/`)
- `views.register_user` = Function to call
- `name='register'` = Name for reverse lookup

**Full URLs:**
- `/api/auth/register/` → `register_user()`
- `/api/auth/login/` → `login_user()`
- `/api/auth/user/` → `get_current_user()`
- `/api/auth/logout/` → `logout_user()`

---

### 🎭 `views.py` - Request Handlers

**Location:** `backend/authentication/views.py`

**What it does:**
- Contains functions that handle HTTP requests
- Processes data and returns responses

#### Function Breakdown:

##### 1. Register User Function

```python
@api_view(['POST'])                    # Only allow POST requests
@permission_classes([AllowAny])        # No authentication required
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    # ↑ Create serializer with incoming JSON data
    
    if serializer.is_valid():           # Check if data is valid
        user = serializer.save()       # Create user in database
        return Response({...}, status=201)  # Return success
    
    return Response(serializer.errors, status=400)  # Return errors
```

**Step-by-step:**
1. **Receive request** with JSON data
2. **Create serializer** with `request.data`
3. **Validate** data (check if passwords match, email valid, etc.)
4. **If valid:** Save user, return success
5. **If invalid:** Return error messages

##### 2. Login User Function

```python
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']  # Get validated user
        login(request, user)                      # Create session
        return Response({...}, status=200)
    
    return Response(serializer.errors, status=400)
```

**Step-by-step:**
1. **Receive** username and password
2. **Validate** credentials
3. **If valid:** Create session (cookie), return user data
4. **If invalid:** Return error

##### 3. Get Current User Function

```python
@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:  # Check if user logged in
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=200)
    else:
        return Response({...}, status=401)  # Unauthorized
```

**Step-by-step:**
1. **Check** if user is authenticated (via session cookie)
2. **If logged in:** Return user data
3. **If not:** Return 401 Unauthorized

---

### 🔄 `serializers.py` - Data Converters

**Location:** `backend/authentication/serializers.py`

**What it does:**
- Converts Python objects ↔ JSON
- Validates incoming data

#### Serializer Breakdown:

##### 1. UserRegistrationSerializer

```python
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', ...)
```

**What it does:**
- **Converts:** JSON → Python User object
- **Validates:** Checks if passwords match, email valid, etc.
- **Creates:** User in database with hashed password

**Key Methods:**

**`validate()` method:**
```python
def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
        raise ValidationError("Passwords don't match")
    return attrs
```
**Purpose:** Custom validation (check passwords match)

**`create()` method:**
```python
def create(self, validated_data):
    validated_data.pop('password2')  # Remove password2
    user = User.objects.create_user(**validated_data)  # Create user
    return user
```
**Purpose:** Create user with hashed password

##### 2. UserLoginSerializer

```python
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    
    def validate(self, attrs):
        user = authenticate(username=..., password=...)
        if not user:
            raise ValidationError("Invalid credentials")
        attrs['user'] = user
        return attrs
```

**What it does:**
- **Validates:** Username and password
- **Authenticates:** Checks if credentials are correct
- **Returns:** User object if valid

##### 3. UserSerializer

```python
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
```

**What it does:**
- **Converts:** User object → JSON
- **Excludes:** Password (for security!)
- **Used:** To return user data in responses

---

### 🗄️ `models.py` - Database Structure

**Location:** `backend/authentication/models.py`

**What it does:**
- Defines database structure (tables, columns)
- Currently uses Django's built-in User model

**Current Code:**
```python
# Using Django's built-in User model
# Provides: username, email, password, first_name, last_name, etc.
```

**Django's User Model includes:**
- `id` - Primary key
- `username` - Unique username
- `email` - Email address
- `password` - Hashed password (never plain text!)
- `first_name`, `last_name` - Optional names
- `is_active` - Account status
- `date_joined` - Registration date

**If you wanted custom fields:**
```python
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=20)
    profile_picture = models.ImageField(upload_to='profiles/')
```

---

## 4. Request Flow

### Complete Request Journey:

#### Example: User Registration

```
1. Frontend sends request
   POST http://localhost:8000/api/auth/register/
   Body: {"username": "alice", "email": "alice@example.com", ...}
   
2. Django receives request
   ↓
   Checks django_auth_project/urls.py
   Finds: path('api/auth/', include('authentication.urls'))
   
3. Routes to authentication app
   ↓
   Checks authentication/urls.py
   Finds: path('register/', views.register_user)
   
4. Calls view function
   ↓
   views.register_user(request)
   Receives: request.data = {"username": "alice", ...}
   
5. Creates serializer
   ↓
   serializer = UserRegistrationSerializer(data=request.data)
   
6. Validates data
   ↓
   serializer.is_valid()
   - Checks passwords match ✓
   - Checks email format ✓
   - Checks username unique ✓
   
7. Creates user
   ↓
   serializer.save()
   - Calls create() method
   - Hashes password
   - Saves to database
   
8. Returns response
   ↓
   Response({
       "message": "User registered successfully",
       "user": {...}
   }, status=201)
   
9. Frontend receives response
   JSON data displayed to user
```

---

## 5. Key Concepts Explained

### 🔐 Authentication vs Authorization

**Authentication** = "Who are you?"
- Login process
- Verifying identity
- Example: Username/password check

**Authorization** = "What can you do?"
- Permission checking
- Access control
- Example: Only admins can delete users

**In your app:**
- **Authentication:** Login endpoint verifies who you are
- **Authorization:** Some endpoints require login (get_current_user)

---

### 🍪 Sessions vs Tokens

**Sessions (What you're using):**
- Server stores session data
- Cookie sent with each request
- Good for web apps
- Example: `sessionid` cookie

**Tokens (JWT - Advanced):**
- Token stored on client
- Sent in Authorization header
- Good for mobile apps, SPAs
- Example: `Authorization: Bearer <token>`

**Your app uses:** Sessions (simpler, good for learning)

---

### 📊 Serializers Explained

**What are serializers?**
- Convert data between formats
- Validate incoming data
- Transform data structure

**Types:**

1. **ModelSerializer**
   - Based on Django model
   - Auto-creates fields from model
   - Example: `UserRegistrationSerializer`

2. **Serializer**
   - Custom fields
   - Not tied to model
   - Example: `UserLoginSerializer`

**Why use serializers?**
- ✅ Automatic validation
- ✅ Clean code
- ✅ Reusable
- ✅ Less code to write

---

### 🗄️ Database Models

**What are models?**
- Python classes representing database tables
- Each attribute = database column
- Django ORM handles SQL automatically

**Example:**
```python
class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=128)
```

**Becomes SQL table:**
```sql
CREATE TABLE auth_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(254),
    password VARCHAR(128)
);
```

**Django ORM:**
```python
# Instead of SQL:
User.objects.create(username="alice", email="alice@example.com")

# Django generates SQL automatically!
```

---

## 6. Code Walkthrough

### Complete Registration Flow:

#### Step 1: Frontend Sends Request
```javascript
// Frontend code
fetch('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify({
        username: 'alice',
        email: 'alice@example.com',
        password: 'pass123',
        password2: 'pass123'
    })
})
```

#### Step 2: Django Receives Request
```python
# views.py - register_user function
def register_user(request):
    # request.data = {
    #     'username': 'alice',
    #     'email': 'alice@example.com',
    #     'password': 'pass123',
    #     'password2': 'pass123'
    # }
```

#### Step 3: Create Serializer
```python
serializer = UserRegistrationSerializer(data=request.data)
# Serializer receives the JSON data
```

#### Step 4: Validate Data
```python
serializer.is_valid()
# This calls:
# 1. validate() method - checks passwords match
# 2. Field validators - checks email format, etc.
# Returns: True if valid, False if invalid
```

#### Step 5: Create User
```python
if serializer.is_valid():
    user = serializer.save()
    # This calls create() method:
    # 1. Removes password2
    # 2. Hashes password
    # 3. Creates user in database
    # 4. Returns User object
```

#### Step 6: Return Response
```python
return Response({
    'message': 'User registered successfully',
    'user': UserSerializer(user).data
}, status=201)
# UserSerializer converts User object → JSON
```

---

## 7. How Authentication Works

### Registration Flow:

```
1. User fills form
   ↓
2. Frontend sends POST /api/auth/register/
   ↓
3. Backend validates data
   ↓
4. Creates user in database
   ↓
5. Returns user data
   ↓
6. Frontend auto-logs in user
```

### Login Flow:

```
1. User enters credentials
   ↓
2. Frontend sends POST /api/auth/login/
   ↓
3. Backend validates credentials
   ↓
4. Creates session (cookie)
   ↓
5. Returns user data + cookie
   ↓
6. Browser saves cookie
```

### Authenticated Request Flow:

```
1. User visits /api/auth/user/
   ↓
2. Browser sends cookie automatically
   ↓
3. Django checks cookie
   ↓
4. Finds session → Gets user
   ↓
5. Sets request.user = User object
   ↓
6. View checks request.user.is_authenticated
   ↓
7. Returns user data
```

### Logout Flow:

```
1. User clicks logout
   ↓
2. Frontend sends POST /api/auth/logout/
   ↓
3. Backend calls logout(request)
   ↓
4. Deletes session
   ↓
5. Cookie becomes invalid
   ↓
6. User logged out
```

---

## 8. Practice Exercises

### Exercise 1: Add a Field

**Task:** Add `phone_number` to registration

**Steps:**
1. Update `UserRegistrationSerializer` in `serializers.py`
2. Add `phone_number` field
3. Test registration with phone number

### Exercise 2: Create New Endpoint

**Task:** Create `/api/auth/profile/` endpoint

**Steps:**
1. Add URL in `authentication/urls.py`
2. Create view function in `views.py`
3. Return user profile data

### Exercise 3: Add Validation

**Task:** Username must be at least 5 characters

**Steps:**
1. Update `UserRegistrationSerializer`
2. Add `min_length` validator
3. Test with short username

---

## 📖 Key Takeaways

1. **Django Project** = Main configuration (`django_auth_project/`)
2. **Django App** = Feature module (`authentication/`)
3. **URLs** = Route requests to views
4. **Views** = Handle requests, return responses
5. **Serializers** = Convert data, validate input
6. **Models** = Database structure
7. **Sessions** = Authentication mechanism

---

## 🎓 Next Steps

1. ✅ Understand project structure
2. ✅ Learn how requests flow
3. ✅ Understand serializers
4. ✅ Learn authentication
5. ⏭️ Practice with exercises
6. ⏭️ Read Django documentation
7. ⏭️ Build new features

---

## 📚 Resources

- **Django Docs:** https://docs.djangoproject.com/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **Django Tutorial:** https://docs.djangoproject.com/en/4.2/intro/tutorial01/

---

**Take your time to understand each concept!** Read through this guide, experiment with the code, and ask questions! 🚀

