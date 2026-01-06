# Complete API Documentation

## Base URL
```
http://localhost:8000/api/auth/
```

---

## 📋 Table of Contents

1. [Register User](#1-register-user)
2. [Login User](#2-login-user)
3. [Get Current User](#3-get-current-user)

---

## 1. Register User

### Endpoint
```
POST /api/auth/register/
```

### Description
Creates a new user account with registration details.

### Authentication
❌ **Not Required** (Public endpoint)

### Request Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Required Fields:
- `username` (string) - Unique username
- `email` (string) - Valid email address
- `password` (string) - User password
- `password2` (string) - Password confirmation (must match password)

#### Optional Fields:
- `first_name` (string) - User's first name
- `last_name` (string) - User's last name

### Request Payload Examples

#### Minimal Payload:
```json
{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "password2": "password123"
}
```

#### Complete Payload:
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

#### Another Example:
```json
{
    "username": "testuser2024",
    "email": "testuser2024@gmail.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "first_name": "Test",
    "last_name": "User"
}
```

### Success Response (201 Created)
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

### Error Responses

#### 400 Bad Request - Passwords Don't Match:
```json
{
    "password": ["Password fields didn't match."]
}
```

#### 400 Bad Request - Missing Required Fields:
```json
{
    "username": ["This field is required."],
    "email": ["This field is required."],
    "password": ["This field is required."]
}
```

#### 400 Bad Request - Invalid Email:
```json
{
    "email": ["Enter a valid email address."]
}
```

#### 400 Bad Request - Username Already Exists:
```json
{
    "username": ["A user with that username already exists."]
}
```

### cURL Example
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "password2": "password123",
    "first_name": "Alice",
    "last_name": "Smith"
  }'
```

### PowerShell Example
```powershell
$body = @{
    username = "alice"
    email = "alice@example.com"
    password = "password123"
    password2 = "password123"
    first_name = "Alice"
    last_name = "Smith"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/register/" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Python Example
```python
import requests

url = "http://localhost:8000/api/auth/register/"
data = {
    "username": "alice",
    "email": "alice@example.com",
    "password": "password123",
    "password2": "password123",
    "first_name": "Alice",
    "last_name": "Smith"
}

response = requests.post(url, json=data)
print(response.json())
```

---

## 2. Login User

### Endpoint
```
POST /api/auth/login/
```

### Description
Authenticates a user and creates a session. Returns user information upon successful login.

### Authentication
❌ **Not Required** (Public endpoint)

### Request Headers
```
Content-Type: application/json
```

### Request Body (JSON)

#### Required Fields:
- `username` (string) - User's username
- `password` (string) - User's password

### Request Payload Examples

#### Basic Login:
```json
{
    "username": "alice",
    "password": "password123"
}
```

#### Another Example:
```json
{
    "username": "john_doe",
    "password": "securepassword123"
}
```

### Success Response (200 OK)
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "alice",
        "email": "alice@example.com",
        "first_name": "Alice",
        "last_name": "Smith"
    }
}
```

**Note:** After successful login, a session cookie (`sessionid`) is automatically set in your browser/client. Use this cookie for authenticated requests.

### Error Responses

#### 400 Bad Request - Invalid Credentials:
```json
{
    "non_field_errors": ["Unable to log in with provided credentials."]
}
```

#### 400 Bad Request - Missing Fields:
```json
{
    "username": ["This field is required."],
    "password": ["This field is required."]
}
```

#### 400 Bad Request - Account Disabled:
```json
{
    "non_field_errors": ["User account is disabled."]
}
```

### cURL Example
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "alice",
    "password": "password123"
  }'
```

**Note:** `-c cookies.txt` saves the session cookie for future requests.

### PowerShell Example
```powershell
$body = @{
    username = "alice"
    password = "password123"
} | ConvertTo-Json

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$response = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -WebSession $session

# Session cookie is stored in $session
```

### Python Example
```python
import requests

url = "http://localhost:8000/api/auth/login/"
data = {
    "username": "alice",
    "password": "password123"
}

session = requests.Session()
response = session.post(url, json=data)
print(response.json())

# Session cookie is stored in session.cookies
# Use session for subsequent requests
```

---

## 3. Get Current User

### Endpoint
```
GET /api/auth/user/
```

### Description
Retrieves information about the currently authenticated user. Requires a valid session.

### Authentication
✅ **Required** (Protected endpoint)

### Request Headers
```
Cookie: sessionid=<session_id>
```

**Note:** The session cookie is automatically set after login. If using a browser, cookies are sent automatically. For API clients, you need to include the cookie from the login response.

### Request Body
❌ **None** (GET request)

### Success Response (200 OK)
```json
{
    "id": 1,
    "username": "alice",
    "email": "alice@example.com",
    "first_name": "Alice",
    "last_name": "Smith"
}
```

### Error Responses

#### 401 Unauthorized - Not Authenticated:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### cURL Example
```bash
# First login (saves cookie)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "alice", "password": "password123"}'

# Then get current user (uses saved cookie)
curl -X GET http://localhost:8000/api/auth/user/ \
  -b cookies.txt
```

### PowerShell Example
```powershell
# Login first
$loginBody = @{
    username = "alice"
    password = "password123"
} | ConvertTo-Json

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login/" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json" `
    -WebSession $session

# Get current user (uses session)
$user = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/user/" `
    -Method GET `
    -WebSession $session

Write-Output $user
```

### Python Example
```python
import requests

# Login first
session = requests.Session()
login_url = "http://localhost:8000/api/auth/login/"
login_data = {
    "username": "alice",
    "password": "password123"
}
session.post(login_url, json=login_data)

# Get current user (uses session)
user_url = "http://localhost:8000/api/auth/user/"
response = session.get(user_url)
print(response.json())
```

---

## 📊 API Summary Table

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register/` | POST | ❌ No | Create new user account |
| `/api/auth/login/` | POST | ❌ No | Authenticate user and create session |
| `/api/auth/user/` | GET | ✅ Yes | Get current authenticated user info |

---

## 🔐 Authentication Flow

### Step 1: Register
```bash
POST /api/auth/register/
Body: {username, email, password, password2}
Response: User created (201)
```

### Step 2: Login
```bash
POST /api/auth/login/
Body: {username, password}
Response: Session cookie set (200)
```

### Step 3: Access Protected Endpoints
```bash
GET /api/auth/user/
Headers: Cookie: sessionid=<session_id>
Response: User data (200)
```

---

## 📝 Field Requirements

### Registration Fields:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `username` | string | ✅ Yes | Unique, alphanumeric |
| `email` | string | ✅ Yes | Valid email format |
| `password` | string | ✅ Yes | Must match password2 |
| `password2` | string | ✅ Yes | Must match password |
| `first_name` | string | ❌ No | Optional |
| `last_name` | string | ❌ No | Optional |

### Login Fields:

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `username` | string | ✅ Yes | Must exist |
| `password` | string | ✅ Yes | Must be correct |

---

## 🧪 Testing Examples

### Complete Flow Example (cURL):

```bash
# 1. Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "password2": "test123"
  }'

