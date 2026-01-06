# Kubernetes Manifests for Django Auth App

This directory contains all Kubernetes manifests needed to deploy the Django + React application to Minikube.

## 📁 Directory Structure

```
k8s/
├── namespace.yaml          # Creates django-auth-app namespace
├── configmap.yaml          # Non-sensitive configuration
├── secret.yaml             # Sensitive data (passwords, keys)
├── postgres/
│   ├── pvc.yaml           # Persistent storage for database
│   ├── deployment.yaml    # PostgreSQL deployment
│   └── service.yaml       # PostgreSQL service
├── backend/
│   ├── deployment.yaml    # Django backend deployment
│   └── service.yaml       # Backend service
├── frontend/
│   ├── deployment.yaml    # React frontend deployment
│   └── service.yaml       # Frontend service (NodePort)
├── deploy.ps1             # PowerShell deployment script
└── delete.ps1             # PowerShell cleanup script
```

## 🚀 Quick Start

### Prerequisites

1. Minikube is running: `minikube status`
2. Docker images are built and loaded into Minikube

### Step 1: Build and Load Docker Images

```powershell
# Point Docker to Minikube's Docker daemon
minikube docker-env | Invoke-Expression

# Build images
cd backend
docker build -t backend:latest .
cd ../frontend
docker build -t frontend:latest .
cd ..
```

### Step 2: Deploy to Kubernetes

**Option A: Using the deployment script (Recommended)**

```powershell
cd k8s
.\deploy.ps1
```

**Option B: Manual deployment**

```powershell
# Apply all manifests
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f postgres/
kubectl apply -f backend/
kubectl apply -f frontend/
```

### Step 3: Access Your Application

```powershell
# Get Minikube IP
minikube ip

# Access frontend (replace <ip> with actual IP)
# http://<minikube-ip>:30080

# Or use minikube service command
minikube service frontend-svc -n django-auth-app
```

## 🔍 Useful Commands

### Check Status

```powershell
# All resources
kubectl get all -n django-auth-app

# Specific resources
kubectl get pods -n django-auth-app
kubectl get services -n django-auth-app
kubectl get deployments -n django-auth-app
```

### View Logs

```powershell
# Backend logs
kubectl logs -f deployment/backend-deployment -n django-auth-app

# Frontend logs
kubectl logs -f deployment/frontend-deployment -n django-auth-app

# Database logs
kubectl logs -f deployment/postgres-deployment -n django-auth-app
```

### Scale Application

```powershell
# Scale backend to 3 pods
kubectl scale deployment backend-deployment --replicas=3 -n django-auth-app

# Scale frontend to 4 pods
kubectl scale deployment frontend-deployment --replicas=4 -n django-auth-app
```

### Port Forwarding

```powershell
# Forward frontend port
kubectl port-forward service/frontend-svc 3000:80 -n django-auth-app
# Access at http://localhost:3000

# Forward backend port
kubectl port-forward service/backend-svc 8000:8000 -n django-auth-app
# Access at http://localhost:8000
```

### Execute Commands in Pods

```powershell
# Django management commands
kubectl exec -it deployment/backend-deployment -n django-auth-app -- python manage.py createsuperuser

# Database shell
kubectl exec -it deployment/postgres-deployment -n django-auth-app -- psql -U django_user -d django_auth_db
```

## 🗑️ Cleanup

```powershell
# Using cleanup script
cd k8s
.\delete.ps1

# Or manually
kubectl delete namespace django-auth-app
```

## 📚 Learn More

See `KUBERNETES_MIGRATION_GUIDE.md` in the root directory for:
- Detailed explanations of each manifest
- Architecture diagrams
- Troubleshooting guide
- Advanced concepts

