# Minikube + Docker + WSL2 + Jenkins Setup (Beginner Guide)

This document explains **exactly what worked** on Windows 11 using **WSL2 (Ubuntu)**, **Docker Desktop**, **Minikube**, and **Jenkins**.

It is written for **beginners** and meant for **future reference**, so steps are explicit and repetitive on purpose.

---

## 🧠 Architecture (Important to Understand)

* **Windows 11** → runs Docker Desktop
* **Docker Desktop** → provides Docker Engine
* **WSL2 (Ubuntu)** → where we run Minikube + kubectl + Jenkins
* **Minikube** → creates a local Kubernetes cluster using Docker
* **Jenkins** → CI/CD tool running inside Kubernetes

👉 Minikube runs **inside Ubuntu**, but uses **Docker from Docker Desktop**

---

## ✅ Prerequisites (One-time)

### 1️⃣ Enable WSL2 on Windows

Run in **PowerShell (Admin)**:

```powershell
wsl --install
```

Reboot if asked.

---

### 2️⃣ Install Docker Desktop (Windows)

* Download Docker Desktop for Windows
* During installation:
  * ✅ Enable **WSL2 backend**
* After install:
  * Open Docker Desktop
  * Go to **Settings → Resources → WSL Integration**
  * ✅ Enable integration for **Ubuntu**
  * Apply & Restart Docker

---

## 🐧 Ubuntu (WSL) Setup

Open Ubuntu:

```powershell
wsl -d Ubuntu
```

Update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 🐳 Verify Docker in Ubuntu

Run:

```bash
docker version
```

### ❌ If you see:

```
permission denied while trying to connect to the docker API
```

That means your user is **not allowed to use Docker** yet.

---

## 🔐 FIX: Docker Permission Issue (CRITICAL STEP)

Run:

```bash
sudo usermod -aG docker $USER
```

Apply group change (choose ONE):

### Option A (recommended):

```bash
newgrp docker
```

### Option B:

Close Ubuntu and reopen it.

---

### ✅ Verify Docker Again

```bash
docker version
```

You must see **Client + Server** with **no permission errors**.

---

## 📦 Install Minikube (Linux binary inside Ubuntu)

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Verify:

```bash
minikube version
```

---

## 🧰 Install kubectl

```bash
sudo apt install -y kubectl
```

Verify:

```bash
kubectl version --client
```

---

## 🚀 Start Minikube (WORKING COMMAND)

```bash
minikube start --driver=docker --memory=2048 --cpus=2
```

Why this works:

* Uses Docker (already running via Docker Desktop)
* Avoids Windows driver issues

---

## ✅ Verify Cluster

```bash
minikube status
kubectl get nodes
```

Expected output:

* Minikube: **Running**
* Node: **Ready**

---

## 🔧 Install Jenkins using Helm

### Step 1: Install Helm

Helm is a package manager for Kubernetes (like apt for Ubuntu, but for Kubernetes apps):

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

You'll be asked for your password (sudo password).

Verify installation:

```bash
helm version
```

---

### Step 2: Add Jenkins Helm Repository

```bash
helm repo add jenkins https://charts.jenkins.io
```

Update the repository:

```bash
helm repo update
```

---

### Step 3: Create Jenkins Namespace

```bash
kubectl create namespace jenkins
```

---

### Step 4: Install Jenkins

```bash
helm install jenkins jenkins/jenkins \
  --namespace jenkins \
  --create-namespace \
  --set controller.serviceType=NodePort \
  --set controller.nodePort=30090 \
  --set controller.admin.username=admin \
  --set controller.admin.password=admin
```

**What this does:**
* Installs Jenkins in the `jenkins` namespace
* Creates the namespace if it doesn't exist
* Sets service type to NodePort (makes it accessible from outside)
* Sets port to 30090
* Sets admin username to `admin`
* Sets admin password to `admin`

Wait for Jenkins to start (this takes 1-2 minutes):

```bash
kubectl get pods -n jenkins
```

Wait until you see `READY 2/2` and `STATUS Running`:

```
NAME        READY   STATUS    RESTARTS   AGE
jenkins-0   2/2     Running   0          2m23s
```

---

### Step 5: Get Jenkins Admin Password

```bash
kubectl exec --namespace jenkins -it jenkins-0 -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo
```

**Note:** The password is `admin` (as we set it in Step 4), but this command confirms it.

---

### Step 6: Get Jenkins URL

```bash
export NODE_PORT=$(kubectl get --namespace jenkins -o jsonpath="{.spec.ports[0].nodePort}" services jenkins)
export NODE_IP=$(minikube ip)
echo http://$NODE_IP:$NODE_PORT
```

You should see something like: `http://192.168.49.2:30090`

---

### Step 7: Access Jenkins UI

**Option A: Using minikube service (Recommended)**

```bash
minikube service jenkins -n jenkins
```

This will open Jenkins in your browser automatically.

**Option B: Manual Access**

Open your browser and go to: `http://192.168.49.2:30090`

**Login:**
* Username: `admin`
* Password: `admin` (or the password from Step 5)

---

## 🛑 Common Mistakes & Fixes

### ❌ `kubectl: command not found`

```bash
sudo apt install kubectl
```

---

### ❌ `Profile \"minikube\" not found`

You have not started the cluster yet.

```bash
minikube start --driver=docker
```

---

### ❌ Docker works on Windows but not in Ubuntu

Fix:

* Docker Desktop → Settings → WSL Integration → Enable Ubuntu

---

### ❌ `wsl --shutdown` not found

That command must be run in **Windows PowerShell**, NOT Ubuntu.

---

### ❌ Jenkins pod not starting

Check the pod status:

```bash
kubectl get pods -n jenkins
kubectl describe pod jenkins-0 -n jenkins
```

Check logs:

```bash
kubectl logs jenkins-0 -n jenkins -c jenkins
```

---

### ❌ Cannot access Jenkins URL

Make sure Minikube is running:

```bash
minikube status
```

If not running, start it:

```bash
minikube start
```

---

## 🧪 Useful Commands (Daily Use)

### Minikube Commands

```bash
minikube status          # Check if Minikube is running
minikube stop            # Stop Minikube
minikube start           # Start Minikube
minikube delete          # Delete Minikube cluster
minikube ip              # Get Minikube IP address
```

### Kubernetes Commands

```bash
kubectl get pods                    # List all pods
kubectl get pods -n jenkins         # List pods in jenkins namespace
kubectl get svc                     # List all services
kubectl get svc -n jenkins         # List services in jenkins namespace
kubectl get namespaces              # List all namespaces
```

### Jenkins Commands

```bash
kubectl get pods -n jenkins                    # Check Jenkins pod status
kubectl logs jenkins-0 -n jenkins -c jenkins   # View Jenkins logs
minikube service jenkins -n jenkins             # Open Jenkins in browser
```

---

## 🎯 Next Steps (After This Doc)

Now you can:

1. **Access Jenkins UI** at `http://192.168.49.2:30090` (or use `minikube service jenkins -n jenkins`)
2. **Create Jenkins Pipeline** jobs
3. **Deploy applications** using Jenkins CI/CD
4. **Deploy your apps** (React frontend, Django backend, PostgreSQL)

---

## 🧠 Final Tip

If something breaks:

1. Check Docker first: `docker version`
2. Check Minikube status: `minikube status`
3. Check Jenkins pod: `kubectl get pods -n jenkins`
4. Check permissions

90% of issues are **Docker not accessible from WSL**.

---

✅ **This setup is CONFIRMED WORKING**
