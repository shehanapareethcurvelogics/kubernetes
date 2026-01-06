# Django Backend Quick Reference Card

## 🚀 Quick Commands

```bash
# Start server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Open Python shell
python manage.py shell
```

---

## 📁 File Locations

| File | Location | Purpose |
|------|----------|---------|
| `manage.py` | `backend/manage.py` | Command-line utility |
| `settings.py` | `backend/django_auth_project/settings.py` | Configuration |
| Main URLs | `backend/django_auth_project/urls.py` | Main routing |
| App URLs | `backend/authentication/urls.py` | App routing |
| Views | `backend/authentication/views.py` | Request handlers |
| Serializers | `backend/authentication/serializers.py` | Data converters |
| Models | `backend/authentication/models.py` | Database structure |

---

## 🔗 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register/` | POST | ❌ | Create account |
| `/api/auth/login/` | POST | ❌ | Login user |
| `/api/auth/user/` | GET | ✅ | Get current user |
| `/api/auth/logout/` | POST | ✅ | Logout user |

---

## 🔑 Key Concepts

### Django Project vs App
- **Project** = Main configuration (`django_auth_project/`)
- **App** = Feature module (`authentication/`)

### MVT Pattern
- **Model** = Database structure
- **View** = Request handler
- **Template** = HTML (not used in API)

### Request Flow
```
URL → View → Serializer → Model → Database
```

---

## 📝 Common Code Patterns

### View Function
```python
@api_view(['POST'])
@permission_classes([AllowAny])
def my_view(request):
    serializer = MySerializer(data=request.data)
    if serializer.is_valid():
        obj = serializer.save()
        return Response({...}, status=201)
    return Response(serializer.errors, status=400)
```

### Serializer
```python
class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ('field1', 'field2')
    
    def validate(self, attrs):
        # Custom validation
        return attrs
    
    def create(self, validated_data):
        # Custom creation
        return MyModel.objects.create(**validated_data)
```

### URL Pattern
```python
path('endpoint/', views.my_view, name='my_view'),
```

---

## 🔐 Authentication

### Check if User Logged In
```python
if request.user.is_authenticated:
    # User is logged in
    user = request.user
else:
    # User not logged in
```

### Login User
```python
from django.contrib.auth import login
login(request, user)
```

### Logout User
```python
from django.contrib.auth import logout
logout(request)
```

---

## 📊 Serializer Types

### ModelSerializer
```python
class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = '__all__'
```
**Use when:** Creating/updating model instances

### Serializer
```python
class MySerializer(serializers.Serializer):
    field1 = serializers.CharField()
    field2 = serializers.IntegerField()
```
**Use when:** Custom validation, not tied to model

---

## 🗄️ Database Operations

### Create
```python
User.objects.create(username='alice', email='alice@example.com')
```

### Read
```python
user = User.objects.get(username='alice')
users = User.objects.all()
users = User.objects.filter(email__contains='@gmail.com')
```

### Update
```python
user.email = 'newemail@example.com'
user.save()
```

### Delete
```python
user.delete()
```

---

## 🎯 Common Patterns

### Success Response
```python
return Response({
    'message': 'Success',
    'data': serializer.data
}, status=status.HTTP_200_OK)
```

### Error Response
```python
return Response({
    'error': 'Something went wrong'
}, status=status.HTTP_400_BAD_REQUEST)
```

### Validation Error
```python
raise serializers.ValidationError({
    'field': ['Error message']
})
```

---

## 🔧 Settings Quick Reference

### Database
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'db_name',
        'USER': 'db_user',
        'PASSWORD': 'db_pass',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True
```

### REST Framework
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

---

## 📚 Common Imports

```python
# Views
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import login, logout

# Serializers
from rest_framework import serializers
from django.contrib.auth.models import User

# Models
from django.db import models
from django.contrib.auth.models import AbstractUser

# URLs
from django.urls import path, include
```

---

## 🐛 Common Errors & Solutions

### "Module not found"
**Solution:** Check `INSTALLED_APPS` in `settings.py`

### "Table doesn't exist"
**Solution:** Run `python manage.py migrate`

### "CSRF verification failed"
**Solution:** Use `@api_view` decorator, check CORS settings

### "Field required"
**Solution:** Check serializer `required=True` or add field to request

---

## 💡 Tips

1. **Always validate** data with serializers
2. **Never store** passwords in plain text (Django does this automatically)
3. **Use sessions** for web apps, tokens for mobile
4. **Check authentication** before accessing protected endpoints
5. **Return proper** HTTP status codes

---

**Keep this reference handy while coding!** 📝

