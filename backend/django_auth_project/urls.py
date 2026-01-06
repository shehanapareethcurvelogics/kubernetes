"""
URL Configuration for django_auth_project

This file maps URLs to views (like a routing table).
When a user visits a URL, Django looks here to find which function to call.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin panel URL (Django's built-in admin interface)
    path('admin/', admin.site.urls),
    
    # Include URLs from authentication app
    # 'api/auth/' means all auth URLs will be prefixed with /api/auth/
    path('api/auth/', include('authentication.urls')),
]

