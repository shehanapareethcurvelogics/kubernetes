# Django Backend Visual Guide - See How It Works

## 🎨 Visual Diagrams to Understand Django Backend

---

## 📁 Project Structure Diagram

```
backend/
│
├── 📄 manage.py
│   └── Django's command center
│       "Run this to start server, migrate, etc."
│
├── 📦 django_auth_project/     ← MAIN PROJECT
│   │
│   ├── ⚙️ settings.py
│   │   └── ALL configuration
│   │       - Database settings
│   │       - Installed apps
│   │       - CORS settings
│   │
│   ├── 🗺️ urls.py
│   │   └── Main URL router
│   │       "Where should requests go?"
│   │
│   └── 🚀 wsgi.py
│       └── Production deployment
│
└── 📱 authentication/          ← YOUR APP
    │
    ├── 🗄️ models.py
    │   └── Database structure
    │
    ├── 🎭 views.py
    │   └── Request handlers
    │       "What happens when user visits URL?"
    │
    ├── 🔄 serializers.py
    │   └── Data converters
    │       "JSON ↔ Python objects"
    │
    └── 🗺️ urls.py
        └── App URLs
            "Which view for which URL?"
```

---

## 🔄 Request Flow Diagram

### Registration Request Flow:

```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │
       │ POST /api/auth/register/
       │ Body: {"username": "alice", ...}
       │
       ▼
┌─────────────────────────────────┐
│   Django Server                 │
│   (Port 8000)                   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  django_auth_project/urls.py    │
│  "Where should this go?"         │
│                                  │
│  Finds: api/auth/ →              │
│  Includes: authentication.urls   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authentication/urls.py         │
│  "Which function?"              │
│                                  │
│  Finds: register/ →              │
│  Calls: views.register_user()   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authentication/views.py        │
│  register_user(request)         │
│                                  │
│  1. Gets request.data           │
│  2. Creates serializer          │
│  3. Validates data              │
│  4. Creates user                │
│  5. Returns response            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authentication/serializers.py  │
│  UserRegistrationSerializer      │
│                                  │
│  validate() → Check passwords   │
│  create() → Save to database     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Database (PostgreSQL)          │
│                                  │
│  INSERT INTO auth_user          │
│  (username, email, password)    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response (JSON)                │
│  {                              │
│    "message": "Success",        │
│    "user": {...}                │
│  }                              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────┐
│  Frontend   │
│  (React)    │
└─────────────┘
```

---

## 🗄️ Database Structure

### User Table (Django's Built-in):

```
┌─────────────────────────────────┐
│      auth_user Table            │
├─────────────────────────────────┤
│  id (Primary Key)               │
│  username (Unique)              │
│  email                          │
│  password (Hashed!)             │
│  first_name                     │
│  last_name                      │
│  is_active                      │
│  date_joined                    │
└─────────────────────────────────┘

Example Row:
┌────┬──────────┬──────────────────┬──────────┐
│ id │ username │ email            │ password │
├────┼──────────┼──────────────────┼──────────┤
│ 1  │ alice    │ alice@example.com│ pbkdf2...│
└────┴──────────┴──────────────────┴──────────┘
```

**Note:** Password is **hashed** (never stored in plain text!)

---

## 🔐 Authentication Flow Diagram

### Login Process:

```
┌─────────────┐
│   User      │
│  Enters:    │
│  username   │
│  password   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Frontend sends POST request    │
│  /api/auth/login/               │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Backend receives request       │
│  views.login_user()             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Serializer validates:         │
│  - Username exists?             │
│  - Password correct?            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authenticate() function        │
│  Checks database                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  login(request, user)           │
│  Creates session                │
│  Sets cookie                    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Response + Cookie              │
│  Cookie: sessionid=abc123       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────┐
│  Browser    │
│  Saves cookie│
│  User logged in!│
└─────────────┘
```

---

## 📊 Data Flow Diagram

### Registration Data Flow:

```
JSON (Frontend)
    ↓
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "pass123",
  "password2": "pass123"
}
    ↓
Serializer (Converts & Validates)
    ↓
Python Dictionary
    ↓
{
  'username': 'alice',
  'email': 'alice@example.com',
  'password': 'pass123'  # password2 removed
}
    ↓
Model (Saves to Database)
    ↓
User Object
    ↓
{
  id: 1,
  username: 'alice',
  email: 'alice@example.com',
  password: 'pbkdf2...'  # Hashed!
}
    ↓
UserSerializer (Converts back)
    ↓
JSON (Response)
    ↓
{
  "id": 1,
  "username": "alice",
  "email": "alice@example.com"
  # Password excluded!
}
```

---

## 🎯 Component Interaction

```
┌──────────────┐
│   URLs       │
│  (Router)    │
└──────┬───────┘
       │ Routes to
       ▼
┌──────────────┐
│   Views      │
│  (Handler)   │
└──────┬───────┘
       │ Uses
       ▼
┌──────────────┐
│ Serializers  │
│ (Converter)  │
└──────┬───────┘
       │ Works with
       ▼
┌──────────────┐
│   Models     │
│  (Database)  │
└──────────────┘
```

**Flow:**
1. **URLs** receive request
2. **Views** handle request
3. **Serializers** convert/validate data
4. **Models** interact with database

---

## 🔄 Session Management

### How Sessions Work:

```
┌─────────────────────────────────────┐
│  After Login                        │
├─────────────────────────────────────┤
│  Server creates session:            │
│  session_id = "abc123xyz"           │
│  Stores: {session_id: user_id: 1}   │
│                                      │
│  Sends cookie:                      │
│  Set-Cookie: sessionid=abc123xyz    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Browser                            │
│  Saves cookie automatically         │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Next Request                       │
│  Browser sends:                     │
│  Cookie: sessionid=abc123xyz        │
│                                      │
│  Server looks up:                   │
│  Finds: user_id = 1                 │
│  Sets: request.user = User(id=1)    │
└─────────────────────────────────────┘
```

---

## 📝 File Responsibilities

```
┌─────────────────────────────────────┐
│  manage.py                          │
│  "Command center"                   │
│  - Start server                     │
│  - Run migrations                   │
│  - Create admin                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  settings.py                        │
│  "Configuration"                    │
│  - Database config                  │
│  - Installed apps                   │
│  - CORS settings                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  urls.py                            │
│  "Router"                           │
│  - Maps URLs to views              │
│  - Entry point for requests         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  views.py                           │
│  "Request handlers"                 │
│  - Process requests                 │
│  - Return responses                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  serializers.py                     │
│  "Data converters"                  │
│  - JSON ↔ Python                   │
│  - Validate data                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  models.py                          │
│  "Database structure"               │
│  - Define tables                    │
│  - Define columns                   │
└─────────────────────────────────────┘
```

---

## 🎓 Learning Path Visual

```
Step 1: Understand Structure
    ↓
Step 2: Learn URLs (Routing)
    ↓
Step 3: Learn Views (Handlers)
    ↓
Step 4: Learn Serializers (Converters)
    ↓
Step 5: Learn Models (Database)
    ↓
Step 6: Understand Flow
    ↓
Step 7: Practice & Build
```

---

**Use these diagrams to visualize how everything connects!** 🎨

