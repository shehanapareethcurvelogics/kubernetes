#!/bin/bash
# Fix Jenkins Service Selector
# Run this in WSL

echo "🔍 Current service selector:"
kubectl get svc jenkins -n jenkins -o jsonpath='{.spec.selector}' && echo

echo "🔍 Pod labels:"
kubectl get pod jenkins-0 -n jenkins -o jsonpath='{.metadata.labels}' && echo

echo ""
echo "🔧 Fixing service selector to match pod labels..."

# Remove the 'app: jenkins' selector that doesn't exist on the pod
# Keep only the labels that match: app.kubernetes.io/component and app.kubernetes.io/instance
kubectl patch svc jenkins -n jenkins --type='json' \
  -p='[{"op": "remove", "path": "/spec/selector/app"}]'

echo ""
echo "✅ Service selector updated!"
echo ""
echo "🔍 New service selector:"
kubectl get svc jenkins -n jenkins -o jsonpath='{.spec.selector}' && echo

echo ""
echo "🔍 Checking endpoints (should show jenkins-0 IP now):"
kubectl get endpoints jenkins -n jenkins

echo ""
echo "✅ Done! Now try: minikube service jenkins -n jenkins"

