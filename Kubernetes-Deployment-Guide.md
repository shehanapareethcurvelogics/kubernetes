# Kubernetes Deployment Guide - Complete Setup & Troubleshooting

Complete beginner-friendly guide for deploying Django + React app to Kubernetes using Minikube, Jenkins CI/CD, and Docker Hub.

**Perfect for beginners** - Every step explained with exact commands to copy-paste.

---

## 📋 Table of Contents

1. [Prerequisites Setup](#1-prerequisites-setup)
2. [WSL2 Installation &amp; Configuration](#2-wsl2-installation--configuration)
3. [Docker Desktop Setup](#3-docker-desktop-setup)
4. [kubectl Installation](#4-kubectl-installation)
5. [Minikube Installation](#5-minikube-installation)
6. [Jenkins Setup](#6-jenkins-setup)
7. [Deploy Application](#7-deploy-application)
8. [Access Application](#8-access-application)
9. [View Logs &amp; Monitor](#9-view-logs--monitor)
10. [Troubleshooting](#troubleshooting-commands)

**🔍 Quick Links:**

- [Jenkins Quick Access](#-jenkins-quick-access-most-common-commands) - Most common Jenkins commands
- [Quick Reference](#-quick-reference-copy-paste-commands) - All copy-paste commands

---

## ⚡ Quick Reference (Copy-Paste Commands)

**First Time Setup (Run in order):**

```bash
# 1. Install kubectl (Ubuntu terminal)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/
kubectl version --client

# 2. Install Minikube (Ubuntu terminal)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version

# 3. Start Minikube
minikube start --driver=docker
kubectl get nodes

# 4. Install Helm (Ubuntu terminal)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version

# 5. Install Jenkins
helm repo add jenkins https://charts.jenkins.io && helm repo update
helm install jenkins jenkins/jenkins -n jenkins --create-namespace
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s
```

**Daily Use Commands (Run all commands in WSL/Ubuntu terminal):**

```bash
# Start Minikube
minikube start

# Check cluster status
kubectl cluster-info

# List all nodes
kubectl get node

# List all services
kubectl get services

# Access Jenkins UI (use port 8081 to avoid conflict with frontend)
kubectl port-forward -n jenkins svc/jenkins 8081:8080
# Then open: http://localhost:8081

# Access Frontend (Option 1: Port Forward)
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80
# Then open: http://localhost:8080

# Access Frontend (Option 2: Minikube Service - Auto-opens browser)
minikube service frontend-svc -n django-auth-app

# Access Backend API
kubectl port-forward -n django-auth-app svc/backend-svc 8000:8000
# Then open: http://localhost:8000/api/auth/health/

# View logs
kubectl logs -n django-auth-app -l app=backend -f
```

---

## 🎯 Jenkins Quick Access (Most Common Commands)

**Need to access Jenkins? Start here!**

### Access Jenkins UI

```bash
# Method 1: Port Forward (Recommended - Works Every Time)
kubectl port-forward -n jenkins svc/jenkins 8081:8080
# Keep terminal open!
# Access: http://localhost:8081
```

### Get Jenkins Admin Password

```bash
# Get admin password
kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password
# Username: admin
```

### Check Jenkins Status

```bash
# Check if Jenkins pod is running and ready
kubectl get pods -n jenkins
# Should show: jenkins-0   2/2   Running   0   Xm
# 
# Understanding the "2/2" status:
# - Jenkins Helm chart creates a pod with 2 containers:
#   1. jenkins (main container) - The actual Jenkins server
#   2. jenkins-config (init/config container) - Sets up configuration files
# - "2/2 Ready" = Both containers running successfully ✅
# - "1/2 Ready" = Config container done, Jenkins still starting ⏳
# - "0/2 Ready" = Pod crashed or still initializing ❌
# 
# If shows 0/2 or 1/2, Jenkins is still starting (wait 2-5 minutes)

# Check Jenkins service
kubectl get svc -n jenkins

# Check service endpoints (should show pod IP if ready)
kubectl get endpoints jenkins -n jenkins

# View Jenkins logs
kubectl logs -n jenkins jenkins-0 -c jenkins --tail=50

# Check if Jenkins is listening on port 8080
kubectl exec -n jenkins jenkins-0 -c jenkins -- netstat -tlnp | grep 8080
```

**⚠️ If port-forward shows "Connection refused":**

- Jenkins is still starting up (wait 2-5 minutes)
- Check pod status: `kubectl get pods -n jenkins`
- Wait for `2/2 Running` before trying port-forward again

### Restart Jenkins (If Needed)

```bash
# Restart Jenkins pod
kubectl delete pod jenkins-0 -n jenkins

# Wait for it to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s
```

**📌 Port Reference:**

- Jenkins UI: `http://localhost:8081` (port 8081 to avoid conflict with frontend on 8080)
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`

**For detailed Jenkins setup and troubleshooting, see [Section 6: Jenkins Setup](#6-jenkins-setup)**

---

## 🚀 Quick Start: Access Your Application After Deployment

**⚠️ Important: All commands must be run in WSL/Ubuntu terminal (not PowerShell/CMD)**

After you've deployed your application and started Minikube, follow these steps:

### Step 1: Start Minikube (if not running)

```bash
minikube start
```

### Step 2: Verify Deployment Status

```bash
# Check if all pods are running
kubectl get all -n django-auth-app

# Should show: backend-deployment, frontend-deployment, postgres-deployment all Running
```

### Step 3: Access Your Application

**Frontend (React App) - Choose one method:**

**Method 1: Port Forward (Recommended)**

```bash
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80
# Then open: http://localhost:8080
# Keep terminal open!
```

**Method 2: Minikube Service (Auto-opens browser)**

```bash
minikube service frontend-svc -n django-auth-app
# Automatically opens browser to frontend URL
```

**Backend API (Django)**

```bash
kubectl port-forward -n django-auth-app svc/backend-svc 8000:8000
# Then open: http://localhost:8000/api/auth/health/
# Keep terminal open!
```

### Step 4: Test Your Application

```bash
# Test backend health endpoint
curl http://localhost:8000/api/auth/health/

# Should return: {"status":"healthy","service":"django-auth-backend"}
```

**That's it! Your React + Django app is now accessible.** 🎉

---

## 1. Prerequisites Setup

### What You Need

- Windows 10/11
- Internet connection
- Administrator access

### What We'll Install

1. WSL2 (Windows Subsystem for Linux)
2. Docker Desktop
3. kubectl (Kubernetes command-line tool)
4. Minikube (Local Kubernetes cluster)
5. Helm (Kubernetes package manager)

---

## 2. WSL2 Installation & Configuration

### Step 1: Enable WSL2 on Windows

**Open PowerShell as Administrator** (Right-click → Run as Administrator):

```powershell
# Enable WSL feature
wsl --install

# If command not found, enable manually:
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**Restart your computer** when prompted.

### Step 2: Set WSL2 as Default Version

After restart, open **PowerShell as Administrator**:

```powershell
# Set WSL2 as default
wsl --set-default-version 2

# Verify WSL version
wsl --status
```

### Step 3: Install Ubuntu

```powershell
# List available distributions
wsl --list --online

# Install Ubuntu (if not already installed)
wsl --install -d Ubuntu

# Or download from Microsoft Store: Search "Ubuntu" → Install
```

### Step 4: Configure Ubuntu

1. **Open Ubuntu** (from Start Menu or type `ubuntu` in PowerShell)
2. **Set username and password** when prompted
3. **Update system**:

```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim
```

---

## 3. Docker Desktop Setup

### Step 1: Download Docker Desktop

1. Go to: https://www.docker.com/products/docker-desktop/
2. Download **Docker Desktop for Windows**
3. Run installer
4. **Important**: During installation, check ✅ **"Use WSL 2 instead of Hyper-V"**

### Step 2: Configure Docker Desktop

1. **Open Docker Desktop**
2. Go to **Settings** (gear icon)
3. **General** tab:
   - ✅ Check "Use the WSL 2 based engine"
4. **Resources → WSL Integration**:
   - ✅ Enable integration for **Ubuntu**
   - Click **Apply & Restart**

### Step 3: Verify Docker in WSL

**Open Ubuntu terminal**:

```bash
# Check Docker version
docker --version

# Should show: Docker version 24.x.x or higher

# Test Docker
docker run hello-world

# If you see "Hello from Docker!" - Docker is working!
```

**If Docker command not found:**

```bash
# Docker Desktop should auto-configure, but if not:
# Restart Docker Desktop
# Restart Ubuntu terminal
```

---

## 4. kubectl Installation

**Open Ubuntu terminal**:

```bash
# Download kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Make it executable
chmod +x kubectl

# Move to system path
sudo mv kubectl /usr/local/bin/

# Verify installation
kubectl version --client

# Should show: Client Version: v1.28.x or higher
```

**Alternative: Install via package manager**

```bash
# Add Kubernetes repository
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list

# Update and install
sudo apt update
sudo apt install -y kubectl

# Verify
kubectl version --client
```

---

## 5. Minikube Installation

**Open Ubuntu terminal**:

```bash
# Download Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Install Minikube
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify installation
minikube version

# Should show: minikube version: v1.32.x or higher
```

### Start Minikube

```bash
# Start Minikube with Docker driver
minikube start --driver=docker

# This will take 2-5 minutes first time (downloads images)

# Verify cluster is running
kubectl get nodes

# Should show: minikube   Ready    control-plane   Xm   v1.34.0

# Check Minikube status
minikube status

# Should show all components as Running
```

**If Minikube start fails:**

```bash
# Check Docker is running
docker ps

# If Docker not running, start Docker Desktop

# Delete and restart Minikube
minikube delete
minikube start --driver=docker
```

### Verify kubectl Connection

```bash
# Test kubectl can connect to cluster
kubectl cluster-info

# Should show Kubernetes control plane URL

# Get cluster nodes
kubectl get nodes

# Should show minikube node
```

---

## 6. Jenkins Setup

**💡 Quick Access:** For daily use commands, see [Jenkins Quick Access](#-jenkins-quick-access-most-common-commands) section above.

### Step 1: Install Helm

**Open Ubuntu terminal**:

```bash
# Download Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify installation
helm version

# Should show: version.BuildInfo{Version:"v3.x.x"}
```

### Step 2: Install Jenkins via Helm

```bash
# Add Jenkins Helm repository
helm repo add jenkins https://charts.jenkins.io
helm repo update

# Install Jenkins
helm install jenkins jenkins/jenkins -n jenkins --create-namespace

# Wait for Jenkins pod to be ready (takes 2-5 minutes)
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s

# Check Jenkins pod status
kubectl get pods -n jenkins

# Should show: jenkins-0   2/2   Running   0   Xm
# 
# What "2/2" means:
# - Jenkins Helm chart creates a pod with 2 containers:
#   1. jenkins (main container) - The actual Jenkins server
#   2. jenkins-config (init/config container) - Sets up configuration files
# - "2/2 Ready" means both containers are running successfully
# - "0/2" or "1/2" means Jenkins is still starting or has an error
```

### Step 3: Get Jenkins Admin Password

**How Jenkins Username and Password are Set:**

When Jenkins is installed via Helm, the credentials are automatically configured:

1. **Username:** Always `admin` (default, cannot be changed during installation)
2. **Password:** Automatically generated by Helm chart (random string)

**Get the Password:**

```bash
# Get admin password
kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password

# This command reads the password from inside the Jenkins pod
# Output will be the password (e.g., "admin" or a random string)
# Copy this password - you'll need it to login!
```

**What this command does:**

- Executes `cat` command inside the Jenkins pod
- Reads the admin password from `/run/secrets/additional/chart-admin-password`
- Displays the password on your terminal
- **Username is always:** `admin`
- **Password:** Use the output from this command

**Where Password is Stored:**

- **Inside Pod:** `/run/secrets/additional/chart-admin-password`
- **Generated by:** Helm chart during installation
- **Format:** Random string (e.g., `admin` or `a1b2c3d4e5f6...`)

**Set Custom Password During Installation (Optional):**

If you want to set a custom password during installation:

```bash
# Install Jenkins with custom password
helm install jenkins jenkins/jenkins -n jenkins --create-namespace \
  --set controller.adminPassword=YourCustomPassword123

# Or use a values file
helm install jenkins jenkins/jenkins -n jenkins --create-namespace \
  -f custom-values.yaml
```

**Change Password After Installation:**

1. **Via Jenkins UI (After First Login):**

   - Login with `admin` and the generated password
   - Go to **Manage Jenkins** → **Manage Users** → **admin** → **Configure**
   - Change password → **Save**
2. **Via Kubernetes Secret:**

   ```bash
   # Get current password
   kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password

   # Note: Changing the secret won't change Jenkins password
   # You must change it via Jenkins UI after login
   ```

**Default Credentials Summary:**

- **Username:** `admin` (fixed, cannot be changed during install)
- **Password:** Random string generated by Helm (stored in pod secret)
- **Location:** `/run/secrets/additional/chart-admin-password` inside pod
- **First Login:** Use these credentials, then change password via UI

### Step 4: Access Jenkins UI

**⚠️ Important:** The UI access commands are **the same** regardless of how Jenkins is installed (Helm, kubectl, manual, etc.). Once Jenkins is running in Kubernetes, use these commands:

**Option 1: Port Forward (Recommended for Development)**

```bash
# Port forward Jenkins service (use 8081 to avoid conflict with frontend on 8080)
kubectl port-forward -n jenkins svc/jenkins 8081:8080

# Keep this terminal open!
# Access Jenkins at: http://localhost:8081
```

**⚠️ Port Conflict Warning:**

- Frontend uses port **8080** (mapped from service port 80)
- Jenkins uses port **8081** (mapped from service port 8080)
- If port 8081 is also in use, use any available port: `8082:8080`, `9090:8080`, etc.

**Why use port-forward?**

- ✅ More reliable (no service selector issues)
- ✅ Consistent URL (always localhost:8080)
- ✅ Works immediately without configuration
- ✅ Better for development/testing
- ✅ Works regardless of installation method (Helm, kubectl, etc.)

**Option 2: Minikube Service (Alternative Method)**

```bash
# Get Jenkins service URL
minikube service jenkins -n jenkins

# Output example:
# ┌───────────┬─────────┬─────────────┬───────────────────────────┐
# │ NAMESPACE │  NAME   │ TARGET PORT │            URL            │
# ├───────────┼─────────┼─────────────┼───────────────────────────┤
# │ jenkins   │ jenkins │ http/8080   │ http://192.168.49.2:30088 │
# │           │         │ agent/50000 │ http://192.168.49.2:31967 │
# └───────────┴─────────┴─────────────┴───────────────────────────┘
# ┌───────────┬─────────┬─────────────┬────────────────────────┐
# │ NAMESPACE │  NAME   │ TARGET PORT │          URL           │
# ├───────────┼─────────┼─────────────┼────────────────────────┤
# │ jenkins   │ jenkins │             │ http://127.0.0.1:35617 │
# │           │         │             │ http://127.0.0.1:37743 │
# └───────────┴─────────┴─────────────┴────────────────────────┘
#
# Access Jenkins at: http://192.168.49.2:30088
# Or use localhost URL: http://127.0.0.1:35617
```

**What the output means:**

- **NodePort URL:** `http://192.168.49.2:30088` ❌ **Won't work in WSL with Docker driver**

  - This is the minikube VM's internal IP address
  - Only accessible from within the minikube cluster network
  - **Not accessible from WSL host** when using Docker driver
- **Tunnel URL:** `http://127.0.0.1:35617` ✅ **Use this one in WSL!**

  - Created by minikube's tunnel feature
  - Forwards traffic from localhost to Jenkins service
  - **Works perfectly in WSL** - use this URL!
  - **Keep terminal open** - tunnel closes when terminal closes
- **Agent Port:** `http://192.168.49.2:31967` - For Jenkins agents (not needed for UI)

**⚠️ Why NodePort URL Doesn't Work in WSL:**

- Minikube with Docker driver creates a virtual network (192.168.49.0/24)
- WSL networking doesn't allow direct access to this virtual IP
- The tunnel URL (`127.0.0.1`) bridges the gap - **always use this one!**

**⚠️ Troubleshooting: Connection Refused Error**

**Error:** `error forwarding port 8080 to pod: Connection refused`

**This means:** Jenkins container is not listening on port 8080 yet (still starting up or crashed)

**Step 1: Check Jenkins Pod Status**

```bash
# Check if Jenkins pod is running and ready
kubectl get pods -n jenkins

# Expected output (when ready):
# NAME        READY   STATUS    RESTARTS   AGE
# jenkins-0   2/2     Running   0          5m

# If shows:
# - 0/2 Ready, Status: Pending/ContainerCreating → Still starting (wait 2-5 minutes)
# - 0/2 Ready, Status: Error/CrashLoopBackOff → Pod crashed (see Step 2)
# - 1/2 Ready → One container ready, Jenkins still starting
```

**Step 2: Check Jenkins Container Status**

```bash
# Get detailed pod information
kubectl describe pod jenkins-0 -n jenkins

# Check Jenkins container logs
kubectl logs -n jenkins jenkins-0 -c jenkins --tail=50

# Check if Jenkins is actually listening on port 8080 inside the pod
kubectl exec -n jenkins jenkins-0 -c jenkins -- netstat -tlnp | grep 8080
# Should show: tcp6  0  0  :::8080  :::*  LISTEN

# Or check with curl (if Jenkins is ready)
kubectl exec -n jenkins jenkins-0 -c jenkins -- curl -s http://localhost:8080/login | head -20
```

**Step 3: Wait for Jenkins to Start**

Jenkins takes 2-5 minutes to fully start. If pod shows `1/2` or `0/2` Ready:

```bash
# Wait for Jenkins to be ready (with timeout)
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s

# Check status again
kubectl get pods -n jenkins

# Once it shows 2/2 Running, try port-forward again
kubectl port-forward -n jenkins svc/jenkins 8081:8080
```

**Step 4: If Pod is in Error State**

```bash
# Check what went wrong
kubectl describe pod jenkins-0 -n jenkins | grep -A 10 "Events:"

# View full logs
kubectl logs -n jenkins jenkins-0 -c jenkins --tail=100

# Common issues:
# - Out of memory → Increase resources
# - Volume mount failed → Check PVC status
# - Image pull failed → Check image name
```

**⚠️ Troubleshooting: If URL Not Accessible (http://192.168.49.2:30088 shows "server not reached")**

**Problem:** Jenkins pod is in Error state or not ready, so service has no endpoints.

**Check Status:**

```bash
# Check if pod is ready
kubectl get pods -n jenkins

# If shows: jenkins-0   0/2   Error   0   Xh
# That's the problem! Pod is not ready.

# Check service endpoints (should show pod IPs)
kubectl get endpoints jenkins -n jenkins

# If ENDPOINTS column is empty, pod is not ready
```

**Solution 1: Use Port Forward Directly to Pod (Works Even If Service Broken)**

```bash
# Port forward directly to pod (bypasses service)
# Use port 8081 to avoid conflict with frontend on 8080
kubectl port-forward -n jenkins pod/jenkins-0 8081:8080

# Keep terminal open!
# Access Jenkins at: http://localhost:8081
# This works even if the service is broken!
```

**Solution 2: Restart Jenkins Pod**

```bash
# Delete the pod (StatefulSet will recreate it)
kubectl delete pod jenkins-0 -n jenkins

# Wait for pod to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s

# Check status (should show 2/2 Running)
kubectl get pods -n jenkins

# Then try accessing again
minikube service jenkins -n jenkins
```

**Solution 3: Fix Service Selector (If Needed)**

```bash
kubectl patch svc jenkins -n jenkins --type='json' -p='[{"op": "remove", "path": "/spec/selector/app"}]'

# Verify endpoints now have pod IPs
kubectl get endpoints jenkins -n jenkins
```

**Quick Fix (Always Works):**

If nothing else works, use port-forward directly to the pod:

```bash
# This always works, even if service is broken
# Use port 8081 to avoid conflict with frontend on 8080
kubectl port-forward -n jenkins pod/jenkins-0 8081:8080

# Access: http://localhost:8081
# Username: admin
# Password: kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password
```

**Note:**

- Both methods work! Use whichever you prefer. Port-forward is recommended for daily development, Minikube service works fine too.
- **These access commands work the same way** whether Jenkins was installed via Helm, kubectl, or any other method. Once Jenkins is running in Kubernetes, the access method is identical.
- **If service URL doesn't work**, use port-forward directly to the pod - it always works!

### Step 5: Login to Jenkins

1. Open browser: http://localhost:8080
2. Username: `admin`
3. Password: (from Step 3 above)
4. Click **Continue** → **Install suggested plugins** → Wait → **Continue as admin**

### Step 6: Configure Jenkins RBAC

**Open Ubuntu terminal**:

```bash
# Update ClusterRole with required permissions
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: jenkins
rules:
- apiGroups: [""]
  resources: ["pods", "services", "namespaces", "configmaps", "secrets", "nodes", "persistentvolumeclaims"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets", "daemonsets", "statefulsets"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: ["create"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get", "list"]
- apiGroups: ["batch"]
  resources: ["jobs", "cronjobs"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["autoscaling"]
  resources: ["horizontalpodautoscalers"]
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources: ["replicationcontrollers"]
  verbs: ["get", "list", "watch"]
EOF

# Verify permissions updated
kubectl get clusterrole jenkins -o yaml | grep -A 5 "daemonsets\|statefulsets"
```

### Step 7: Add Docker Hub Credentials in Jenkins

1. **Jenkins UI** → **Manage Jenkins** → **Credentials** → **(global)** → **Add Credentials**
2. **Kind**: `Username with password`
3. **Username**: `shehanapareethcurvelogics` (your Docker Hub username)
4. **Password**: Your Docker Hub **Personal Access Token** (NOT your password!)
5. **ID**: `docker-hub-credentials` (must match exactly)
6. **Description**: `Docker Hub credentials for CI/CD`
7. Click **Create**

**Get Docker Hub Token:**

- Go to https://hub.docker.com → Login
- Click your username → **Account Settings** → **Security**
- Click **New Access Token**
- Description: `Jenkins CI/CD`
- Permissions: `Read, Write & Delete`
- Click **Generate**
- **Copy token immediately** (you won't see it again!)
- Use this token as password in Jenkins

### Step 8: Create Jenkins Pipeline Job

1. **Jenkins UI** → **New Item**
2. **Item name**: `django-auth-app-pipeline`
3. **Type**: **Pipeline**
4. Click **OK**
5. **Pipeline** section:
   - **Definition**: `Pipeline script from SCM`
   - **SCM**: `Git`
   - **Repository URL**: `https://github.com/shehanapareethcurvelogics/kubernetes.git`
   - **Branch**: `*/main`
   - **Script Path**: `jenkins/Jenkinsfile`
6. Click **Save**

### Step 9: Run Pipeline

1. Click **Build Now**
2. Watch console output
3. Pipeline should complete successfully!

---

## 7. Deploy Application

**⚠️ Important: Run all commands in WSL/Ubuntu terminal (not PowerShell/CMD)**

### Deploy Manually (Without Jenkins)

```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Wait for deployments
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n django-auth-app
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n django-auth-app

# Check status
kubectl get all -n django-auth-app
```

### Deploy via Jenkins Pipeline

1. **Jenkins UI** → `django-auth-app-pipeline` → **Build Now**
2. Watch console output
3. Wait for pipeline to complete (5-10 minutes)
4. Check deployment status:

```bash
kubectl get pods -n django-auth-app
```

---

## 8. Access Application

**⚠️ Important: Run all commands in WSL/Ubuntu terminal (not PowerShell/CMD)**

After deploying your application and starting Minikube, use these commands to access your React + Django app:

### Frontend (React App)

**Option 1: Port Forward (Recommended for Development)**

```bash
# Port forward frontend service
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80

# Access: http://localhost:8080
# Keep terminal open while using!
# Press Ctrl+C to stop port forwarding
```

**Option 2: Minikube Service (Auto-opens Browser)**

```bash
# Since frontend uses NodePort, you can use minikube service
minikube service frontend-svc -n django-auth-app

# This automatically opens your browser to the frontend URL
# Example output: http://192.168.49.2:30080
```

**⚠️ Understanding the Two URLs in WSL/Docker Driver:**

When you run `minikube service`, you'll see **two URLs**:

1. **NodePort URL:** `http://192.168.49.2:30080` ❌ **Won't work in WSL**

   - This is the minikube VM's internal IP address
   - Only accessible from within the minikube cluster network
   - **Not accessible from WSL host** when using Docker driver
   - This IP exists only in the virtual Docker network
2. **Tunnel URL:** `http://127.0.0.1:34529` ✅ **Use this one!**

   - Created by minikube's tunnel feature
   - Forwards traffic from localhost to the service
   - **Works perfectly in WSL** - use this URL!
   - **Keep terminal open** - tunnel closes when terminal closes

**Why This Happens:**

- Minikube with Docker driver creates a virtual network (192.168.49.0/24)
- WSL networking doesn't allow direct access to this virtual IP
- The tunnel bridges the gap by forwarding localhost → service

**Best Solution for WSL Users:**

```bash
# Use port-forward instead (more reliable, consistent port)
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80

# Then access: http://localhost:8080
# Keep terminal open while using!
```

### Backend API (Django)

```bash
# Port forward backend service
kubectl port-forward -n django-auth-app svc/backend-svc 8000:8000

# Access: http://localhost:8000
# Health check: http://localhost:8000/api/auth/health/
# Keep terminal open while using!
# Press Ctrl+C to stop port forwarding
```

### Test Endpoints

```bash
# Health check (should return 200)
curl http://localhost:8000/api/auth/health/

# User endpoint (returns 401 - expected without auth)
curl http://localhost:8000/api/auth/user/

# Register user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

---

## 9. View Logs & Monitor

### View Backend Logs

```bash
# All backend pods
kubectl logs -n django-auth-app -l app=backend --tail=50

# Specific pod
kubectl logs -n django-auth-app backend-deployment-XXXXX-XXXXX -c backend --tail=50

# Follow logs in real-time
kubectl logs -n django-auth-app -l app=backend -f

# Init container logs (migrations)
kubectl logs -n django-auth-app backend-deployment-XXXXX-XXXXX -c migrate
```

### View Frontend Logs

```bash
# All frontend pods
kubectl logs -n django-auth-app -l app=frontend --tail=50

# Follow logs
kubectl logs -n django-auth-app -l app=frontend -f
```

### Check Pod Status

```bash
# All pods
kubectl get pods -n django-auth-app

# Pod details
kubectl describe pod -n django-auth-app backend-deployment-XXXXX-XXXXX

# Pod events (shows errors, restarts)
```

### Understanding Replica Sets (Why Some Show DESIRED=0)

**Question:** Why do some replica sets show `DESIRED=0` in `kubectl get all`?

**Answer:** This is **normal Kubernetes behavior** for rolling updates!

**Example Output:**
```
NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/backend-deployment-7c699f7cc4    2         2         2       6d17h  ← Current (active)
replicaset.apps/backend-deployment-846d77bd4b    0         0         0       6d22h  ← Old (kept for rollback)
replicaset.apps/backend-deployment-59d48cc57d    0         0         0       6d18h  ← Old (kept for rollback)
```

**What Happens During Rolling Updates:**

1. **Initial State:** Deployment creates ReplicaSet-1 with 2 pods
2. **Update Triggered:** You update the deployment (new image, config, etc.)
3. **New ReplicaSet Created:** Kubernetes creates ReplicaSet-2 with new configuration
4. **Gradual Migration:** 
   - ReplicaSet-2 scales up: 0 → 1 → 2 pods
   - ReplicaSet-1 scales down: 2 → 1 → 0 pods
5. **Old ReplicaSet Kept:** ReplicaSet-1 stays with `DESIRED=0` for rollback capability

**Why Keep Old Replica Sets?**

- ✅ **Rollback capability** - Can quickly revert to previous version
- ✅ **Deployment history** - Track what versions were deployed
- ✅ **Debugging** - Compare configurations between versions

**View Deployment History:**

```bash
# See all revisions
kubectl rollout history deployment/backend-deployment -n django-auth-app

# See details of specific revision
kubectl rollout history deployment/backend-deployment -n django-auth-app --revision=2

# Rollback to previous version
kubectl rollout undo deployment/backend-deployment -n django-auth-app

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment -n django-auth-app --to-revision=2
```

**Clean Up Old Replica Sets (Optional):**

```bash
# Kubernetes automatically cleans up old replica sets after a retention period
# But you can manually delete them if needed:

# List all replica sets
kubectl get replicasets -n django-auth-app

# Delete old replica sets (with 0 desired)
kubectl delete replicaset backend-deployment-846d77bd4b -n django-auth-app

# Or delete all old replica sets at once
kubectl get replicasets -n django-auth-app -o json | \
  jq -r '.items[] | select(.spec.replicas == 0) | .metadata.name' | \
  xargs -I {} kubectl delete replicaset {} -n django-auth-app
```

**Summary:**

- **`DESIRED=0`** = Old replica set from previous deployment version
- **`DESIRED=2`** = Current active replica set
- **This is normal** - Kubernetes keeps old replica sets for rollback
- **Safe to ignore** - They don't consume resources (0 pods running)
- **Auto-cleanup** - Kubernetes will eventually clean them up
kubectl get events -n django-auth-app --sort-by='.lastTimestamp'
```

---

## 🔧 Troubleshooting Commands

### Check Cluster Status

```bash
# Verify cluster is running
kubectl cluster-info

# Check cluster nodes
kubectl get nodes

# Check Minikube status
minikube status
```

### Check Pod Status

```bash
# All pods
kubectl get pods -n django-auth-app

# Backend pods
kubectl get pods -n django-auth-app -l app=backend

# Frontend pods
kubectl get pods -n django-auth-app -l app=frontend
```

### View Pod Logs

```bash
# Backend logs (all pods)
kubectl logs -n django-auth-app -l app=backend --tail=50

# Backend logs (specific pod)
kubectl logs -n django-auth-app backend-deployment-XXXXX-XXXXX -c backend --tail=50

# Init container logs (migrations)
kubectl logs -n django-auth-app backend-deployment-XXXXX-XXXXX -c migrate

# Frontend logs
kubectl logs -n django-auth-app -l app=frontend --tail=50

# Follow logs in real-time
kubectl logs -n django-auth-app -l app=backend -f
```

### Check Service Status

```bash
# All services (in namespace)
kubectl get services -n django-auth-app
# Or use short form:
kubectl get svc -n django-auth-app

# All services (all namespaces)
kubectl get services --all-namespaces

# Service endpoints
kubectl get endpoints -n django-auth-app

# Service details
kubectl describe svc backend-svc -n django-auth-app
```

### Debug Pod Issues

```bash
# Pod events (shows errors, restarts, etc.)
kubectl describe pod -n django-auth-app backend-deployment-XXXXX-XXXXX

# Check pod environment variables
kubectl exec -n django-auth-app backend-deployment-XXXXX-XXXXX -c backend -- env | grep -E 'DB_|POSTGRES'

# Test database connection from pod
kubectl exec -n django-auth-app backend-deployment-XXXXX-XXXXX -c backend -- python manage.py dbshell
```

### Fix Common Issues

```bash
# Delete stuck pods (forces recreation)
kubectl delete pods -n django-auth-app -l app=backend

# Restart deployment
kubectl rollout restart deployment backend-deployment -n django-auth-app

# Check deployment status
kubectl rollout status deployment backend-deployment -n django-auth-app

# View deployment history
kubectl rollout history deployment backend-deployment -n django-auth-app

# View details of specific revision
kubectl rollout history deployment backend-deployment -n django-auth-app --revision=2
```

**Understanding CHANGE-CAUSE:**

When you run `kubectl rollout history`, you might see `<none>` for CHANGE-CAUSE:

```
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
3         <none>
```

**What is CHANGE-CAUSE?**

- CHANGE-CAUSE is an annotation (`kubernetes.io/change-cause`) that tracks **why** a deployment was updated
- Helps you understand what changed in each revision
- Makes rollback decisions easier

**Why Shows `<none>`?**

- Deployments don't have the `kubernetes.io/change-cause` annotation set
- Happens when using `kubectl apply` without annotations
- **Common when deploying through Jenkins** - Jenkins pipeline uses `kubectl apply` without annotations
- Not an error - just means no change-cause was recorded

**How to Add CHANGE-CAUSE:**

**For Jenkins Deployments (CI/CD Pipeline):**

If you deployed through Jenkins UI, the Jenkinsfile has been updated to automatically add CHANGE-CAUSE annotations. The next time you run the pipeline, it will include:

- Build number
- Build URL
- Image tag

**To update existing deployments from Jenkins:**

```bash
# Add change-cause to current deployments
kubectl annotate deployment backend-deployment \
  -n django-auth-app \
  kubernetes.io/change-cause="Deployed via Jenkins - Build #X" \
  --overwrite

kubectl annotate deployment frontend-deployment \
  -n django-auth-app \
  kubernetes.io/change-cause="Deployed via Jenkins - Build #X" \
  --overwrite
```

**Method 1: Add annotation when applying (Manual Deployments)**

```bash
# Apply with change-cause annotation
kubectl apply -f k8s/backend/deployment.yaml \
  --record \
  -o yaml | kubectl annotate --local -f - \
  deployment/backend-deployment \
  kubernetes.io/change-cause="Updated backend image to v1.2.3" \
  -o yaml | kubectl apply -f -

# Or simpler: use kubectl annotate after applying
kubectl apply -f k8s/backend/deployment.yaml
kubectl annotate deployment backend-deployment \
  -n django-auth-app \
  kubernetes.io/change-cause="Updated backend image to v1.2.3"
```

**Method 2: Add to YAML file (Best Practice)**

Add annotation to your deployment YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: django-auth-app
  annotations:
    kubernetes.io/change-cause: "Updated backend image to v1.2.3"
  labels:
    app: backend
```

**Method 3: Use kubectl set with record**

```bash
# When updating image
kubectl set image deployment/backend-deployment \
  backend=shehanapareethcurvelogics/kubernetes-example-backend:v1.2.3 \
  -n django-auth-app \
  --record

# When updating other fields
kubectl patch deployment backend-deployment \
  -n django-auth-app \
  -p '{"spec":{"replicas":3}}' \
  --record
```

**View History with CHANGE-CAUSE:**

```bash
# After adding annotations, history will show:
kubectl rollout history deployment backend-deployment -n django-auth-app

# Output:
# REVISION  CHANGE-CAUSE
# 1         <none>
# 2         Updated backend image to v1.2.3
# 3         Scaled replicas to 3
# 4         Updated environment variables
```

**Add CHANGE-CAUSE to Existing Revisions:**

```bash
# Add change-cause to current revision
kubectl annotate deployment backend-deployment \
  -n django-auth-app \
  kubernetes.io/change-cause="Fixed database connection issue"

# This will be recorded in the next rollout
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Backend Pod CrashLoopBackOff

**Symptoms:**

- Pod restarts repeatedly
- `kubectl get pods` shows `CrashLoopBackOff`

**Fix:**

```bash
# Check logs to see error
kubectl logs -n django-auth-app -l app=backend --tail=50

# Common causes:
# 1. Database connection failed - check DB_HOST env var
# 2. Health check failing - verify /api/auth/health/ endpoint exists
# 3. Missing environment variables - check deployment.yaml
```

### Issue 2: ImagePullBackOff

**Symptoms:**

- Pod can't pull Docker image
- `kubectl describe pod` shows `ImagePullBackOff`

**Fix:**

```bash
# Ensure images are pushed to Docker Hub
# Or load into Minikube (if using local images)
minikube image load shehanapareethcurvelogics/kubernetes-example-backend:latest

# Check image pull policy
kubectl get deployment backend-deployment -n django-auth-app -o yaml | grep imagePullPolicy
```

### Issue 3: Port Already in Use (Address Already in Use)

**Symptoms:**

- Error: `bind: address already in use` when running `kubectl port-forward`
- Port 8080 is already taken by another service

**Why This Happens:**

- Frontend uses port **8080** (mapped from service port 80)
- Jenkins also tries to use port **8080** (mapped from service port 8080)
- Only one service can use a port at a time

**Fix:**

```bash
# Check what's using port 8080
lsof -i :8080
# Or in WSL:
netstat -tulpn | grep 8080

# Solution: Use different ports for each service
# Frontend: port 8080 (already running)
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80

# Jenkins: use port 8081 instead
kubectl port-forward -n jenkins svc/jenkins 8081:8080
# Access Jenkins at: http://localhost:8081

# Backend: use port 8000 (no conflict)
kubectl port-forward -n django-auth-app svc/backend-svc 8000:8000
# Access Backend at: http://localhost:8000

# If 8081 is also taken, use any available port:
kubectl port-forward -n jenkins svc/jenkins 9090:8080
# Access Jenkins at: http://localhost:9090
```

**Port Mapping Reference:**

| Service  | Local Port | Service Port | Access URL            |
| -------- | ---------- | ------------ | --------------------- |
| Frontend | 8080       | 80           | http://localhost:8080 |
| Jenkins  | 8081       | 8080         | http://localhost:8081 |
| Backend  | 8000       | 8000         | http://localhost:8000 |

### Issue 4: Jenkins Pod Shows "0/2 Error" or "1/2" Status

**Symptoms:**

- `kubectl get pods -n jenkins` shows `jenkins-0   0/2   Error   0   Xd`
- Port-forward fails with "Connection refused"
- Jenkins is not accessible

**Why Jenkins Shows "2/2":**

Jenkins Helm chart creates a pod with **2 containers**:

1. **`jenkins`** (main container) - The actual Jenkins server
2. **`jenkins-config`** (init/config container) - Sets up configuration files

- **`2/2 Ready`** = Both containers running successfully ✅
- **`1/2 Ready`** = Config container done, Jenkins still starting (wait 2-5 minutes) ⏳
- **`0/2 Ready`** = Pod crashed or still initializing ❌

**Diagnose the Problem:**

```bash
# Check which container failed
kubectl get pod jenkins-0 -n jenkins -o jsonpath='{.status.containerStatuses[*].name}'
# Output: jenkins jenkins-config

# Check container states
kubectl get pod jenkins-0 -n jenkins -o jsonpath='{.status.containerStatuses[*].state}'

# Check Jenkins container logs
kubectl logs -n jenkins jenkins-0 -c jenkins --tail=50

# Check config container logs
kubectl logs -n jenkins jenkins-0 -c jenkins-config --tail=50

# Get detailed pod events
kubectl describe pod jenkins-0 -n jenkins | grep -A 20 "Events:"
```

**Fix: Restart Jenkins Pod**

```bash
# Delete the pod (StatefulSet will recreate it automatically)
kubectl delete pod jenkins-0 -n jenkins

# Wait for pod to be ready (takes 2-5 minutes)
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s

# Check status (should show 2/2 Running)
kubectl get pods -n jenkins

# Once it shows 2/2 Running, try port-forward again
kubectl port-forward -n jenkins svc/jenkins 8081:8080
```

**If Pod Keeps Crashing:**

```bash
# Check resource limits (Jenkins might need more memory)
kubectl describe pod jenkins-0 -n jenkins | grep -A 5 "Limits:"

# Check persistent volume (might be full or corrupted)
kubectl get pvc -n jenkins
kubectl describe pvc jenkins -n jenkins

# Reinstall Jenkins (last resort - will lose all data)
helm uninstall jenkins -n jenkins
helm install jenkins jenkins/jenkins -n jenkins --create-namespace
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s
```

### Issue 5: Health Check Failing

**Symptoms:**

- Pod shows `0/1 READY`
- Readiness probe failing

**Fix:**

```bash
# Test health endpoint manually
kubectl exec -n django-auth-app backend-deployment-XXXXX-XXXXX -c backend -- curl http://localhost:8000/api/auth/health/

# Should return: {"status":"healthy","service":"django-auth-backend"}
# If 404, health endpoint not in image - rebuild and push
```

### Issue 4: Database Connection Failed

**Symptoms:**

- Init container (migrations) fails
- Logs show: `could not translate host name "db" to address`

**Fix:**

```bash
# Verify DB_HOST env var is set to "postgres-svc"
kubectl get deployment backend-deployment -n django-auth-app -o yaml | grep DB_HOST

# Should show: DB_HOST: postgres-svc
# If not, update deployment.yaml and reapply
```

### Issue 5: Jenkins Service Not Accessible

**Symptoms:**

- `minikube service jenkins` shows "no running pod"
- Service has no endpoints

**Fix:**

```bash
# Fix service selector
kubectl patch svc jenkins -n jenkins --type='json' -p='[{"op": "remove", "path": "/spec/selector/app"}]'

# Verify endpoints
kubectl get endpoints jenkins -n jenkins
```

### Issue 6: RBAC Permission Errors

**Symptoms:**

- `kubectl get all` shows permission errors
- Pipeline fails with "Forbidden" errors

**Fix:**

```bash
# Update ClusterRole (see section 5 above)
# Then verify permissions
kubectl auth can-i list daemonsets --as=system:serviceaccount:jenkins:jenkins
```

---

## 📋 Deployment Commands

### Deploy Application Manually

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# Or apply all at once
kubectl apply -f k8s/
```

### Check Deployment Status

```bash
# Wait for deployments to be ready
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n django-auth-app
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n django-auth-app

# Check all resources
kubectl get all -n django-auth-app
```

### Update Deployment

```bash
# After updating code/images, restart deployment
kubectl rollout restart deployment backend-deployment -n django-auth-app
kubectl rollout restart deployment frontend-deployment -n django-auth-app

# Or delete pods to force recreation
kubectl delete pods -n django-auth-app -l app=backend
```

**Best Practice: Always Add CHANGE-CAUSE When Updating**

```bash
# Method 1: Annotate after applying (Easiest)
kubectl apply -f k8s/backend/deployment.yaml
kubectl annotate deployment backend-deployment \
  -n django-auth-app \
  kubernetes.io/change-cause="Updated backend: added new API endpoint"

# Method 2: Use --record flag (if supported)
kubectl set image deployment/backend-deployment \
  backend=shehanapareethcurvelogics/kubernetes-example-backend:v1.2.3 \
  -n django-auth-app \
  --record

# Method 3: Add to YAML file (Best for Git tracking)
# Edit k8s/backend/deployment.yaml and add:
# metadata:
#   annotations:
#     kubernetes.io/change-cause: "Updated backend image to v1.2.3"
```

**Rollback with CHANGE-CAUSE:**

```bash
# View history with change-cause
kubectl rollout history deployment backend-deployment -n django-auth-app

# Rollback to previous version
kubectl rollout undo deployment backend-deployment -n django-auth-app

# Rollback to specific revision (e.g., revision 2)
kubectl rollout undo deployment backend-deployment -n django-auth-app --to-revision=2
```

---

## 🧹 Cleanup Commands

### Delete Application

```bash
# Delete all resources in namespace
kubectl delete -f k8s/

# Or delete namespace (deletes everything)
kubectl delete namespace django-auth-app
```

### Manage Jenkins with Helm Commands

Since Jenkins is installed via Helm, you can use Helm commands to manage it:

**Check Jenkins Helm Release:**

```bash
# List all Helm releases
helm list -n jenkins

# Get Jenkins release details
helm status jenkins -n jenkins

# Show Jenkins values (configuration)
helm get values jenkins -n jenkins
```

**Upgrade Jenkins:**

```bash
# Update Helm repository
helm repo update

# Upgrade Jenkins to latest version
helm upgrade jenkins jenkins/jenkins -n jenkins

# Or upgrade with specific values
helm upgrade jenkins jenkins/jenkins -n jenkins --set controller.serviceType=NodePort
```

**Rollback Jenkins:**

```bash
# View release history
helm history jenkins -n jenkins

# Rollback to previous version
helm rollback jenkins -n jenkins

# Rollback to specific revision
helm rollback jenkins 2 -n jenkins
```

**Uninstall Jenkins:**

```bash
# Uninstall Helm Jenkins (removes Jenkins but keeps namespace)
helm uninstall jenkins -n jenkins

# Delete namespace (removes everything)
kubectl delete namespace jenkins
```

**Reinstall Jenkins:**

```bash
# If Jenkins is broken, you can reinstall
helm uninstall jenkins -n jenkins
helm install jenkins jenkins/jenkins -n jenkins --create-namespace

# Wait for pod to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=jenkins-controller -n jenkins --timeout=300s
```

**Check Jenkins Helm Chart Version:**

```bash
# See installed chart version
helm list -n jenkins

# Output shows:
# NAME     NAMESPACE  REVISION  UPDATED                                 STATUS    CHART            APP VERSION
# jenkins  jenkins    1         2026-01-06 07:31:48.123456789 +0000 UTC  deployed  jenkins-5.8.116  2.528.3
```

**Useful Helm Commands for Jenkins:**

```bash
# Get Jenkins admin password (Helm way)
helm get notes jenkins -n jenkins

# Show all resources created by Helm
helm get manifest jenkins -n jenkins

# Test Helm template rendering (dry-run)
helm install jenkins jenkins/jenkins -n jenkins --dry-run --debug
```

### Stop Minikube

```bash
# Stop cluster
minikube stop

# Delete cluster
minikube delete
```

---

## 📊 Monitoring Commands

### View Real-Time Logs

```bash
# Backend logs (follow)
kubectl logs -n django-auth-app -l app=backend -f

# Frontend logs (follow)
kubectl logs -n django-auth-app -l app=frontend -f

# All logs
kubectl logs -n django-auth-app --all-containers=true -f
```

### Check Resource Usage

```bash
# Pod resource usage
kubectl top pods -n django-auth-app

# Node resource usage
kubectl top nodes
```

### View Events

```bash
# Recent events in namespace
kubectl get events -n django-auth-app --sort-by='.lastTimestamp'

# Watch events in real-time
kubectl get events -n django-auth-app --watch
```

---

## ✅ Verification Checklist

Before running pipeline, verify:

```bash
# 1. Minikube is running
minikube status

# 2. Jenkins is running
kubectl get pods -n jenkins

# 3. Can access Jenkins UI (use port 8081)
curl http://localhost:8081/login || echo "Start port-forward first"

# 4. Docker Hub credentials configured
# (Check in Jenkins UI)

# 5. Git repository accessible
git ls-remote https://github.com/shehanapareethcurvelogics/kubernetes.git

# 6. Kubernetes namespace exists
kubectl get namespace django-auth-app || kubectl create namespace django-auth-app
```

---

## 🎯 Complete Pipeline Flow

1. **Code Push** → GitHub
2. **Jenkins** → Pulls code from GitHub
3. **Build** → Docker images (backend + frontend)
4. **Test** → Run tests (optional, can skip with `SKIP_TESTS=true`)
5. **Push** → Images to Docker Hub
6. **Deploy** → Apply Kubernetes manifests
7. **Verify** → Check pods are running

---

## 📝 Key Files

- `jenkins/Jenkinsfile` - Pipeline definition
- `k8s/backend/deployment.yaml` - Backend deployment (includes DB_HOST, health check)
- `k8s/frontend/deployment.yaml` - Frontend deployment
- `backend/authentication/views.py` - Health check endpoint
- `backend/authentication/urls.py` - URL routing

---

## 🔑 Important Environment Variables

**Backend Deployment:**

- `DB_HOST=postgres-svc` (Kubernetes service name)
- `POSTGRES_USER` (from ConfigMap)
- `POSTGRES_PASSWORD` (from Secret)
- `POSTGRES_DB` (from ConfigMap)

**Jenkins Pipeline:**

- `DOCKER_REGISTRY=shehanapareethcurvelogics`
- `DOCKER_CREDENTIALS_ID=docker-hub-credentials`
- `SKIP_TESTS=false` (set to `true` to skip tests)

---

**All commands are ready to copy-paste and run!** 🚀
