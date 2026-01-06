# Jenkins Troubleshooting Guide

## Issue: "no running pod for service jenkins found"

This means the Jenkins service exists but there's no pod running. Let's troubleshoot:

---

## Step 1: Check Jenkins Pod Status

Run in **WSL (Ubuntu)**:

```bash
# Check if Jenkins pod is running
kubectl get pods -n jenkins

# Check pod details if it exists but not running
kubectl get pods -n jenkins -o wide

# Check pod events/logs
kubectl describe pod <pod-name> -n jenkins
```

---

## Step 2: Check Jenkins Deployment

```bash
# Check deployment status
kubectl get deployment -n jenkins

# Check deployment details
kubectl describe deployment jenkins -n jenkins

# Check replicaset
kubectl get replicaset -n jenkins
```

---

## Step 3: Common Issues & Fixes

### Issue 1: Pod Not Created

**Symptoms**: `kubectl get pods -n jenkins` shows nothing

**Fix**:
```bash
# Check if deployment exists
kubectl get deployment jenkins -n jenkins

# If not, deploy Jenkins
cd /mnt/d/kubernetes
kubectl apply -f jenkins/jenkins-deployment.yaml

# Or if using Helm (as you did before)
helm list -n jenkins
```

---

### Issue 2: Pod CrashLoopBackOff

**Symptoms**: Pod exists but keeps restarting

**Check logs**:
```bash
kubectl logs -n jenkins <pod-name>
kubectl logs -n jenkins <pod-name> --previous  # Previous crash logs
```

**Common causes**:
- Out of memory
- Configuration errors
- Volume mount issues

**Fix**:
```bash
# Check resource limits
kubectl describe pod <pod-name> -n jenkins | grep -A 5 "Limits"

# Increase resources if needed (edit deployment)
kubectl edit deployment jenkins -n jenkins
```

---

### Issue 3: Pod Pending

**Symptoms**: Pod stuck in `Pending` status

**Check why**:
```bash
kubectl describe pod <pod-name> -n jenkins
```

**Common causes**:
- Not enough resources
- Node selector issues
- PVC not available

**Fix**:
```bash
# Check PVC status
kubectl get pvc -n jenkins

# Check node resources
kubectl top nodes
```

---

### Issue 4: Wrong Service Selector

**Symptoms**: Service exists but no pods match

**Check**:
```bash
# Check service selector
kubectl get svc jenkins -n jenkins -o yaml | grep selector

# Check pod labels
kubectl get pods -n jenkins --show-labels

# Labels must match!
```

---

## Step 4: Quick Fixes

### Option A: Restart Jenkins Deployment

```bash
kubectl rollout restart deployment/jenkins -n jenkins

# Wait for rollout
kubectl rollout status deployment/jenkins -n jenkins
```

### Option B: Delete and Recreate

```bash
# Delete deployment (keeps PVC)
kubectl delete deployment jenkins -n jenkins

# Recreate
kubectl apply -f jenkins/jenkins-deployment.yaml
```

### Option C: Check Helm Installation

If you installed Jenkins with Helm:

```bash
# Check Helm release
helm list -n jenkins

# Check release status
helm status jenkins -n jenkins

# Upgrade/reinstall if needed
helm upgrade jenkins jenkins/jenkins -n jenkins \
  --set controller.serviceType=NodePort \
  --set controller.nodePort=30090 \
  --set controller.admin.username=admin \
  --set controller.admin.password=admin
```

---

## Step 5: Verify Jenkins is Running

After fixing, verify:

```bash
# Check pod status
kubectl get pods -n jenkins

# Should show: READY 2/2, STATUS Running

# Check service
kubectl get svc -n jenkins

# Access Jenkins
minikube service jenkins -n jenkins
# OR
curl http://192.168.49.2:30088
```

---

## Step 6: Check Minikube Status

Make sure Minikube is running:

```bash
minikube status

# If not running:
minikube start --driver=docker
```

---

## Quick Diagnostic Commands

Run these in order:

```bash
# 1. Check Minikube
minikube status

# 2. Check Jenkins namespace
kubectl get all -n jenkins

# 3. Check pod logs (if pod exists)
kubectl logs -n jenkins -l app=jenkins --tail=50

# 4. Check events
kubectl get events -n jenkins --sort-by='.lastTimestamp'

# 5. Check resource usage
kubectl top pods -n jenkins
```

---

## Most Likely Solution

Based on your setup (Helm installation), try:

```bash
# 1. Check if Jenkins pod exists
kubectl get pods -n jenkins

# 2. If no pods, check Helm release
helm list -n jenkins

# 3. If Helm release exists but no pods, restart
helm upgrade jenkins jenkins/jenkins -n jenkins \
  --reuse-values

# 4. Or check what happened
helm status jenkins -n jenkins
```

---

## Need More Help?

Share the output of:
```bash
kubectl get all -n jenkins
kubectl describe pod <pod-name> -n jenkins  # if pod exists
helm status jenkins -n jenkins  # if using Helm
```

