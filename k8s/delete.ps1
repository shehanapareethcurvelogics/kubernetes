# Kubernetes Cleanup Script
# This script deletes all resources for the Django Auth App

Write-Host "🗑️  Deleting all resources..." -ForegroundColor Yellow

# Delete namespace (this will delete everything in the namespace)
kubectl delete namespace django-auth-app

Write-Host "✅ Cleanup complete!" -ForegroundColor Green

