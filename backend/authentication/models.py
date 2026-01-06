"""
Models define the database structure (tables and columns).

In Django, models are Python classes that represent database tables.
Each attribute of the class represents a database field.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models

# We're using Django's built-in User model
# AbstractUser provides: username, email, password, first_name, last_name, etc.
# Django automatically handles password hashing, authentication, etc.

# For this tutorial, we'll use Django's default User model
# If you need custom fields, you can extend AbstractUser like this:
# class User(AbstractUser):
#     phone_number = models.CharField(max_length=20)
#     profile_picture = models.ImageField(upload_to='profiles/')

