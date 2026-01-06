"""
Views handle HTTP requests and return HTTP responses.

Think of views as the "controllers" in MVC pattern:
- Receive request (GET, POST, etc.)
- Process data (validate, save to database, etc.)
- Return response (JSON, HTML, etc.)

In Django REST Framework, we use APIView or ViewSets.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.contrib.auth.models import User

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    User Registration Endpoint
    
    URL: POST /api/auth/register/
    
    Request Body (JSON):
    {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "securepassword123",
        "password2": "securepassword123",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    Response (Success - 201):
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
    
    Response (Error - 400):
    {
        "username": ["This field is required."],
        "password": ["Password fields didn't match."]
    }
    """
    # @api_view(['POST']): Only allow POST requests
    # @permission_classes([AllowAny]): Allow anyone (no authentication required)
    
    serializer = UserRegistrationSerializer(data=request.data)
    # request.data contains the JSON data sent from frontend
    
    if serializer.is_valid():
        # If data is valid, create the user
        user = serializer.save()
        
        # Return success response with user data
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    # If data is invalid, return errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    User Login Endpoint
    
    URL: POST /api/auth/login/
    
    Request Body (JSON):
    {
        "username": "john_doe",
        "password": "securepassword123"
    }
    
    Response (Success - 200):
    {
        "message": "Login successful",
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe"
        }
    }
    
    Response (Error - 400):
    {
        "non_field_errors": ["Unable to log in with provided credentials."]
    }
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        # Get the validated user from serializer
        user = serializer.validated_data['user']
        
        # Log the user in (creates a session)
        login(request, user)
        
        # Return success response
        return Response({
            'message': 'Login successful',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)
    
    # Return validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_current_user(request):
    """
    Get Current User Endpoint (requires authentication)
    
    URL: GET /api/auth/user/
    
    Headers:
    Cookie: sessionid=<session_id>  (set automatically after login)
    
    Response (Success - 200):
    {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    Response (Error - 401):
    {
        "detail": "Authentication credentials were not provided."
    }
    """
    # request.user is automatically set by Django's authentication middleware
    # If user is logged in, it's a User object; otherwise, it's AnonymousUser
    
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(
            {'detail': 'Authentication credentials were not provided.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_user(request):
    """
    User Logout Endpoint
    
    URL: POST /api/auth/logout/
    
    Headers:
    Cookie: sessionid=<session_id>
    
    Response (Success - 200):
    {
        "message": "Logout successful"
    }
    """
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

