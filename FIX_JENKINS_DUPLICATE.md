# Fix Jenkins Duplicate Installation

## Problem
You have **TWO Jenkins installations** running:
1. **Helm installation**: `jenkins-0` (StatefulSet) - 3h10m old
2. **kubectl installation**: `jenkins-658cf5d4fd-v22dc` (Deployment) - 27m old

The service is pointing to the Helm installation, but you also have a kubectl deployment.

---

## Solution: Choose One Installation

### Option 1: Keep Helm Installation (Recommended)

Since you installed Jenkins with Helm originally, keep that one and remove the kubectl deployment:

```bash
# Remove the kubectl deployment
kubectl delete deployment jenkins -n jenkins

# Verify only Helm installation remains
kubectl get pods -n jenkins

# Access Jenkins (Helm installation)
minikube service jenkins -n jenkins
# OR directly: http://192.168.49.2:30088
```

**Note**: The Helm installation uses StatefulSet `jenkins-0` and is already working.

---

### Option 2: Keep kubectl Installation

If you want to use the kubectl deployment instead:

```bash
# 1. Delete Helm installation
helm uninstall jenkins -n jenkins

# 2. Make sure kubectl deployment is running
kubectl get deployment jenkins -n jenkins

# 3. Update service to point to deployment
# (The service selector might need updating)
kubectl get svc jenkins -n jenkins -o yaml

# 4. Access Jenkins
minikube service jenkins -n jenkins
```

---

## Recommended: Keep Helm Installation

Since Helm is managing Jenkins and it's been running for 3+ hours, keep that one:

```bash
# Remove the duplicate kubectl deployment
kubectl delete deployment jenkins -n jenkins

# Verify
kubectl get pods -n jenkins
# Should only show: jenkins-0

# Access Jenkins
minikube service jenkins -n jenkins
```

---

## Why This Happened

You likely ran:
1. `helm install jenkins ...` (created StatefulSet)
2. `kubectl apply -f jenkins/jenkins-deployment.yaml` (created Deployment)

Both are running, causing confusion.

---

## After Fixing

Once you remove the duplicate, Jenkins should be accessible at:
- **URL**: http://192.168.49.2:30088
- **Username**: admin
- **Password**: admin (or check with `kubectl exec -n jenkins jenkins-0 -c jenkins -- cat /run/secrets/additional/chart-admin-password`)

