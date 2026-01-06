# Step 1: Use Python 3.11 as the base image
# This is like installing Python on your computer, but in a container
FROM python:3.11-slim

# Step 2: Set environment variables
# PYTHONUNBUFFERED=1 ensures Python output is sent directly to terminal (no buffering)
# This helps us see logs in real-time
ENV PYTHONUNBUFFERED=1

# Step 3: Set the working directory inside the container
# All commands will run from /app directory
WORKDIR /app

# Step 4: Copy requirements.txt first (Docker caching optimization)
# Docker caches each step. If requirements.txt doesn't change, 
# it won't reinstall packages, making builds faster
COPY requirements.txt .

# Step 5: Install Python dependencies
# pip install reads requirements.txt and installs all listed packages
RUN pip install --no-cache-dir -r requirements.txt

# Step 6: Copy the rest of the application code
# This copies all your Django files into the container
COPY . .

# Step 7: Expose port 8000
# Django runs on port 8000 by default. This tells Docker which port to expose
EXPOSE 8000

# Step 8: Run migrations and start the server
# CMD is the default command that runs when container starts
# makemigrations creates migration files, migrate applies them to database
# runserver starts Django development server
CMD python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000

