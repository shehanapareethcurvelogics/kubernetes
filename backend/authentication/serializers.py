"""
Serializers convert complex data types (like Django models) to/from JSON.

Think of serializers as translators:
- When sending data to frontend: Python objects → JSON
- When receiving data from frontend: JSON → Python objects

They also validate incoming data (check if email is valid, password is long enough, etc.)
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    ModelSerializer automatically creates serializer fields based on model fields.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}  # Hide password in forms
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='Confirm Password'
    )
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')
        # fields: which fields to include in the serializer
        
    def validate(self, attrs):
        """
        Custom validation: check if passwords match.
        
        attrs is a dictionary containing all the data being validated.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs
    
    def create(self, validated_data):
        """
        Create a new user with hashed password.
        
        validated_data contains only validated, cleaned data.
        """
        # Remove password2 (we don't need to store it)
        validated_data.pop('password2')
        
        # Create user with hashed password
        # User.objects.create_user() automatically hashes the password
        user = User.objects.create_user(**validated_data)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    
    Serializer (not ModelSerializer) because we're not creating/updating a model,
    just validating login credentials.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, attrs):
        """
        Validate username and password.
        
        authenticate() checks if username/password combination is correct.
        Returns User object if valid, None if invalid.
        """
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    'Unable to log in with provided credentials.'
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    'User account is disabled.'
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Must include "username" and "password".'
            )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user data (used to return user info after login).
    """
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        # Exclude password for security!

