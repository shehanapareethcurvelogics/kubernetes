"""
URL patterns for authentication app.

This file defines the routes (URLs) for authentication endpoints.
"""

from django.urls import path
from . import views

# app_name helps avoid URL name conflicts
app_name = 'authentication'

urlpatterns = [
    # path(route, view, name)
    # route: URL pattern (relative to /api/auth/)
    # view: function to call when URL is accessed
    # name: unique name for this URL (useful for reverse URL lookup)
    
    path('register/', views.register_user, name='register'),
    # Full URL: http://localhost:8000/api/auth/register/
    
    path('login/', views.login_user, name='login'),
    # Full URL: http://localhost:8000/api/auth/login/
    
    path('user/', views.get_current_user, name='current_user'),
    # Full URL: http://localhost:8000/api/auth/user/
    
    path('logout/', views.logout_user, name='logout'),
    # Full URL: http://localhost:8000/api/auth/logout/
]

