# How to Build Docker Image - Step by Step Guide

## 🎯 Quick Answer

**Easiest way (Recommended):**
```bash
docker-compose up --build
```

**Manual way:**
```bash
docker build -t django-auth-app .
```

---

## 📚 Method 1: Using Docker Compose (Recommended)

### Step 1: Open Terminal
Open PowerShell or Command Prompt in your project directory:
```bash
cd D:\kubernetes
```

### Step 2: Build and Start Everything
```bash
docker-compose up --build
```

**What this does:**
- ✅ Builds your Django image from `Dockerfile`
- ✅ Pulls PostgreSQL image
- ✅ Creates containers
- ✅ Starts both services
- ✅ Runs migrations
- ✅ Starts Django server

### Step 3: Check if it's running
Open browser: http://localhost:8000

### Stop containers:
Press `Ctrl+C` or run:
```bash
docker-compose down
```

---

## 🔧 Method 2: Build Image Manually

### Step 1: Build the Image
```bash
docker build -t django-auth-app .
```

**What this does:**
- `docker build` = Build command
- `-t django-auth-app` = Tag/name the image as "django-auth-app"
- `.` = Use Dockerfile in current directory

**What happens:**
```
Step 1/8 : FROM python:3.11-slim
Step 2/8 : ENV PYTHONUNBUFFERED=1
Step 3/8 : WORKDIR /app
Step 4/8 : COPY requirements.txt .
Step 5/8 : RUN pip install --no-cache-dir -r requirements.txt
Step 6/8 : COPY . .
Step 7/8 : EXPOSE 8000
Step 8/8 : CMD python manage.py...
Successfully built abc123def456
Successfully tagged django-auth-app:latest
```

### Step 2: Verify Image was Created
```bash
docker images
```

You should see:
```
REPOSITORY          TAG       IMAGE ID       CREATED         SIZE
django-auth-app     latest    abc123def456   2 minutes ago   500MB
python              3.11-slim def789ghi012   1 week ago      120MB
```

### Step 3: Run the Container
```bash
docker run -p 8000:8000 django-auth-app
```

**Note:** This only runs Django. You'd still need PostgreSQL separately.

---

## 📖 Understanding the Build Process

### What is a Docker Image?
- **Image** = Snapshot/template of your application
- Contains: Python, Django, your code, dependencies
- Like a recipe for making containers

### What is a Container?
- **Container** = Running instance of an image
- Like a running application based on the recipe

### Build Process Explained:

#### Step 1: Base Image
```dockerfile
FROM python:3.11-slim
```
- Downloads Python 3.11 image (if not already downloaded)
- This becomes the foundation

#### Step 2: Set Working Directory
```dockerfile
WORKDIR /app
```
- Creates `/app` directory inside container
- All commands run from here

#### Step 3: Copy Requirements
```dockerfile
COPY requirements.txt .
```
- Copies `requirements.txt` into container
- Docker caches this step (if file doesn't change, skips reinstall)

#### Step 4: Install Dependencies
```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```
- Installs Django, DRF, PostgreSQL adapter, etc.
- Takes a few minutes first time

#### Step 5: Copy Application Code
```dockerfile
COPY . .
```
- Copies all your Django files into container
- `.dockerignore` excludes unnecessary files

#### Step 6: Expose Port
```dockerfile
EXPOSE 8000
```
- Tells Docker: "This app uses port 8000"
- Doesn't actually open it (that's done when running)

#### Step 7: Set Default Command
```dockerfile
CMD python manage.py makemigrations && ...
```
- Command that runs when container starts
- Runs migrations, then starts server

---

## 🚀 Complete Build Commands

### Build Only (Don't Start):
```bash
docker-compose build
```

### Build and Start (Background):
```bash
docker-compose up --build -d
```
- `-d` = Detached mode (runs in background)

### Rebuild Everything (Clean Build):
```bash
docker-compose build --no-cache
docker-compose up
```
- `--no-cache` = Don't use cached layers (slower but clean)

### Build Specific Service:
```bash
docker-compose build web
```
- Only rebuilds the Django app (not database)

---

## 🔍 Troubleshooting

### Problem: "Cannot connect to Docker daemon"
**Solution:** Start Docker Desktop first!

### Problem: "Port 8000 already in use"
**Solution:** 
```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use 8001 instead
```

### Problem: "Build failed - requirements.txt not found"
**Solution:** Make sure you're in the project directory:
```bash
cd D:\kubernetes
docker-compose build
```

### Problem: "Module not found" after build
**Solution:** Rebuild without cache:
```bash
docker-compose build --no-cache
docker-compose up
```

### Problem: "Permission denied"
**Solution (Windows):** Run PowerShell as Administrator

---

## 📊 Build Time Comparison

| Method | Time | What It Does |
|--------|------|--------------|
| `docker-compose up --build` | ~2-5 min | Builds + Starts everything |
| `docker-compose build` | ~2-3 min | Builds only (doesn't start) |
| `docker build -t name .` | ~2-3 min | Builds single image |
| `docker-compose build --no-cache` | ~5-10 min | Clean rebuild (slowest) |

---

## 🎓 Step-by-Step: First Time Build

### 1. Check Docker is Running
```bash
docker --version
# Should show: Docker version 24.x.x
```

### 2. Navigate to Project
```bash
cd D:\kubernetes
```

### 3. Build Everything
```bash
docker-compose up --build
```

### 4. Watch the Output
You'll see:
```
Building web...
Step 1/8 : FROM python:3.11-slim
 ---> Downloading python:3.11-slim...
Step 2/8 : ENV PYTHONUNBUFFERED=1
 ---> Running in abc123
Step 3/8 : WORKDIR /app
 ---> Running in def456
...
Successfully built xyz789
Creating network "kubernetes_default"...
Creating kubernetes_db_1 ...
Creating kubernetes_web_1 ...
web_1  | Running migrations...
web_1  | Operations to perform:
web_1  |   Apply all migrations...
web_1  | Starting development server at http://0.0.0.0:8000/
```

### 5. Test It Works
Open: http://localhost:8000

---

## 💡 Pro Tips

### Tip 1: Build in Background
```bash
docker-compose up --build -d
```
- Runs in background
- Check logs: `docker-compose logs`

### Tip 2: Watch Logs While Building
```bash
docker-compose up --build
```
- See real-time output
- Press `Ctrl+C` to stop

### Tip 3: Build Without Starting
```bash
docker-compose build
docker-compose up  # Start later
```

### Tip 4: Clean Up Old Images
```bash
docker system prune -a
```
- Removes unused images (saves space)
- **Warning:** Removes all unused images!

---

## 📝 Summary

**Easiest way:**
```bash
docker-compose up --build
```

**What it does:**
1. Reads `Dockerfile`
2. Builds Django image
3. Pulls PostgreSQL image
4. Creates containers
5. Starts everything
6. Runs migrations
7. Starts server

**That's it!** Your app is running at http://localhost:8000 🚀

---

## ❓ Common Questions

**Q: Do I need to rebuild every time?**
A: Only if you change `Dockerfile` or `requirements.txt`. Code changes don't need rebuild (thanks to volumes).

**Q: How long does build take?**
A: First time: 2-5 minutes. Later: 10-30 seconds (uses cache).

**Q: Can I build without internet?**
A: No, first build needs internet to download base images. After that, images are cached.

**Q: What if build fails?**
A: Check error message, usually:
- Docker not running
- Wrong directory
- Missing files
- Network issues

---

Happy Building! 🐳