# 2. Login (saves cookie)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'

# 3. Get Current User (uses cookie)
curl -X GET http://localhost:8000/api/auth/user/ \
  -b cookies.txt
```

### Complete Flow Example (Python):

```python
import requests

BASE_URL = "http://localhost:8000/api/auth"

# 1. Register
register_data = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "password2": "test123"
}
response = requests.post(f"{BASE_URL}/register/", json=register_data)
print("Register:", response.json())

# 2. Login (creates session)
session = requests.Session()
login_data = {
    "username": "testuser",
    "password": "test123"
}
response = session.post(f"{BASE_URL}/login/", json=login_data)
print("Login:", response.json())

# 3. Get Current User (uses session)
response = session.get(f"{BASE_URL}/user/")
print("Current User:", response.json())
```

---

## 🌐 Browser Testing (Browsable API)

### Visit these URLs in your browser:

1. **Register**: `http://localhost:8000/api/auth/register/`
   - Fill out the form or use "Raw data" tab
   - Click "POST"

2. **Login**: `http://localhost:8000/api/auth/login/`
   - Enter username and password
   - Click "POST"
   - Cookie is automatically saved

3. **Get User**: `http://localhost:8000/api/auth/user/`
   - Click "GET"
   - Uses saved cookie automatically

---

## ⚠️ Common Errors

### Error: "Password fields didn't match"
**Solution:** Make sure `password` and `password2` are exactly the same.

### Error: "A user with that username already exists"
**Solution:** Choose a different username or login with existing account.

### Error: "Unable to log in with provided credentials"
**Solution:** Check username and password are correct.

### Error: "Authentication credentials were not provided"
**Solution:** Login first to get a session cookie, then use it for protected endpoints.

---

## 📚 Response Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful GET request or login |
| 201 | Created | Successful user registration |
| 400 | Bad Request | Invalid data or validation errors |
| 401 | Unauthorized | Missing or invalid authentication |
| 500 | Internal Server Error | Server-side error |

---

**Happy API Testing!** 🚀

