"""
WSGI config for django_auth_project project.

WSGI (Web Server Gateway Interface) is a standard interface between
web servers and Python web applications. Used for production deployment.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_auth_project.settings')

application = get_wsgi_application()

