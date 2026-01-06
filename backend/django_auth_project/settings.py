"""
Django settings for django_auth_project project.

This file contains all configuration for your Django application.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR is the root directory of your project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# This key is used for cryptographic signing (sessions, CSRF tokens, etc.)
SECRET_KEY = 'django-insecure-change-this-in-production-12345'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG=True shows detailed error pages (useful for development)
DEBUG = True

# ALLOWED_HOSTS: List of host/domain names this Django site can serve
# Empty means only localhost. '*' allows all (only for development!)
ALLOWED_HOSTS = ['*']

# Application definition
# INSTALLED_APPS: List of Django applications enabled for this project
INSTALLED_APPS = [
    'django.contrib.admin',           # Admin interface
    'django.contrib.auth',            # Authentication system
    'django.contrib.contenttypes',    # Content type framework
    'django.contrib.sessions',        # Session framework
    'django.contrib.messages',        # Messaging framework
    'django.contrib.staticfiles',     # Static file management
    
    # Third-party apps
    'rest_framework',                 # Django REST Framework for APIs
    'corsheaders',                    # Handle CORS (Cross-Origin Resource Sharing)
    
    # Local apps
    'authentication',                 # Our custom authentication app
]

# MIDDLEWARE: Components that process requests/responses
# They run in order, so order matters!
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Handle CORS headers (must be first)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ROOT_URLCONF: Python module where Django looks for URL patterns
ROOT_URLCONF = 'django_auth_project.urls'

# Templates configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# WSGI_APPLICATION: WSGI config for deployment
WSGI_APPLICATION = 'django_auth_project.wsgi.application'

# Database configuration
# Using PostgreSQL (configured via environment variable or default)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'django_auth_db'),
        'USER': os.environ.get('POSTGRES_USER', 'django_user'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'django_pass'),
        'HOST': os.environ.get('DB_HOST', 'db'),  # 'db' is the service name in docker-compose
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Password validation
# Rules for user passwords (security requirements)
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Allow anyone to access (we'll handle auth in views)
    ],
}

# CORS settings (allow frontend to make requests)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend (Docker)
    "http://localhost:5173",  # Vite dev server (local development)
]

CORS_ALLOW_CREDENTIALS = True

