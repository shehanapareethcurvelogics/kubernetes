# Complete Guide: Converting Docker Compose to Kubernetes with Minikube

## 📋 Table of Contents

1. [Overview: Docker Compose vs Kubernetes](#overview)
2. [Architecture Comparison](#architecture-comparison)
3. [Kubernetes Concepts Explained](#kubernetes-concepts)
4. [Step-by-Step Migration](#step-by-step-migration)
5. [Kubernetes Manifests](#kubernetes-manifests)
6. [Deployment Instructions](#deployment-instructions)
7. [Managing Your Application](#managing-your-application)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview: Docker Compose vs Kubernetes {#overview}

### What You Have Now (Docker Compose)

```
┌─────────────────────────────────────────────────────────┐
│              Docker Compose Architecture                │
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────┐      ┌──────────────┐                │
│  │   Frontend   │──────│   Backend    │                │
│  │  (React)     │      │   (Django)   │                │
│  │  Port: 3000  │      │  Port: 8000  │                │
│  └──────────────┘      └──────┬───────┘                │
│                               │                         │
│                        ┌──────▼───────┐                │
│                        │  PostgreSQL  │                │
│                        │  Port: 5433  │                │
│                        └──────────────┘                │
│                                                          │
│  All containers run on ONE machine                      │
│  Docker Compose manages:                                │
│  - Container creation                                   │
│  - Networking between containers                        │
│  - Volume management                                    │
│  - Service dependencies                                 │
└─────────────────────────────────────────────────────────┘
```

### What You'll Have (Kubernetes)

```
┌─────────────────────────────────────────────────────────┐
│            Kubernetes Architecture (Minikube)           │
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Kubernetes Cluster (Minikube)          │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │         Frontend Service (NodePort)      │  │  │
│  │  │  ┌──────────┐  ┌──────────┐             │  │  │
│  │  │  │ Frontend │  │ Frontend │  (Pods)     │  │  │
│  │  │  │  Pod 1   │  │  Pod 2   │             │  │  │
│  │  │  └──────────┘  └──────────┘             │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  │                                                  │  │
│  │  ┌──────────────────────────────────────────┐  │  │
│  │  │         Backend Service (ClusterIP)       │  │  │
│  │  │  ┌──────────┐  ┌──────────┐             │  │  │
│  │  │  │ Backend  │  │ Backend  │  (Pods)     │  │  │
│  │  │  │  Pod 1   │  │  Pod 2   │             │  │  │
│  │  │  └────┬─────┘  └────┬─────┘             │  │  │
│  │  └───────┼─────────────┼───────────────────┘  │  │
│  │          │             │                       │  │
│  │  ┌───────▼─────────────▼───────────────────┐  │  │
│  │  │      PostgreSQL Service (ClusterIP)      │  │  │
│  │  │  ┌──────────┐                           │  │  │
│  │  │  │   DB     │  (Pod with PersistentVol) │  │  │
│  │  │  │   Pod    │                           │  │  │
│  │  │  └──────────┘                           │  │  │
│  │  └──────────────────────────────────────────┘  │  │
│  │                                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Kubernetes manages:                                     │
│  - Pod creation and scheduling                          │
│  - Service discovery and load balancing                 │
│  - Health checks and auto-restart                       │
│  - Scaling (horizontal pod autoscaling)                 │
│  - Persistent storage                                    │
│  - Configuration management                             │
└─────────────────────────────────────────────────────────┘
```

### Key Differences

| Feature | Docker Compose | Kubernetes |
|---------|---------------|------------|
| **Orchestration** | Single machine | Cluster (even with 1 node) |
| **Scaling** | Manual | Automatic (can scale pods) |
| **Service Discovery** | Service names | DNS-based service discovery |
| **Health Checks** | Basic | Advanced (liveness, readiness) |
| **Rolling Updates** | Manual | Automatic |
| **Configuration** | Environment variables | ConfigMaps & Secrets |
| **Storage** | Named volumes | PersistentVolumes |
| **Networking** | Bridge network | Cluster networking |

---

## 🏗️ Architecture Comparison {#architecture-comparison}

### Docker Compose Request Flow

```
User Request Flow:
┌────────┐
│ Browser│
└───┬────┘
    │ HTTP Request: http://localhost:3000
    │
    ▼
┌─────────────────┐
│  Docker Host    │
│  Port: 3000     │
└───┬─────────────┘
    │
    ▼
┌─────────────────┐      ┌─────────────────┐
│  Frontend       │──────│  Backend        │
│  Container      │      │  Container      │
│  (nginx)        │      │  (Django)       │
│  Port: 80       │      │  Port: 8000     │
└─────────────────┘      └───┬─────────────┘
                             │
                             │ Internal Docker Network
                             │ Service name: "backend"
                             │
                             ▼
                    ┌─────────────────┐
                    │  PostgreSQL      │
                    │  Container       │
                    │  Port: 5432      │
                    └─────────────────┘
```

### Kubernetes Request Flow

```
User Request Flow:
┌────────┐
│ Browser│
└───┬────┘
    │ HTTP Request: http://minikube-ip:NodePort
    │
    ▼
┌─────────────────────────────────────┐
│      Minikube Cluster               │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Frontend Service (NodePort) │ │
│  │   Port: 30080                 │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│              │ Service Discovery    │
│              │ (DNS: frontend-svc)  │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐ │
│  │   Frontend Pods               │ │
│  │   (nginx containers)          │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│              │ Internal Cluster     │
│              │ Network              │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐ │
│  │   Backend Service (ClusterIP) │ │
│  │   DNS: backend-svc            │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐ │
│  │   Backend Pods                │ │
│  │   (Django containers)         │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐ │
│  │   PostgreSQL Service          │ │
│  │   DNS: postgres-svc           │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│              ▼                      │
│  ┌───────────────────────────────┐ │
│  │   PostgreSQL Pod              │ │
│  │   (with PersistentVolume)     │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📚 Kubernetes Concepts Explained {#kubernetes-concepts}

### 1. Pod
**What it is:** The smallest deployable unit in Kubernetes. A pod contains one or more containers.

```
┌─────────────┐
│     Pod     │
│  ┌────────┐ │
│  │Container│ │  ← Your application container
│  └────────┘ │
│             │
│  Shared:    │
│  - Network  │
│  - Storage  │
│  - IP       │
└─────────────┘
```

**In your project:**
- Frontend Pod: Contains nginx container serving React app
- Backend Pod: Contains Django container
- Database Pod: Contains PostgreSQL container

### 2. Deployment
**What it is:** Manages pods. Ensures desired number of pods are running. Handles updates and rollbacks.

```
┌──────────────────┐
│   Deployment     │
│                  │
│  Desired: 2 pods │
│                  │
│  ┌────┐  ┌────┐ │
│  │Pod │  │Pod │ │  ← Managed by Deployment
│  └────┘  └────┘ │
└──────────────────┘
```

**Why use it:**
- Auto-restart failed pods
- Scale up/down pods
- Rolling updates (zero downtime)
- Rollback to previous version

### 3. Service
**What it is:** Provides stable network endpoint to access pods. Load balances traffic.

```
┌──────────────────┐
│     Service      │
│  frontend-svc    │
│  Port: 80        │
└────────┬─────────┘
         │
    ┌────┼────┐
    │    │    │
┌───▼─┐ ┌▼───┐ ┌▼───┐
│ Pod │ │Pod │ │Pod │  ← Load balances between pods
└─────┘ └────┘ └────┘
```

**Service Types:**
- **ClusterIP**: Internal access only (default)
- **NodePort**: Expose on each node's IP at a static port
- **LoadBalancer**: External IP (cloud providers)

### 4. ConfigMap
**What it is:** Stores non-sensitive configuration data (key-value pairs).

```
┌──────────────────┐
│   ConfigMap      │
│                  │
│  DEBUG=1         │
│  DB_HOST=db      │
│  ...             │
└────────┬─────────┘
         │
         │ Mounted as
         │ environment
         │ variables
         │
    ┌────▼────┐
    │   Pod   │
    └─────────┘
```

### 5. Secret
**What it is:** Stores sensitive data (passwords, API keys) in base64 encoded format.

```
┌──────────────────┐
│     Secret       │
│                  │
│  DB_PASSWORD     │  ← Base64 encoded
│  SECRET_KEY      │
│  ...             │
└────────┬─────────┘
         │
         │ Mounted as
         │ environment
         │ variables
         │
    ┌────▼────┐
    │   Pod   │
    └─────────┘
```

### 6. PersistentVolume (PV) & PersistentVolumeClaim (PVC)
**What it is:** Provides persistent storage that survives pod restarts.

```
┌──────────────────┐
│ PersistentVolume │  ← Storage resource in cluster
│  (PV)            │
└────────┬─────────┘
         │
         │ Claimed by
         │
┌────────▼─────────┐
│ PersistentVolume │  ← Request for storage
│  Claim (PVC)     │
└────────┬─────────┘
         │
         │ Mounted to
         │
    ┌────▼────┐
    │   Pod   │
    └─────────┘
```

---

## 🔄 Step-by-Step Migration {#step-by-step-migration}

### Step 1: Create Kubernetes Directory Structure

```
kubernetes/
├── k8s/                          ← All Kubernetes manifests go here
│   ├── namespace.yaml            ← Create a namespace for your app
│   ├── configmap.yaml            ← Configuration (non-sensitive)
│   ├── secret.yaml               ← Sensitive data (passwords, keys)
│   ├── postgres/
│   │   ├── deployment.yaml      ← PostgreSQL deployment
│   │   ├── service.yaml          ← PostgreSQL service
│   │   └── pvc.yaml              ← Database storage
│   ├── backend/
│   │   ├── deployment.yaml      ← Django backend deployment
│   │   └── service.yaml          ← Backend service
│   └── frontend/
│       ├── deployment.yaml      ← React frontend deployment
│       └── service.yaml          ← Frontend service (NodePort)
```

### Step 2: Map Docker Compose to Kubernetes

| Docker Compose | Kubernetes Equivalent |
|----------------|----------------------|
| `services.db` | `postgres/deployment.yaml` + `postgres/service.yaml` |
| `services.backend` | `backend/deployment.yaml` + `backend/service.yaml` |
| `services.frontend` | `frontend/deployment.yaml` + `frontend/service.yaml` |
| `environment:` | `configmap.yaml` + `secret.yaml` |
| `volumes:` | `PersistentVolumeClaim` |
| `ports:` | `Service` (NodePort for external access) |
| `depends_on:` | `initContainers` or startup probes |

---

## 📄 Kubernetes Manifests {#kubernetes-manifests}

### 1. Namespace

**File: `k8s/namespace.yaml`**

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: django-auth-app
  labels:
    name: django-auth-app
```

**Explanation:**
- Creates an isolated namespace for your application
- Like a virtual folder in Kubernetes
- All resources will be created in this namespace

### 2. ConfigMap (Non-sensitive Configuration)

**File: `k8s/configmap.yaml`**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: django-auth-app
data:
  DEBUG: "1"
  POSTGRES_DB: "django_auth_db"
  POSTGRES_USER: "django_user"
  # Database host will be the service name
  DB_HOST: "postgres-svc"
  DB_PORT: "5432"
```

**Explanation:**
- Stores configuration as key-value pairs
- Mounted as environment variables in pods
- Can be updated without rebuilding images

### 3. Secret (Sensitive Data)

**File: `k8s/secret.yaml`**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: django-auth-app
type: Opaque
data:
  # Base64 encoded values
  # To encode: echo -n "your-password" | base64
  POSTGRES_PASSWORD: ZGphbmdvX3Bhc3M=  # django_pass
  SECRET_KEY: ZGphbmdvLWluc2VjdXJlLWNoYW5nZS10aGlzLWluLXByb2R1Y3Rpb24tMTIzNDU=  # django-insecure-change-this-in-production-12345
```

**How to create secrets:**

```bash
# Method 1: Using kubectl (recommended)
kubectl create secret generic app-secrets \
  --from-literal=POSTGRES_PASSWORD=django_pass \
  --from-literal=SECRET_KEY=django-insecure-change-this-in-production-12345 \
  --namespace=django-auth-app

# Method 2: Encode manually
echo -n "django_pass" | base64
# Output: ZGphbmdvX3Bhc3M=
```

**Explanation:**
- Stores sensitive data (base64 encoded, not encrypted)
- Mounted as environment variables
- Never commit real secrets to git!

### 4. PostgreSQL PersistentVolumeClaim

**File: `k8s/postgres/pvc.yaml`**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: django-auth-app
spec:
  accessModes:
    - ReadWriteOnce  # Can be mounted by one pod at a time
  resources:
    requests:
      storage: 5Gi  # Request 5GB of storage
  storageClassName: standard  # Minikube uses "standard" storage class
```

**Explanation:**
- Requests persistent storage for database
- Data survives pod restarts
- Minikube automatically creates a PersistentVolume

### 5. PostgreSQL Deployment

**File: `k8s/postgres/deployment.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
  namespace: django-auth-app
  labels:
    app: postgres
spec:
  replicas: 1  # Only one database instance
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
        - name: POSTGRES_USER
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: POSTGRES_PASSWORD
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - django_user
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - django_user
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

**Explanation:**
- **replicas: 1**: Only one database pod (databases usually don't scale horizontally)
- **env**: Environment variables from ConfigMap and Secret
- **volumeMounts**: Mounts PVC to `/var/lib/postgresql/data`
- **livenessProbe**: Checks if database is alive, restarts if not
- **readinessProbe**: Checks if database is ready to accept connections

### 6. PostgreSQL Service

**File: `k8s/postgres/service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: django-auth-app
  labels:
    app: postgres
spec:
  type: ClusterIP  # Internal access only
  ports:
  - port: 5432
    targetPort: 5432
    protocol: TCP
  selector:
    app: postgres
```

**Explanation:**
- **type: ClusterIP**: Only accessible within cluster
- **selector**: Routes traffic to pods with label `app: postgres`
- **DNS name**: `postgres-svc.django-auth-app.svc.cluster.local`
- **Short DNS**: `postgres-svc` (within same namespace)

### 7. Backend Deployment

**File: `k8s/backend/deployment.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: django-auth-app
  labels:
    app: backend
spec:
  replicas: 2  # Run 2 backend pods for high availability
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      initContainers:
      # Run migrations before starting the app
      - name: migrate
        image: your-registry/backend:latest  # Replace with your image
        command:
        - sh
        - -c
        - |
          python manage.py makemigrations
          python manage.py migrate
        env:
        - name: DATABASE_URL
          value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-svc:5432/$(POSTGRES_DB)"
        - name: POSTGRES_USER
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: POSTGRES_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
      containers:
      - name: backend
        image: your-registry/backend:latest  # Replace with your image
        ports:
        - containerPort: 8000
        env:
        - name: DEBUG
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: DEBUG
        - name: DATABASE_URL
          value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-svc:5432/$(POSTGRES_DB)"
        - name: POSTGRES_USER
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: POSTGRES_PASSWORD
        - name: POSTGRES_DB
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: POSTGRES_DB
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: SECRET_KEY
        livenessProbe:
          httpGet:
            path: /api/auth/user/
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/auth/user/
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
```

**Explanation:**
- **replicas: 2**: Two backend pods for load balancing
- **initContainers**: Runs migrations before main container starts
- **livenessProbe**: Checks if Django is responding
- **readinessProbe**: Checks if Django is ready to serve requests

### 8. Backend Service

**File: `k8s/backend/service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
  namespace: django-auth-app
  labels:
    app: backend
spec:
  type: ClusterIP  # Internal access only
  ports:
  - port: 8000
    targetPort: 8000
    protocol: TCP
  selector:
    app: backend
```

**Explanation:**
- **type: ClusterIP**: Only accessible from within cluster
- Frontend will access backend via this service
- DNS name: `backend-svc`

### 9. Frontend Deployment

**File: `k8s/frontend/deployment.yaml`**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: django-auth-app
  labels:
    app: frontend
spec:
  replicas: 2  # Run 2 frontend pods
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/frontend:latest  # Replace with your image
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

**Explanation:**
- **replicas: 2**: Two frontend pods for load balancing
- **containerPort: 80**: nginx serves on port 80
- Health checks ensure pods are working

**Note:** You need to update `frontend/nginx.conf` to use Kubernetes service name:

```nginx
# In frontend/nginx.conf, change:
proxy_pass http://backend:8000;

# To:
proxy_pass http://backend-svc.django-auth-app.svc.cluster.local:8000;
# Or simply (within same namespace):
proxy_pass http://backend-svc:8000;
```

### 10. Frontend Service (NodePort)

**File: `k8s/frontend/service.yaml`**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: django-auth-app
  labels:
    app: frontend
spec:
  type: NodePort  # Expose externally
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080  # External port (30000-32767 range)
    protocol: TCP
  selector:
    app: frontend
```

**Explanation:**
- **type: NodePort**: Exposes service on each node's IP
- **nodePort: 30080**: Accessible at `minikube-ip:30080`
- External access: `http://$(minikube ip):30080`

---

## 🚀 Deployment Instructions {#deployment-instructions}

### Prerequisites

1. ✅ Minikube is running (`minikube status`)
2. ✅ kubectl is configured (`kubectl get nodes`)
3. ✅ Docker images are built

### Step 1: Build Docker Images

First, you need to build your Docker images and make them available to Minikube.

**Option A: Use Minikube's Docker daemon (Recommended)**

```bash
# Point Docker to Minikube's Docker daemon
eval $(minikube docker-env)

# Build images
cd backend
docker build -t backend:latest .
cd ../frontend
docker build -t frontend:latest .
cd ..

# Verify images
docker images | grep -E "backend|frontend"
```

**Option B: Load images into Minikube**

```bash
# Build images normally
cd backend
docker build -t backend:latest .
cd ../frontend
docker build -t frontend:latest .

# Load into Minikube
minikube image load backend:latest
minikube image load frontend:latest
```

### Step 2: Update Image Names in Manifests

Update the image names in your deployment files:

```bash
# In k8s/backend/deployment.yaml, change:
image: your-registry/backend:latest
# To:
image: backend:latest

# In k8s/frontend/deployment.yaml, change:
image: your-registry/frontend:latest
# To:
image: frontend:latest
```

### Step 3: Create Kubernetes Resources

Apply manifests in order:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Create ConfigMap and Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 3. Create PostgreSQL resources
kubectl apply -f k8s/postgres/pvc.yaml
kubectl apply -f k8s/postgres/deployment.yaml
kubectl apply -f k8s/postgres/service.yaml

# 4. Wait for database to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n django-auth-app --timeout=120s

# 5. Create backend resources
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml

# 6. Create frontend resources
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml

# Or apply all at once:
kubectl apply -f k8s/
```

### Step 4: Verify Deployment

```bash
# Check all resources
kubectl get all -n django-auth-app

# Expected output:
# NAME                                      READY   STATUS    RESTARTS   AGE
# pod/backend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
# pod/backend-deployment-xxxxx-xxxxx        1/1     Running   0          2m
# pod/frontend-deployment-xxxxx-xxxxx       1/1     Running   0          1m
# pod/frontend-deployment-xxxxx-xxxxx       1/1     Running   0          1m
# pod/postgres-deployment-xxxxx-xxxxx       1/1     Running   0          3m
#
# NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
# service/backend-svc      ClusterIP   10.96.x.x       <none>        8000/TCP       2m
# service/frontend-svc     NodePort    10.96.x.x       <none>        80:30080/TCP   1m
# service/postgres-svc     ClusterIP   10.96.x.x       <none>        5432/TCP       3m
#
# NAME                                 READY   UP-TO-DATE   AVAILABLE   AGE
# deployment.apps/backend-deployment   2/2     2            2           2m
# deployment.apps/frontend-deployment  2/2     2            2           1m
# deployment.apps/postgres-deployment  1/1     1            1           3m
```

### Step 5: Access Your Application

```bash
# Get Minikube IP
minikube ip

# Access frontend (replace <minikube-ip> with actual IP)
# Example: http://192.168.49.2:30080

# Or use minikube service command
minikube service frontend-svc -n django-auth-app
```

### Step 6: Check Logs

```bash
# Backend logs
kubectl logs -f deployment/backend-deployment -n django-auth-app

# Frontend logs
kubectl logs -f deployment/frontend-deployment -n django-auth-app

# Database logs
kubectl logs -f deployment/postgres-deployment -n django-auth-app

# All pods logs
kubectl logs -f -l app=backend -n django-auth-app
```

---

## 🛠️ Managing Your Application {#managing-your-application}

### Scaling

```bash
# Scale backend to 3 pods
kubectl scale deployment backend-deployment --replicas=3 -n django-auth-app

# Scale frontend to 4 pods
kubectl scale deployment frontend-deployment --replicas=4 -n django-auth-app

# Check scaling status
kubectl get deployments -n django-auth-app
```

### Rolling Updates

```bash
# Update backend image
kubectl set image deployment/backend-deployment backend=backend:v2 -n django-auth-app

# Watch rollout status
kubectl rollout status deployment/backend-deployment -n django-auth-app

# Rollback if something goes wrong
kubectl rollout undo deployment/backend-deployment -n django-auth-app
```

### Port Forwarding (Alternative to NodePort)

```bash
# Forward frontend port
kubectl port-forward service/frontend-svc 3000:80 -n django-auth-app
# Access at http://localhost:3000

# Forward backend port
kubectl port-forward service/backend-svc 8000:8000 -n django-auth-app
# Access at http://localhost:8000
```

### Executing Commands in Pods

```bash
# Run Django management commands
kubectl exec -it deployment/backend-deployment -n django-auth-app -- python manage.py createsuperuser

# Access database shell
kubectl exec -it deployment/postgres-deployment -n django-auth-app -- psql -U django_user -d django_auth_db

# Get shell access
kubectl exec -it deployment/backend-deployment -n django-auth-app -- /bin/sh
```

### Viewing Resources

```bash
# Describe a pod
kubectl describe pod <pod-name> -n django-auth-app

# Describe a service
kubectl describe service backend-svc -n django-auth-app

# Get events
kubectl get events -n django-auth-app --sort-by='.lastTimestamp'

# Get resource usage
kubectl top pods -n django-auth-app
```

### Deleting Resources

```bash
# Delete specific resource
kubectl delete deployment backend-deployment -n django-auth-app

# Delete all resources in namespace
kubectl delete all --all -n django-auth-app

# Delete namespace (deletes everything)
kubectl delete namespace django-auth-app
```

---

## 🔧 Troubleshooting {#troubleshooting}

### Pod Not Starting

```bash
# Check pod status
kubectl get pods -n django-auth-app

# Describe pod for details
kubectl describe pod <pod-name> -n django-auth-app

# Check logs
kubectl logs <pod-name> -n django-auth-app

# Common issues:
# - Image pull errors → Check image name/tag
# - CrashLoopBackOff → Check logs for errors
# - Pending → Check resource limits or node capacity
```

### Database Connection Issues

```bash
# Verify database is running
kubectl get pods -l app=postgres -n django-auth-app

# Check database logs
kubectl logs -l app=postgres -n django-auth-app

# Test connection from backend pod
kubectl exec -it deployment/backend-deployment -n django-auth-app -- sh
# Inside pod:
# nc -zv postgres-svc 5432
# psql -h postgres-svc -U django_user -d django_auth_db
```

### Service Not Accessible

```bash
# Check service endpoints
kubectl get endpoints -n django-auth-app

# Verify service selector matches pod labels
kubectl get pods --show-labels -n django-auth-app
kubectl describe service backend-svc -n django-auth-app

# Test service from within cluster
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- sh
# Inside debug pod:
# curl http://backend-svc.django-auth-app.svc.cluster.local:8000/api/auth/user/
```

### Image Pull Errors

```bash
# Verify image exists in Minikube
minikube ssh
docker images | grep backend

# Load image into Minikube
minikube image load backend:latest

# Or use Minikube's Docker daemon
eval $(minikube docker-env)
docker images
```

### PersistentVolume Issues

```bash
# Check PVC status
kubectl get pvc -n django-auth-app

# Check PV status
kubectl get pv

# Describe PVC for details
kubectl describe pvc postgres-pvc -n django-auth-app
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ImagePullBackOff` | Image not found | Build and load image into Minikube |
| `CrashLoopBackOff` | Container crashing | Check logs: `kubectl logs <pod>` |
| `Pending` | No resources available | Check: `kubectl describe pod <pod>` |
| `ErrImagePull` | Wrong image name | Verify image name in deployment |
| `CreateContainerConfigError` | Missing ConfigMap/Secret | Check: `kubectl get configmap,secret` |

---

## 📊 Quick Reference Commands

```bash
# Cluster info
minikube status
kubectl cluster-info
kubectl get nodes

# Namespace operations
kubectl get namespaces
kubectl create namespace django-auth-app
kubectl config set-context --current --namespace=django-auth-app

# Resource operations
kubectl get all -n django-auth-app
kubectl get pods,svc,deployments -n django-auth-app
kubectl describe <resource-type> <resource-name> -n django-auth-app

# Logs
kubectl logs -f deployment/<deployment-name> -n django-auth-app
kubectl logs -f -l app=backend -n django-auth-app

# Scaling
kubectl scale deployment/<name> --replicas=3 -n django-auth-app

# Port forwarding
kubectl port-forward service/<service-name> <local-port>:<service-port> -n django-auth-app

# Exec into pod
kubectl exec -it <pod-name> -n django-auth-app -- /bin/sh

# Delete everything
kubectl delete namespace django-auth-app
```

---

## 🎓 Learning Path

1. **Start Simple**: Deploy one component at a time (DB → Backend → Frontend)
2. **Understand Each Resource**: Read the explanation for each manifest
3. **Experiment**: Try scaling, updating, and rolling back
4. **Monitor**: Watch logs and events to understand what's happening
5. **Practice**: Delete and recreate resources to build confidence

---

## 📝 Next Steps

1. ✅ Create the `k8s/` directory structure
2. ✅ Copy all manifest files
3. ✅ Build Docker images
4. ✅ Deploy to Minikube
5. ✅ Test the application
6. ✅ Experiment with scaling and updates

---

## 🎉 Congratulations!

You've successfully converted your Docker Compose application to Kubernetes! You now have:

- ✅ A scalable, production-ready architecture
- ✅ Health checks and auto-restart
- ✅ Persistent storage for database
- ✅ Load balancing across multiple pods
- ✅ Configuration management with ConfigMaps and Secrets
- ✅ Zero-downtime rolling updates

Happy learning! 🚀

