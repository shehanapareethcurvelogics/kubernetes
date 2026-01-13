# Jenkins CI/CD Pipeline - Complete Beginner Guide

This guide explains everything about Jenkins and the CI/CD pipeline for deploying your Django + React application to Kubernetes.

**Perfect for beginners** - Every term and command explained in simple language.

---

## 📚 Table of Contents

1. [What is Jenkins?](#what-is-jenkins)
2. [What is CI/CD?](#what-is-cicd)
3. [What is a Pipeline?](#what-is-a-pipeline)
4. [Files in This Directory](#files-in-this-directory)
5. [How the Pipeline Works](#how-the-pipeline-works)
6. [Setting Up Jenkins](#setting-up-jenkins)
7. [Understanding the Jenkinsfile](#understanding-the-jenkinsfile)
8. [Common Commands Explained](#common-commands-explained)
9. [Troubleshooting](#troubleshooting)

---

## What is Jenkins?

**Jenkins** is a tool that automates software development tasks. Think of it as a robot that:

- ✅ Watches your code repository (GitHub)
- ✅ Builds your application automatically
- ✅ Runs tests to check if code works
- ✅ Deploys (puts) your app on servers
- ✅ Sends notifications if something breaks

**Simple analogy:** Jenkins is like a factory assembly line that builds and ships your software automatically.

---

## What is CI/CD?

**CI/CD** stands for **Continuous Integration** and **Continuous Deployment**.

### CI (Continuous Integration)
- **What it means:** Every time you push code to GitHub, Jenkins automatically builds and tests it
- **Why it's useful:** Catches bugs early before they reach production
- **Example:** You write code → Push to GitHub → Jenkins tests it → You get notified if tests fail

### CD (Continuous Deployment)
- **What it means:** After tests pass, Jenkins automatically deploys your app to Kubernetes
- **Why it's useful:** No manual deployment needed - everything happens automatically
- **Example:** Tests pass → Jenkins builds Docker images → Deploys to Kubernetes → Your app is live!

**Simple analogy:** CI/CD is like having an assistant who tests your work and then puts it live automatically.

---

## What is a Pipeline?

A **pipeline** is a series of steps that Jenkins follows automatically. Like a recipe:

```
Step 1: Get code from GitHub
Step 2: Build Docker images
Step 3: Run tests
Step 4: Push images to Docker Hub
Step 5: Deploy to Kubernetes
Step 6: Check if everything works
```

**Simple analogy:** A pipeline is like a checklist that Jenkins follows automatically.

---

## Files in This Directory

### `Jenkinsfile`
- **What it is:** The recipe/instructions for Jenkins
- **What it does:** Tells Jenkins what steps to follow
- **Written in:** Groovy (a programming language)
- **Think of it as:** A cooking recipe for Jenkins

### `jenkins-deployment.yaml`
- **What it is:** Kubernetes configuration file
- **What it does:** Defines how to deploy Jenkins itself (NOT USED - we use Helm instead)
- **Status:** Kept for reference only
- **Think of it as:** A blueprint for installing Jenkins

### `README.md` (this file)
- **What it is:** Documentation and guide
- **What it does:** Explains everything you need to know
- **Think of it as:** A user manual

---

## How the Pipeline Works

Here's what happens when Jenkins runs your pipeline:

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Checkout (Get Code)                            │
│  ─────────────────────────────────────────────────────  │
│  Command: git clone https://github.com/...              │
│  What it does: Downloads your code from GitHub          │
│  Why needed: Jenkins needs your code to build it        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: Build Backend (Django)                         │
│  ─────────────────────────────────────────────────────  │
│  Command: docker build -t backend:latest ./backend      │
│  What it does: Creates a Docker image of your Django app│
│  Why needed: Kubernetes needs Docker images to run apps │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: Build Frontend (React)                         │
│  ─────────────────────────────────────────────────────  │
│  Command: docker build -t frontend:latest ./frontend    │
│  What it does: Creates a Docker image of your React app│
│  Why needed: Kubernetes needs Docker images to run apps │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 4: Run Tests                                      │
│  ─────────────────────────────────────────────────────  │
│  Backend: python manage.py test                         │
│  Frontend: npm test                                     │
│  What it does: Checks if your code works correctly      │
│  Why needed: Prevents broken code from being deployed   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 5: Push Images to Docker Hub                     │
│  ─────────────────────────────────────────────────────  │
│  Command: docker push your-username/backend:latest      │
│  What it does: Uploads Docker images to Docker Hub      │
│  Why needed: Makes images available for Kubernetes      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 6: Deploy to Kubernetes                          │
│  ─────────────────────────────────────────────────────  │
│  Command: kubectl apply -f k8s/                         │
│  What it does: Creates pods, services, deployments      │
│  Why needed: Makes your app accessible on the internet   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Step 7: Health Check                                   │
│  ─────────────────────────────────────────────────────  │
│  Command: curl http://localhost:8000/api/auth/health/    │
│  What it does: Checks if app is running correctly      │
│  Why needed: Confirms deployment was successful         │
└─────────────────────────────────────────────────────────┘
```

---

## Setting Up Jenkins

### Step 1: Install Jenkins (Using Helm)

**What is Helm?**
- Helm is a package manager for Kubernetes (like `apt` for Ubuntu or `npm` for Node.js)
- It makes installing complex applications easier

**Commands Explained:**

```bash
# Add Jenkins repository to Helm
helm repo add jenkins https://charts.jenkins.io
# What it does: Tells Helm where to find Jenkins
# Think of it as: Adding a store to your shopping app

# Update Helm repositories
helm repo update
# What it does: Downloads latest information about available packages
# Think of it as: Refreshing your app store

# Install Jenkins
helm install jenkins jenkins/jenkins -n jenkins --create-namespace
# What it does: Installs Jenkins in Kubernetes
# Breakdown:
#   helm install = Install a package
#   jenkins = Name for this installation
#   jenkins/jenkins = Package name (from jenkins repository)
#   -n jenkins = Install in "jenkins" namespace
#   --create-namespace = Create namespace if it doesn't exist
# Think of it as: Installing an app from the app store

# Wait for Jenkins to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s
# What it does: Waits until Jenkins pod is running
# Breakdown:
#   kubectl wait = Wait for something
#   --for=condition=ready = Wait until pod is ready
#   pod = Type of resource to wait for
#   -l app.kubernetes.io/component=jenkins-controller = Select pods with this label
#   -n jenkins = In jenkins namespace
#   --timeout=300s = Stop waiting after 5 minutes
# Think of it as: Waiting for your app to finish installing
```

### Step 2: Get Jenkins Admin Password

**What is this?**
- When Jenkins installs, it creates a random password for the admin user
- You need this password to log in for the first time

**Command Explained:**

```bash
kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password
# What it does: Reads the admin password from inside the Jenkins pod
# Breakdown:
#   kubectl exec = Run a command inside a pod
#   -n jenkins = In jenkins namespace
#   jenkins-0 = Name of the Jenkins pod
#   -c jenkins = In the "jenkins" container (pods can have multiple containers)
#   -- = Separator (everything after this runs inside the pod)
#   cat /run/secrets/additional/chart-admin-password = Read the password file
# Think of it as: Looking inside a locked box to find the key
```

**Output:** You'll see a password like `admin` or a random string. Copy this!

### Step 3: Access Jenkins UI

**Option 1: Port Forward (Recommended)**

```bash
kubectl port-forward -n jenkins svc/jenkins 8080:8080
# What it does: Creates a tunnel from your computer to Jenkins
# Breakdown:
#   kubectl port-forward = Create a network tunnel
#   -n jenkins = In jenkins namespace
#   svc/jenkins = The Jenkins service
#   8080:8080 = Forward port 8080 on your computer to port 8080 in the pod
# Think of it as: Creating a bridge between your computer and Jenkins
# Access: http://localhost:8080
```

**Option 2: NodePort (Alternative)**

```bash
minikube service jenkins -n jenkins
# What it does: Gets the URL to access Jenkins via NodePort
# Breakdown:
#   minikube service = Get service URL
#   jenkins = Service name
#   -n jenkins = In jenkins namespace
# Think of it as: Getting the address of a building
# Output: http://192.168.49.2:XXXXX (a URL you can open)
```

### Step 4: Login to Jenkins

1. Open the URL from Step 3
2. Username: `admin`
3. Password: (from Step 2)
4. Click **Continue** → **Install suggested plugins** → Wait → **Continue as admin**

---

## Understanding the Jenkinsfile

The `Jenkinsfile` is written in **Groovy** (a programming language). Here's what each part means:

### Basic Structure

```groovy
pipeline {
    agent any
    // This means: Run on any available Jenkins agent (worker)
    
    environment {
        // Variables used throughout the pipeline
        DOCKER_REGISTRY = 'shehanapareethcurvelogics'
        // This is your Docker Hub username
    }
    
    stages {
        // List of steps to execute
        stage('Checkout') {
            // Step 1: Get code from GitHub
        }
        stage('Build Backend') {
            // Step 2: Build Django Docker image
        }
        // ... more stages
    }
}
```

### Key Terms Explained

**`pipeline`**
- The main container for all pipeline steps
- Think of it as: The entire recipe

**`agent`**
- Where the pipeline runs (which computer/server)
- `any` = Use any available Jenkins worker
- Think of it as: Which kitchen to use

**`environment`**
- Variables that store values (like your Docker Hub username)
- Think of it as: Ingredients list

**`stages`**
- The main steps of your pipeline
- Think of it as: Steps in a recipe

**`stage`**
- One step in the pipeline
- Think of it as: One step in a recipe (e.g., "Mix ingredients")

**`steps`**
- Commands to execute in a stage
- Think of it as: Specific actions (e.g., "Add 2 cups of flour")

**`sh`**
- Execute a shell command (like running commands in terminal)
- Think of it as: Running a command in your terminal

**`container`**
- Run commands inside a Docker container
- Think of it as: Using a specific tool/environment

---

## Common Commands Explained

### Docker Commands

```bash
# Build a Docker image
docker build -t myapp:latest .
# What it does: Creates a Docker image from a Dockerfile
# Breakdown:
#   docker build = Build command
#   -t myapp:latest = Tag (name) the image as "myapp:latest"
#   . = Build from current directory
# Think of it as: Packaging your app into a box

# Tag a Docker image
docker tag myapp:latest username/myapp:v1.0
# What it does: Creates a copy with a different name/tag
# Breakdown:
#   docker tag = Tag command
#   myapp:latest = Source image
#   username/myapp:v1.0 = New name/tag
# Think of it as: Labeling a box with a different name

# Push to Docker Hub
docker push username/myapp:latest
# What it does: Uploads image to Docker Hub
# Breakdown:
#   docker push = Upload command
#   username/myapp:latest = Image to upload
# Think of it as: Shipping your box to a warehouse

# Login to Docker Hub
docker login -u username -p password
# What it does: Authenticates with Docker Hub
# Breakdown:
#   docker login = Login command
#   -u username = Your Docker Hub username
#   -p password = Your Docker Hub password/token
# Think of it as: Signing in to your account
```

### Kubernetes Commands

```bash
# Apply a manifest (create/update resources)
kubectl apply -f k8s/backend/deployment.yaml
# What it does: Creates or updates Kubernetes resources
# Breakdown:
#   kubectl = Kubernetes command-line tool
#   apply = Create or update command
#   -f k8s/backend/deployment.yaml = Use this file
# Think of it as: Building something from a blueprint

# Get pods (containers)
kubectl get pods -n django-auth-app
# What it does: Lists all running pods
# Breakdown:
#   kubectl get = Get/list command
#   pods = Type of resource (containers)
#   -n django-auth-app = In this namespace
# Think of it as: Checking what's running

# View logs
kubectl logs -n django-auth-app backend-deployment-XXXXX
# What it does: Shows output from a pod
# Breakdown:
#   kubectl logs = View logs command
#   -n django-auth-app = In this namespace
#   backend-deployment-XXXXX = Pod name
# Think of it as: Reading a logbook

# Describe a pod (see details)
kubectl describe pod -n django-auth-app backend-deployment-XXXXX
# What it does: Shows detailed information about a pod
# Breakdown:
#   kubectl describe = Show details command
#   pod = Type of resource
#   -n django-auth-app = In this namespace
#   backend-deployment-XXXXX = Pod name
# Think of it as: Reading a detailed report

# Delete a pod
kubectl delete pod -n django-auth-app backend-deployment-XXXXX
# What it does: Stops and removes a pod
# Breakdown:
#   kubectl delete = Delete command
#   pod = Type of resource
#   -n django-auth-app = In this namespace
#   backend-deployment-XXXXX = Pod name
# Think of it as: Stopping and removing something

# Wait for deployment to be ready
kubectl wait --for=condition=available deployment/backend-deployment -n django-auth-app --timeout=300s
# What it does: Waits until deployment is ready
# Breakdown:
#   kubectl wait = Wait command
#   --for=condition=available = Wait until available
#   deployment/backend-deployment = Deployment name
#   -n django-auth-app = In this namespace
#   --timeout=300s = Stop waiting after 5 minutes
# Think of it as: Waiting for something to finish
```

### Git Commands

```bash
# Clone a repository
git clone https://github.com/username/repo.git
# What it does: Downloads code from GitHub
# Breakdown:
#   git clone = Download command
#   https://github.com/username/repo.git = Repository URL
# Think of it as: Downloading a folder from the internet

# Checkout code
git checkout main
# What it does: Switches to a specific branch
# Breakdown:
#   git checkout = Switch command
#   main = Branch name
# Think of it as: Opening a specific folder
```

---

## Troubleshooting

### Problem: "docker: command not found"

**What it means:** Docker is not installed or not accessible

**Solutions:**
```bash
# Check if Docker is installed
docker --version

# If not installed, install Docker Desktop
# Or ensure Docker socket is mounted in Jenkins pod
```

**Why it happens:** Jenkins needs Docker to build images, but Docker isn't available

---

### Problem: "kubectl: command not found"

**What it means:** kubectl is not installed or not accessible

**Solutions:**
```bash
# Check if kubectl is installed
kubectl version --client

# Install kubectl (see docs.md for instructions)
```

**Why it happens:** Jenkins needs kubectl to deploy to Kubernetes

---

### Problem: "Permission denied"

**What it means:** Jenkins doesn't have permission to do something

**Solutions:**
```bash
# Check RBAC permissions
kubectl auth can-i create pods --as=system:serviceaccount:jenkins:jenkins

# Update ClusterRole (see docs.md section 5)
```

**Why it happens:** Kubernetes requires permissions for actions (security)

---

### Problem: "ImagePullBackOff"

**What it means:** Kubernetes can't download the Docker image

**Solutions:**
```bash
# Check if image exists in Docker Hub
docker pull username/myapp:latest

# Or load image into Minikube
minikube image load username/myapp:latest

# Check image pull policy in deployment.yaml
kubectl get deployment backend-deployment -n django-auth-app -o yaml | grep imagePullPolicy
```

**Why it happens:** Image doesn't exist or Kubernetes can't access it

---

### Problem: Pipeline fails at "Run Tests"

**What it means:** Tests are failing

**Solutions:**
```bash
# Run tests locally to see errors
cd backend && python manage.py test
cd ../frontend && npm test

# Check test logs in Jenkins console output
# Fix failing tests, then push code again
```

**Why it happens:** Your code has bugs or tests are incorrectly written

---

## Key Concepts Summary

| Term | Simple Explanation |
|------|-------------------|
| **Jenkins** | Automation tool that builds and deploys your app |
| **Pipeline** | Series of automated steps |
| **Docker Image** | Package containing your app |
| **Docker Hub** | Online storage for Docker images |
| **Kubernetes** | System for running containers |
| **Pod** | One or more containers running together |
| **Deployment** | Manages pods (creates, updates, deletes) |
| **Service** | Network endpoint to access pods |
| **Namespace** | Isolated area in Kubernetes |
| **kubectl** | Command-line tool for Kubernetes |
| **Helm** | Package manager for Kubernetes |
| **RBAC** | Permissions system in Kubernetes |

---

## Next Steps

1. ✅ Read `docs.md` in the root directory for complete setup guide
2. ✅ Understand the `Jenkinsfile` structure
3. ✅ Practice running commands manually
4. ✅ Monitor pipeline runs in Jenkins UI
5. ✅ Learn to debug failed pipelines

---

**Remember:** Every expert was once a beginner. Take your time, experiment, and don't hesitate to ask questions! 🚀
