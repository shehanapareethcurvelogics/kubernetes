# Fix Jenkins Service Selector Issue

## Problem
Jenkins pod `jenkins-0` is running, but `minikube service` says "no running pod for service jenkins found".

This means the **service selector doesn't match the pod labels**.

---

## Quick Fix Commands

Run these in **WSL**:

```bash
# 1. Check service selector
kubectl get svc jenkins -n jenkins -o yaml | grep -A 5 selector

# 2. Check pod labels
kubectl get pod jenkins-0 -n jenkins --show-labels

# 3. Check what labels the service expects vs what the pod has
kubectl get svc jenkins -n jenkins -o jsonpath='{.spec.selector}' && echo
kubectl get pod jenkins-0 -n jenkins -o jsonpath='{.metadata.labels}' && echo
```

---

## Solution Options

### Option 1: Check Service Selector (Most Likely Fix)

The Helm-installed Jenkins uses a StatefulSet with specific labels. Check if they match:

```bash
# See service selector
kubectl describe svc jenkins -n jenkins | grep Selector

# See pod labels  
kubectl describe pod jenkins-0 -n jenkins | grep Labels
```

**If labels don't match**, update the service:

```bash
# Get current service
kubectl get svc jenkins -n jenkins -o yaml > /tmp/jenkins-svc.yaml

# Edit to match pod labels (or use kubectl patch)
kubectl patch svc jenkins -n jenkins -p '{"spec":{"selector":{"app.kubernetes.io/name":"jenkins"}}}'
```

---

### Option 2: Access Jenkins Directly (Workaround)

Since the pod is running, you can access it directly:

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo "Access Jenkins at: http://${MINIKUBE_IP}:30090"

# Or use port-forward
kubectl port-forward -n jenkins svc/jenkins 8080:8080
# Then access: http://localhost:8080
```

---

### Option 3: Fix Service Selector via Helm

Since you installed with Helm, update the Helm values:

```bash
# Check current Helm values
helm get values jenkins -n jenkins

# Update service selector
helm upgrade jenkins jenkins/jenkins -n jenkins \
  --reuse-values \
  --set controller.service.selector.app.kubernetes.io/name=jenkins
```

---

## Most Likely Solution

The Helm StatefulSet uses labels like `app.kubernetes.io/name: jenkins`, but the service might be looking for different labels.

**Quick fix** - Check and update service:

```bash
# 1. Check what selector the service needs
kubectl get pod jenkins-0 -n jenkins -o jsonpath='{.metadata.labels}' | jq

# 2. Update service selector to match
kubectl patch svc jenkins -n jenkins --type='json' -p='[{"op": "replace", "path": "/spec/selector", "value": {"app.kubernetes.io/name":"jenkins"}}]'

# 3. Verify
kubectl get svc jenkins -n jenkins -o yaml | grep -A 3 selector
```

---

## Alternative: Use Port-Forward (Easiest)

If you just need to access Jenkins:

```bash
# Port-forward Jenkins service
kubectl port-forward -n jenkins svc/jenkins 8080:8080

# Then access: http://localhost:8080
```

This works regardless of service selector issues.

---

## Verify Fix

After fixing:

```bash
# Check service endpoints
kubectl get endpoints jenkins -n jenkins

# Should show jenkins-0 IP address

# Then minikube service should work
minikube service jenkins -n jenkins
```

