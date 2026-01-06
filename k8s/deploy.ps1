# Kubernetes Deployment Script for Django Auth App
# This script deploys the entire application to Minikube

Write-Host "🚀 Starting Kubernetes Deployment..." -ForegroundColor Green

# Step 1: Create namespace
Write-Host "`n📦 Creating namespace..." -ForegroundColor Yellow
kubectl apply -f namespace.yaml

# Step 2: Create ConfigMap and Secret
Write-Host "`n🔧 Creating ConfigMap and Secret..." -ForegroundColor Yellow
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Step 3: Deploy PostgreSQL
Write-Host "`n🐘 Deploying PostgreSQL..." -ForegroundColor Yellow
kubectl apply -f postgres/pvc.yaml
kubectl apply -f postgres/deployment.yaml
kubectl apply -f postgres/service.yaml

# Wait for database to be ready
Write-Host "`n⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=postgres -n django-auth-app --timeout=120s

# Step 4: Deploy Backend
Write-Host "`n🐍 Deploying Django Backend..." -ForegroundColor Yellow
kubectl apply -f backend/deployment.yaml
kubectl apply -f backend/service.yaml

# Step 5: Deploy Frontend
Write-Host "`n⚛️  Deploying React Frontend..." -ForegroundColor Yellow
kubectl apply -f frontend/deployment.yaml
kubectl apply -f frontend/service.yaml

# Step 6: Show status
Write-Host "`n✅ Deployment Complete! Checking status..." -ForegroundColor Green
kubectl get all -n django-auth-app

Write-Host "`n📊 To view logs:" -ForegroundColor Cyan
Write-Host "  kubectl logs -f deployment/backend-deployment -n django-auth-app" -ForegroundColor Gray
Write-Host "  kubectl logs -f deployment/frontend-deployment -n django-auth-app" -ForegroundColor Gray

Write-Host "`n🌐 To access the application:" -ForegroundColor Cyan
$minikubeIP = minikube ip
Write-Host "  Frontend: http://$minikubeIP:30080" -ForegroundColor Gray
Write-Host "  Or use: minikube service frontend-svc -n django-auth-app" -ForegroundColor Gray

