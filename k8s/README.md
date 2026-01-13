# Kubernetes Manifests - Complete Beginner Guide

This guide explains everything about Kubernetes manifests and how to deploy your Django + React application.

**Perfect for beginners** - Every term, command, and concept explained in simple language.

---

## 📚 Table of Contents

1. [What is Kubernetes?](#what-is-kubernetes)
2. [What are Manifests?](#what-are-manifests)
3. [Directory Structure](#directory-structure)
4. [Understanding Each File](#understanding-each-file)
5. [Common Commands Explained](#common-commands-explained)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

---

## What is Kubernetes?

**Kubernetes** (often shortened to **K8s**) is a system for running and managing containers (like Docker containers).

**Simple analogy:** 
- **Docker** = A box that contains your app
- **Kubernetes** = A warehouse that manages many boxes, ensures they're running, and connects them together

### Why Use Kubernetes?

- ✅ **Automatic restarts:** If your app crashes, Kubernetes restarts it
- ✅ **Scaling:** Easily run multiple copies of your app
- ✅ **Load balancing:** Distributes traffic across multiple copies
- ✅ **Rolling updates:** Update your app without downtime
- ✅ **Self-healing:** Automatically fixes problems

---

## What are Manifests?

**Manifests** are YAML files that describe what you want Kubernetes to create.

**Simple analogy:** Manifests are like blueprints. You give Kubernetes a blueprint, and it builds what you described.

### Example Manifest Structure

```yaml
apiVersion: v1          # Which Kubernetes API version to use
kind: Pod               # What type of thing to create (Pod, Service, etc.)
metadata:               # Information about this thing
  name: my-app          # Name of this thing
spec:                   # Specifications (what you want)
  containers:           # List of containers to run
  - name: app           # Container name
    image: myapp:latest # Docker image to use
```

---

## Directory Structure

```
k8s/
├── namespace.yaml          # Creates isolated space for your app
├── configmap.yaml          # Stores non-sensitive configuration
├── secret.yaml             # Stores sensitive data (passwords, keys)
├── postgres/               # Database configuration
│   ├── pvc.yaml           # Storage for database
│   ├── deployment.yaml    # Database container
│   └── service.yaml       # Database network access
├── backend/                # Django backend configuration
│   ├── deployment.yaml    # Backend container
│   └── service.yaml       # Backend network access
└── frontend/               # React frontend configuration
    ├── deployment.yaml    # Frontend container
    └── service.yaml       # Frontend network access
```

---

## Understanding Each File

### 1. `namespace.yaml`

**What it does:** Creates an isolated space for your application

**Why needed:** Keeps your app separate from other apps (like folders on your computer)

**Key Parts Explained:**

```yaml
apiVersion: v1
# What it means: Use Kubernetes API version 1
# Think of it as: Which version of instructions to use

kind: Namespace
# What it means: Create a namespace
# Think of it as: Creating a new folder

metadata:
  name: django-auth-app
# What it means: Name this namespace "django-auth-app"
# Think of it as: Naming the folder "django-auth-app"
```

**Command to apply:**
```bash
kubectl apply -f k8s/namespace.yaml
# What it does: Creates the namespace
# Breakdown:
#   kubectl = Kubernetes command tool
#   apply = Create or update
#   -f = From file
#   k8s/namespace.yaml = File path
```

---

### 2. `configmap.yaml`

**What it does:** Stores non-sensitive configuration (like database name, app settings)

**Why needed:** Keeps configuration separate from code (easier to change)

**Key Parts Explained:**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  POSTGRES_DB: django_auth_db
  POSTGRES_USER: django_user
# What it means: Store these values as configuration
# Think of it as: A settings file
```

**Command to view:**
```bash
kubectl get configmap -n django-auth-app
# What it does: Lists all ConfigMaps
# Breakdown:
#   kubectl get = List command
#   configmap = Type of resource
#   -n django-auth-app = In this namespace
```

---

### 3. `secret.yaml`

**What it does:** Stores sensitive data (passwords, API keys)

**Why needed:** Keeps secrets secure (Kubernetes encrypts them)

**Key Parts Explained:**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  POSTGRES_PASSWORD: cGFzc3dvcmQxMjM=
# What it means: Store password (base64 encoded)
# Think of it as: A locked safe
# Note: Values are base64 encoded (not plain text)
```

**Command to view (decoded):**
```bash
kubectl get secret app-secret -n django-auth-app -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
# What it does: Gets and decodes the password
# Breakdown:
#   kubectl get secret = Get secret
#   app-secret = Secret name
#   -o jsonpath='{.data.POSTGRES_PASSWORD}' = Extract password field
#   | base64 -d = Decode from base64
```

**⚠️ Important:** Never commit secrets.yaml with real passwords to Git!

---

### 4. `postgres/deployment.yaml`

**What it does:** Creates the PostgreSQL database container

**Why needed:** Your Django app needs a database to store data

**Key Parts Explained:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  # What it means: Run 1 copy of the database
  # Think of it as: One database server
  
  selector:
    matchLabels:
      app: postgres
  # What it means: This deployment manages pods with label "app=postgres"
  # Think of it as: Managing all "postgres" labeled pods
  
  template:
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        # What it means: Use PostgreSQL version 15
        # Think of it as: Which database software to use
        
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
        # What it means: Get database name from ConfigMap
        # Think of it as: Reading a setting from a config file
        
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        # What it means: Store database files here
        # Think of it as: Where to save files on disk
```

**Command to check:**
```bash
kubectl get deployment postgres-deployment -n django-auth-app
# What it does: Shows deployment status
# Output: Shows if database is running
```

---

### 5. `postgres/service.yaml`

**What it does:** Creates network access to the database

**Why needed:** Other pods (like backend) need to connect to the database

**Key Parts Explained:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
spec:
  selector:
    app: postgres
  # What it means: Connect to pods with label "app=postgres"
  # Think of it as: Finding the database pods
  
  ports:
  - port: 5432
    targetPort: 5432
  # What it means: Expose port 5432 (PostgreSQL default)
  # Think of it as: Opening a door on port 5432
```

**Command to check:**
```bash
kubectl get service postgres-svc -n django-auth-app
# What it does: Shows service details
# Output: Shows IP address and ports
```

---

### 6. `backend/deployment.yaml`

**What it does:** Creates the Django backend container

**Why needed:** Your backend API needs to run somewhere

**Key Parts Explained:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 1
  # What it means: Run 1 copy of backend
  # Think of it as: One backend server
  
  template:
    spec:
      initContainers:
      - name: migrate
        image: shehanapareethcurvelogics/kubernetes-example-backend:latest
        command: ['python', 'manage.py', 'migrate']
        # What it means: Run database migrations before starting app
        # Think of it as: Setting up database tables first
        
      containers:
      - name: backend
        image: shehanapareethcurvelogics/kubernetes-example-backend:latest
        # What it means: Use this Docker image
        # Think of it as: Which app version to run
        
        ports:
        - containerPort: 8000
        # What it means: App listens on port 8000
        # Think of it as: App is listening on door 8000
        
        env:
        - name: DB_HOST
          value: postgres-svc
        # What it means: Database is at "postgres-svc" (service name)
        # Think of it as: Database address
        
        livenessProbe:
          httpGet:
            path: /api/auth/health/
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        # What it means: Check if app is alive every 10 seconds
        # Think of it as: Health check to see if app is running
        
        readinessProbe:
          httpGet:
            path: /api/auth/health/
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
        # What it means: Check if app is ready to receive traffic
        # Think of it as: Check if app is ready to work
```

**Command to check:**
```bash
kubectl get deployment backend-deployment -n django-auth-app
# What it does: Shows backend deployment status
```

---

### 7. `backend/service.yaml`

**What it does:** Creates network access to the backend

**Why needed:** Frontend and users need to access the backend API

**Key Parts Explained:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
spec:
  selector:
    app: backend
  # What it means: Connect to pods with label "app=backend"
  
  ports:
  - port: 8000
    targetPort: 8000
  # What it means: Expose backend on port 8000
  # Think of it as: Making backend accessible on port 8000
```

---

### 8. `frontend/deployment.yaml`

**What it does:** Creates the React frontend container

**Why needed:** Your frontend needs to run somewhere

**Key Parts Explained:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
spec:
  replicas: 1
  # What it means: Run 1 copy of frontend
  
  template:
    spec:
      containers:
      - name: frontend
        image: shehanapareethcurvelogics/kubernetes-example-frontend:latest
        # What it means: Use this Docker image
        # Think of it as: Which frontend version to run
        
        ports:
        - containerPort: 80
        # What it means: Frontend listens on port 80 (HTTP)
        # Think of it as: Web server on port 80
```

---

### 9. `frontend/service.yaml`

**What it does:** Creates network access to the frontend (NodePort for external access)

**Why needed:** Users need to access the frontend from their browsers

**Key Parts Explained:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  type: NodePort
  # What it means: Make service accessible from outside cluster
  # Think of it as: Opening a public door
  
  selector:
    app: frontend
  # What it means: Connect to pods with label "app=frontend"
  
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
  # What it means: 
  #   port: 80 = Service listens on port 80
  #   targetPort: 80 = Forward to pod port 80
  #   nodePort: 30080 = Accessible from outside on port 30080
  # Think of it as: External port 30080 → Internal port 80
```

**Command to access:**
```bash
minikube service frontend-svc -n django-auth-app
# What it does: Gets URL to access frontend
# Output: http://192.168.49.2:30080
```

---

## Common Commands Explained

### Apply Manifests (Deploy)

```bash
# Apply all manifests
kubectl apply -f k8s/
# What it does: Creates/updates all resources
# Breakdown:
#   kubectl apply = Create or update command
#   -f k8s/ = From directory k8s/
# Think of it as: Building everything from blueprints

# Apply specific file
kubectl apply -f k8s/backend/deployment.yaml
# What it does: Creates/updates only backend deployment
# Think of it as: Building one specific thing
```

### Check Status

```bash
# Get all resources
kubectl get all -n django-auth-app
# What it does: Lists all resources (pods, services, deployments)
# Breakdown:
#   kubectl get = List command
#   all = All resource types
#   -n django-auth-app = In this namespace
# Think of it as: Checking what's running

# Get pods only
kubectl get pods -n django-auth-app
# What it does: Lists all pods (containers)
# Output example:
#   NAME                              READY   STATUS    RESTARTS   AGE
#   backend-deployment-xxxxx-xxxxx    1/1     Running   0          5m
#   frontend-deployment-xxxxx-xxxxx   1/1     Running   0          5m
#   postgres-deployment-xxxxx-xxxxx    1/1     Running   0          5m

# Get services
kubectl get services -n django-auth-app
# What it does: Lists all services (network endpoints)
# Output example:
#   NAME           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)
#   backend-svc    ClusterIP   10.96.xxx.xxx   <none>        8000/TCP
#   frontend-svc   NodePort    10.96.xxx.xxx   <none>        80:30080/TCP
#   postgres-svc   ClusterIP   10.96.xxx.xxx   <none>        5432/TCP

# Get deployments
kubectl get deployments -n django-auth-app
# What it does: Lists all deployments
# Output example:
#   NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
#   backend-deployment    1/1     1            1           5m
#   frontend-deployment   1/1     1            1           5m
#   postgres-deployment   1/1     1            1           5m
```

### View Logs

```bash
# View backend logs
kubectl logs -n django-auth-app -l app=backend --tail=50
# What it does: Shows last 50 lines of backend logs
# Breakdown:
#   kubectl logs = View logs command
#   -n django-auth-app = In this namespace
#   -l app=backend = Select pods with label "app=backend"
#   --tail=50 = Show last 50 lines
# Think of it as: Reading a logbook

# View logs for specific pod
kubectl logs -n django-auth-app backend-deployment-xxxxx-xxxxx
# What it does: Shows logs for one specific pod
# Breakdown:
#   backend-deployment-xxxxx-xxxxx = Pod name (from kubectl get pods)

# Follow logs (real-time)
kubectl logs -n django-auth-app -l app=backend -f
# What it does: Shows logs and updates in real-time
# Breakdown:
#   -f = Follow (like tail -f)
# Think of it as: Watching a live log

# View init container logs (migrations)
kubectl logs -n django-auth-app backend-deployment-xxxxx-xxxxx -c migrate
# What it does: Shows logs from "migrate" container
# Breakdown:
#   -c migrate = Container name
# Think of it as: Reading logs from a specific container
```

### Describe Resources (Get Details)

```bash
# Describe a pod
kubectl describe pod -n django-auth-app backend-deployment-xxxxx-xxxxx
# What it does: Shows detailed information about a pod
# Output includes:
#   - Status
#   - Events (what happened)
#   - Environment variables
#   - Volumes
# Think of it as: Reading a detailed report

# Describe a deployment
kubectl describe deployment backend-deployment -n django-auth-app
# What it does: Shows deployment details
# Output includes:
#   - Replicas
#   - Image
#   - Conditions
# Think of it as: Reading deployment report
```

### Port Forwarding (Access Services)

```bash
# Forward frontend port
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80
# What it does: Creates tunnel from localhost:8080 to service port 80
# Breakdown:
#   kubectl port-forward = Create tunnel command
#   -n django-auth-app = In this namespace
#   svc/frontend-svc = Service name
#   8080:80 = Local port 8080 → Service port 80
# Access: http://localhost:8080
# Think of it as: Creating a bridge

# Forward backend port
kubectl port-forward -n django-auth-app svc/backend-svc 8000:8000
# What it does: Creates tunnel from localhost:8000 to service port 8000
# Access: http://localhost:8000
```

### Execute Commands in Pods

```bash
# Run Django management command
kubectl exec -n django-auth-app backend-deployment-xxxxx-xxxxx -- python manage.py createsuperuser
# What it does: Runs command inside the pod
# Breakdown:
#   kubectl exec = Execute command
#   backend-deployment-xxxxx-xxxxx = Pod name
#   -- = Separator (everything after runs inside pod)
#   python manage.py createsuperuser = Command to run
# Think of it as: Running a command inside a container

# Open shell in pod
kubectl exec -it -n django-auth-app backend-deployment-xxxxx-xxxxx -- /bin/bash
# What it does: Opens interactive shell
# Breakdown:
#   -it = Interactive terminal
#   -- /bin/bash = Run bash shell
# Think of it as: Opening a terminal inside the container
```

### Scale Application

```bash
# Scale backend to 3 replicas
kubectl scale deployment backend-deployment --replicas=3 -n django-auth-app
# What it does: Runs 3 copies of backend
# Breakdown:
#   kubectl scale = Scale command
#   deployment backend-deployment = Deployment name
#   --replicas=3 = Run 3 copies
#   -n django-auth-app = In this namespace
# Think of it as: Running 3 servers instead of 1

# Check scaling status
kubectl get pods -n django-auth-app -l app=backend
# What it does: Shows all backend pods
# Output: Should show 3 pods running
```

### Delete Resources

```bash
# Delete specific resource
kubectl delete deployment backend-deployment -n django-auth-app
# What it does: Deletes the deployment (and its pods)
# Breakdown:
#   kubectl delete = Delete command
#   deployment backend-deployment = Resource to delete
#   -n django-auth-app = In this namespace
# Think of it as: Removing something

# Delete everything in namespace
kubectl delete namespace django-auth-app
# What it does: Deletes entire namespace (everything!)
# ⚠️ Warning: This deletes ALL resources in the namespace
# Think of it as: Deleting an entire folder

# Delete from file
kubectl delete -f k8s/backend/deployment.yaml
# What it does: Deletes resources defined in file
# Think of it as: Removing things based on blueprint
```

---

## Deployment Process

### Step-by-Step Deployment

```bash
# Step 1: Create namespace
kubectl apply -f k8s/namespace.yaml
# What it does: Creates isolated space
# Think of it as: Creating a new folder

# Step 2: Create ConfigMap (non-sensitive config)
kubectl apply -f k8s/configmap.yaml
# What it does: Stores configuration
# Think of it as: Creating a settings file

# Step 3: Create Secret (sensitive data)
kubectl apply -f k8s/secret.yaml
# What it does: Stores passwords securely
# Think of it as: Creating a locked safe

# Step 4: Deploy PostgreSQL
kubectl apply -f k8s/postgres/
# What it does: Creates database
# Think of it as: Setting up database server

# Step 5: Deploy Backend
kubectl apply -f k8s/backend/
# What it does: Creates Django backend
# Think of it as: Setting up API server

# Step 6: Deploy Frontend
kubectl apply -f k8s/frontend/
# What it does: Creates React frontend
# Think of it as: Setting up web server

# Step 7: Check status
kubectl get all -n django-auth-app
# What it does: Verifies everything is running
# Think of it as: Checking if everything is working
```

### Wait for Deployment

```bash
# Wait for backend to be ready
kubectl wait --for=condition=available deployment/backend-deployment -n django-auth-app --timeout=300s
# What it does: Waits until backend is ready (up to 5 minutes)
# Breakdown:
#   kubectl wait = Wait command
#   --for=condition=available = Wait until available
#   deployment/backend-deployment = Deployment name
#   --timeout=300s = Stop waiting after 5 minutes
# Think of it as: Waiting for something to finish

# Wait for frontend to be ready
kubectl wait --for=condition=available deployment/frontend-deployment -n django-auth-app --timeout=300s
# What it does: Waits until frontend is ready
```

---

## Troubleshooting

### Problem: Pod Status is "Pending"

**What it means:** Pod can't start (usually resource or image issues)

**Check:**
```bash
# Describe pod to see why
kubectl describe pod -n django-auth-app <pod-name>

# Check events
kubectl get events -n django-auth-app --sort-by='.lastTimestamp'
```

**Common causes:**
- Image not found (ImagePullBackOff)
- Not enough resources
- Node not available

---

### Problem: Pod Status is "CrashLoopBackOff"

**What it means:** Pod keeps crashing and restarting

**Check:**
```bash
# View logs to see error
kubectl logs -n django-auth-app <pod-name>

# View previous container logs (if crashed)
kubectl logs -n django-auth-app <pod-name> --previous
```

**Common causes:**
- Application error (check logs)
- Database connection failed
- Missing environment variables
- Health check failing

---

### Problem: Pod Status is "ImagePullBackOff"

**What it means:** Kubernetes can't download the Docker image

**Check:**
```bash
# Describe pod
kubectl describe pod -n django-auth-app <pod-name>

# Check if image exists
docker pull <image-name>
```

**Solutions:**
```bash
# Load image into Minikube
minikube image load <image-name>

# Or push to Docker Hub and ensure imagePullPolicy is correct
```

---

### Problem: Service Has No Endpoints

**What it means:** Service can't find pods to connect to

**Check:**
```bash
# Check service selector
kubectl get service -n django-auth-app <service-name> -o yaml

# Check pod labels match service selector
kubectl get pods -n django-auth-app --show-labels
```

**Solution:** Ensure pod labels match service selector

---

### Problem: Can't Access Application

**Check:**
```bash
# Check pods are running
kubectl get pods -n django-auth-app

# Check services
kubectl get services -n django-auth-app

# Try port-forward
kubectl port-forward -n django-auth-app svc/frontend-svc 8080:80
```

---

## Key Concepts Summary

| Term | Simple Explanation |
|------|-------------------|
| **Pod** | One or more containers running together |
| **Deployment** | Manages pods (creates, updates, deletes) |
| **Service** | Network endpoint to access pods |
| **Namespace** | Isolated area in Kubernetes |
| **ConfigMap** | Stores non-sensitive configuration |
| **Secret** | Stores sensitive data (encrypted) |
| **PVC** | Persistent storage (like a hard drive) |
| **NodePort** | Makes service accessible from outside |
| **ClusterIP** | Internal service (only accessible inside cluster) |
| **Selector** | How services find pods |
| **Replica** | Copy of a pod |
| **Probe** | Health check (liveness/readiness) |

---

## Database Storage - Where is Data Stored?

### Understanding Database Storage

**Where is the data stored?**

In Kubernetes, database data is stored in a **PersistentVolume** (PV), which is like a hard drive that persists even if the pod restarts.

**Storage Flow:**
```
PostgreSQL Pod → PersistentVolumeClaim (PVC) → PersistentVolume (PV) → Physical Storage
```

**In your setup:**
- **PVC Name:** `postgres-pvc`
- **Storage Size:** 5GB
- **Storage Location:** Inside Minikube's virtual machine (on your computer)
- **Mount Path:** `/var/lib/postgresql/data` (inside the container)

### Check Storage Status

```bash
# Check PersistentVolumeClaim (storage request)
kubectl get pvc -n django-auth-app
# What it does: Shows storage claims
# Output example:
#   NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
#   postgres-pvc   Bound    pvc-xxxxx-xxxxx-xxxxx                      5Gi        RWO            standard       6h

# Check PersistentVolume (actual storage)
kubectl get pv
# What it does: Shows all storage volumes
# Output example:
#   NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM
#   pvc-xxxxx-xxxxx-xxxxx                      5Gi        RWO            Delete           Bound    django-auth-app/postgres-pvc

# Get detailed storage information
kubectl describe pvc postgres-pvc -n django-auth-app
# What it does: Shows detailed storage information
# Output includes:
#   - Volume name
#   - Storage class
#   - Access modes
#   - Capacity
```

### Where Data is Physically Stored (Minikube)

**In Minikube, data is stored on the Minikube node's filesystem:**

```bash
# Find where Minikube stores data
minikube ssh
# What it does: Opens SSH session to Minikube VM
# Then inside Minikube:
ls -la /tmp/hostpath-provisioner/
# What it does: Lists storage directories
# You'll see directories like: pvc-xxxxx-xxxxx-xxxxx

# Or check from outside Minikube
minikube ssh -- ls -la /tmp/hostpath-provisioner/
# What it does: Lists storage directories without entering Minikube
```

**Important:** In Minikube, data is stored in `/tmp/hostpath-provisioner/` inside the Minikube VM. This is temporary storage that gets deleted if you delete Minikube!

---

## How to View Database Data

### Method 1: Connect to Database Using kubectl exec

```bash
# Connect to PostgreSQL database
kubectl exec -it -n django-auth-app deployment/postgres-deployment -- psql -U django_user -d django_auth_db
# What it does: Opens PostgreSQL command-line interface
# Breakdown:
#   kubectl exec = Execute command in pod
#   -it = Interactive terminal
#   deployment/postgres-deployment = PostgreSQL deployment
#   -- = Separator
#   psql = PostgreSQL command-line tool
#   -U django_user = Username
#   -d django_auth_db = Database name

# Once connected, you can run SQL commands:
# List all tables
\dt

# View all users
SELECT * FROM authentication_user;

# View all data in a table
SELECT * FROM authentication_user LIMIT 10;

# Count records
SELECT COUNT(*) FROM authentication_user;

# Exit PostgreSQL
\q
```

### Method 2: Run SQL Commands Directly

```bash
# Run a single SQL command
kubectl exec -n django-auth-app deployment/postgres-deployment -- psql -U django_user -d django_auth_db -c "SELECT COUNT(*) FROM authentication_user;"
# What it does: Runs SQL command and shows result
# Output: Shows count of users

# List all tables
kubectl exec -n django-auth-app deployment/postgres-deployment -- psql -U django_user -d django_auth_db -c "\dt"
# What it does: Lists all tables in database

# View table structure
kubectl exec -n django-auth-app deployment/postgres-deployment -- psql -U django_user -d django_auth_db -c "\d authentication_user"
# What it does: Shows table structure (columns, types, etc.)
```

### Method 3: View Data Files (Advanced)

```bash
# List database files inside the container
kubectl exec -n django-auth-app deployment/postgres-deployment -- ls -la /var/lib/postgresql/data
# What it does: Lists database files
# Output: Shows PostgreSQL data files (base/, pg_wal/, etc.)

# Check database file size
kubectl exec -n django-auth-app deployment/postgres-deployment -- du -sh /var/lib/postgresql/data
# What it does: Shows total size of database files
# Output: Shows size in MB/GB
```

### Method 4: Use Django Management Commands

```bash
# Connect to Django shell
kubectl exec -it -n django-auth-app deployment/backend-deployment -- python manage.py shell
# What it does: Opens Django Python shell
# Then you can run Django commands:
#   from authentication.models import User
#   User.objects.all()
#   User.objects.count()

# Or run Django commands directly
kubectl exec -n django-auth-app deployment/backend-deployment -- python manage.py dbshell
# What it does: Opens database shell via Django
# This connects to PostgreSQL and opens psql
```

---

## Backup and Restore Database

### Backup Database

```bash
# Create a backup
kubectl exec -n django-auth-app deployment/postgres-deployment -- pg_dump -U django_user django_auth_db > backup.sql
# What it does: Exports database to backup.sql file
# Breakdown:
#   pg_dump = PostgreSQL backup tool
#   -U django_user = Username
#   django_auth_db = Database name
#   > backup.sql = Save to file

# Or backup directly from pod
kubectl exec -n django-auth-app deployment/postgres-deployment -- pg_dump -U django_user django_auth_db | kubectl exec -i -n django-auth-app deployment/postgres-deployment -- cat > backup.sql
```

### Restore Database

```bash
# Restore from backup
kubectl exec -i -n django-auth-app deployment/postgres-deployment -- psql -U django_user -d django_auth_db < backup.sql
# What it does: Restores database from backup file
# Breakdown:
#   psql = PostgreSQL command tool
#   -i = Read from stdin
#   < backup.sql = Read from file
```

---

## Important Notes About Storage

### ⚠️ Minikube Storage Limitations

1. **Temporary Storage:** Data is stored in Minikube VM, which gets deleted if you run `minikube delete`
2. **Not Production:** Minikube storage is for development only
3. **Backup Important Data:** Always backup important data before deleting Minikube

### ✅ Production Storage

In production (real Kubernetes clusters), storage is typically:
- **Cloud Storage:** AWS EBS, Azure Disk, Google Persistent Disk
- **Network Storage:** NFS, Ceph, GlusterFS
- **Persistent:** Data survives cluster restarts and pod deletions

### 🔄 Data Persistence

**What happens when you delete a pod?**
- ✅ **Data survives** - Stored in PersistentVolume
- ✅ **New pod** - Can mount the same volume
- ✅ **Data intact** - All your data is still there

**What happens when you delete the PVC?**
- ⚠️ **Data might be deleted** - Depends on Reclaim Policy
- ⚠️ **In Minikube:** Data is usually deleted
- ⚠️ **In Production:** Usually retained (depends on storage class)

---

## Next Steps

1. ✅ Read `docs.md` in root directory for complete setup
2. ✅ Practice applying manifests manually
3. ✅ Learn to read pod logs
4. ✅ Understand service networking
5. ✅ Practice troubleshooting common issues
6. ✅ **Learn to access and view database data** (this section!)

---

**Remember:** Kubernetes is powerful but complex. Take your time, experiment, and learn step by step! 🚀
