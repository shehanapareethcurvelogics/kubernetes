# Learning Guide: Django, Docker, and REST APIs

## 🎯 What You're Building

A **REST API** (Application Programming Interface) that allows:
- Users to **register** (create accounts)
- Users to **login** (authenticate)
- Users to **view their profile** (get current user info)

All running in **Docker containers** for easy setup.

---

## 📚 Key Concepts Explained

### 1. What is Django?

**Django** is a Python web framework - a toolkit for building web applications.

**Think of it like this:**
- **Without Django**: You write everything from scratch (HTTP handling, database connections, etc.)
- **With Django**: Django provides pre-built components, you just configure them

**Django follows MVT pattern:**
- **Model**: Database structure (tables, columns)
- **View**: Request handlers (what happens when someone visits a URL)
- **Template**: HTML pages (we're building API, so we skip this)

### 2. What is Docker?

**Docker** packages your application and all its dependencies into a **container**.

**Real-world analogy:**
- **Without Docker**: Like moving houses - you pack everything separately, things might break
- **With Docker**: Like a shipping container - everything is packaged together, works anywhere

**Why Docker?**
- ✅ Works the same on Windows, Mac, Linux
- ✅ No need to install Python, PostgreSQL, etc. on your computer
- ✅ Easy to share with others
- ✅ Isolated from your system

### 3. What is a REST API?

**REST API** is a way for applications to communicate over HTTP.

**Think of it like a restaurant:**
- **Menu (API endpoints)**: List of available dishes (actions)
- **Order (Request)**: You tell waiter what you want
- **Food (Response)**: Waiter brings you the dish

**HTTP Methods:**
- `GET`: Retrieve data (like viewing a page)
- `POST`: Create new data (like submitting a form)
- `PUT`: Update existing data
- `DELETE`: Remove data

---

## 🏗️ How Your Application Works

### Request Flow (Step by Step)

```
1. User sends request
   ↓
   POST http://localhost:8000/api/auth/register/
   Body: {"username": "john", "password": "pass123"}

2. Django receives request
   ↓
   Checks urls.py → Finds matching URL pattern

3. Calls the view function
   ↓
   register_user(request) in views.py

4. View uses serializer
   ↓
   UserRegistrationSerializer validates data
   - Checks if username exists
   - Checks if passwords match
   - Validates email format

5. If valid, creates user
   ↓
   User.objects.create_user() saves to database

6. Returns response
   ↓
   JSON: {"message": "User registered successfully", "user": {...}}
```

### File Responsibilities

| File | Purpose | Example |
|------|---------|---------|
| `urls.py` | Maps URLs to views | `/register/` → `register_user()` |
| `views.py` | Handles requests | Receives data, processes it, returns response |
| `serializers.py` | Validates & converts data | JSON ↔ Python objects |
| `models.py` | Database structure | User table with username, email fields |
| `settings.py` | Configuration | Database connection, installed apps |

---

## 🐳 Docker Deep Dive

### What Happens When You Run `docker-compose up`?

```
1. Docker reads docker-compose.yml
   ↓
2. Creates a network (containers can talk to each other)
   ↓
3. Starts PostgreSQL container (db service)
   - Downloads postgres:15-alpine image
   - Creates database: django_auth_db
   - Exposes port 5432
   ↓
4. Builds Django image (web service)
   - Reads Dockerfile
   - Installs Python packages from requirements.txt
   - Copies your code
   ↓
5. Starts Django container
   - Connects to database
   - Runs migrations (creates tables)
   - Starts server on port 8000
```

### Docker Commands Explained

```bash
# Build and start
docker-compose up --build
# --build: Rebuild images even if they exist

# Start in background
docker-compose up -d
# -d: Detached mode (runs in background)

# Stop containers
docker-compose down
# Stops and removes containers

# View logs
docker-compose logs web
# Shows output from Django container

# Execute command in container
docker-compose exec web python manage.py createsuperuser
# Runs command inside running container
```

---

## 🔐 Authentication Explained

### How Login Works

```
1. User sends username + password
   ↓
2. Django's authenticate() function checks credentials
   ↓
3. If valid:
   - Creates a session (like a temporary ID card)
   - Stores session ID in cookie
   - Returns user data
   ↓
4. Next requests include cookie
   ↓
5. Django recognizes user from session
```

### Session vs Token Authentication

**Session (What we're using):**
- Server stores session data
- Cookie sent with each request
- Good for web apps

**Token (JWT - Advanced):**
- Token stored on client
- Sent in Authorization header
- Good for mobile apps, SPAs

---

## 📝 Code Walkthrough

### Example: Registration Endpoint

**1. URL Pattern** (`authentication/urls.py`):
```python
path('register/', views.register_user, name='register')
```
- When someone visits `/api/auth/register/`, call `register_user` function

**2. View Function** (`authentication/views.py`):
```python
@api_view(['POST'])  # Only allow POST requests
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    # request.data = JSON from frontend
    
    if serializer.is_valid():
        user = serializer.save()  # Creates user in database
        return Response({'message': 'Success'}, status=201)
    
    return Response(serializer.errors, status=400)
```

**3. Serializer** (`authentication/serializers.py`):
```python
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(...)  # Confirm password field
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        # Remove password2, create user with hashed password
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)
```

**What happens:**
1. Serializer validates data (passwords match, email valid, etc.)
2. If valid, `create()` method runs
3. `create_user()` hashes password automatically
4. User saved to database
5. Response sent back

---

## 🗄️ Database Concepts

### What are Migrations?

**Migrations** are like version control for your database schema.

**Example:**
```python
# You create a model
class User(models.Model):
    username = models.CharField(max_length=100)

# Django creates migration file
# 0001_initial.py: Create User table with username column

# You run migration
python manage.py migrate

# Database now has User table!
```

**Why migrations?**
- Track database changes
- Apply changes consistently
- Rollback if needed

### Django ORM (Object-Relational Mapping)

**ORM** lets you interact with database using Python code instead of SQL.

**Instead of SQL:**
```sql
SELECT * FROM users WHERE username = 'john';
```

**Django ORM:**
```python
User.objects.filter(username='john')
```

**Common operations:**
```python
# Create
user = User.objects.create(username='john', email='john@example.com')

# Read
user = User.objects.get(username='john')  # Get one
users = User.objects.all()  # Get all
users = User.objects.filter(email__contains='@gmail.com')  # Filter

# Update
user.email = 'newemail@example.com'
user.save()

# Delete
user.delete()
```

---

## 🧪 Testing Your Understanding

### Exercise 1: Add a Field
Add `phone_number` to registration:
1. Modify `UserRegistrationSerializer` in `serializers.py`
2. Add `phone_number` to `fields` list
3. Test registration with phone number

### Exercise 2: Create New Endpoint
Create `/api/auth/logout/` endpoint:
1. Add URL pattern in `urls.py`
2. Create `logout_user` function in `views.py`
3. Use Django's `logout()` function

### Exercise 3: Add Validation
Add custom validation:
- Username must be at least 5 characters
- Password must contain at least one number

---

## 📖 Next Steps

1. **Read Django Tutorial**: https://docs.djangoproject.com/en/4.2/intro/tutorial01/
2. **Django REST Framework**: https://www.django-rest-framework.org/tutorial/quickstart/
3. **Docker Tutorial**: https://docs.docker.com/get-started/
4. **Practice**: Modify endpoints, add new features

---

## ❓ Common Questions

**Q: Why use PostgreSQL instead of SQLite?**
A: PostgreSQL is production-ready, supports concurrent connections, better for Docker setup.

**Q: What's the difference between `docker-compose up` and `docker-compose up --build`?**
A: `--build` rebuilds images even if they exist. Use it when you change Dockerfile or requirements.txt.

**Q: Can I use this without Docker?**
A: Yes! Install Python, PostgreSQL, and run `python manage.py runserver`. But Docker makes it easier.

**Q: How do I add more endpoints?**
A: Add URL pattern → Create view function → Create serializer (if needed) → Test!

**Q: What's the difference between `@api_view` and class-based views?**
A: `@api_view` is function-based (simpler), class-based views are more powerful but complex. Start with `@api_view`.

---

Happy Learning! 🎓

