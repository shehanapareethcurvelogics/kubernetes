# Minikube Commands Guide - Complete Beginner Tutorial

## 🎯 What is Minikube?

**Minikube** is a tool that runs a **single-node Kubernetes cluster** on your local computer. Think of it as:
- A mini version of Kubernetes
- Perfect for learning and testing
- Runs in a virtual machine or container
- Same commands as production Kubernetes

**Why use it?**
- ✅ Learn Kubernetes without cloud costs
- ✅ Test applications locally
- ✅ Practice before deploying to production
- ✅ Fast development cycle

---

## 📚 Basic Concepts You Need to Know

### Cluster
A **cluster** is a group of machines (nodes) running Kubernetes. Minikube creates a **single-node cluster** (one machine).

### Node
A **node** is a machine (physical or virtual) that runs your applications. Minikube creates one node called `minikube`.

### Driver
A **driver** is the virtualization technology Minikube uses to run the cluster:
- `docker` - Uses Docker Desktop
- `virtualbox` - Uses VirtualBox
- `hyperv` - Uses Hyper-V (Windows Pro)

### Profile
A **profile** is a named Minikube cluster. You can have multiple clusters with different names. Default profile is `minikube`.

---

## 🚀 Getting Started - Essential Commands

### 1. Start Minikube Cluster

**Command:**
```powershell
minikube start
```

**What it does:**
- Creates a virtual machine/container
- Installs Kubernetes inside it
- Starts all Kubernetes components
- Configures kubectl to use this cluster

**First time:** Takes 5-10 minutes (downloads ~500MB VM image)  
**Subsequent starts:** Takes 1-2 minutes

**With specific driver:**
```powershell
# Use Docker
minikube start --driver=docker

# Use VirtualBox
minikube start --driver=virtualbox

# Use Hyper-V
minikube start --driver=hyperv
```

**Example output:**
```
😄  minikube v1.37.0 on Microsoft Windows 10
✨  Using the docker driver based on existing profile
📦  Downloading driver docker-machine-driver-docker...
🔥  Creating docker container (CPUs=2, Memory=4000MB) ...
🐳  Preparing Kubernetes v1.28.0 on Docker 24.0.7 ...
    ▪ Generating certificates and keys ...
    ▪ Booting control plane ...
    ▪ Configuring RBAC rules ...
✅  minikube is ready!
```

**Common options:**
```powershell
# Start with specific memory
minikube start --memory=4096

# Start with specific CPUs
minikube start --cpus=4

# Start with specific Kubernetes version
minikube start --kubernetes-version=v1.28.0
```

---

### 2. Check Cluster Status

**Command:**
```powershell
minikube status
```

**What it does:**
- Shows if cluster is running
- Displays status of components
- Shows node information

**Example output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

**What each status means:**
- `host: Running` - Virtual machine/container is running
- `kubelet: Running` - Kubernetes agent is running
- `apiserver: Running` - Kubernetes API server is running
- `kubeconfig: Configured` - kubectl is configured to use this cluster

---

### 3. Stop Minikube Cluster

**Command:**
```powershell
minikube stop
```

**What it does:**
- Stops the cluster (but keeps it)
- Saves current state
- Can be restarted later with `minikube start`

**Use when:**
- You want to free up resources
- You're done working for now
- You want to pause without losing setup

**Example output:**
```
✋  Stopping node "minikube"  ...
🛑  1 node stopped.
```

---

### 4. Delete Minikube Cluster

**Command:**
```powershell
minikube delete
```

**What it does:**
- Completely removes the cluster
- Deletes all data and configurations
- Cannot be undone!

**Use when:**
- You want a fresh start
- Something is broken and you want to reset
- You're done with Minikube

**Example output:**
```
🔥  Deleting "minikube" in docker ...
💀  Removed all traces of the "minikube" cluster.
```

**⚠️ Warning:** This deletes everything! Use `minikube stop` if you want to keep your cluster.

---

### 5. Get Cluster IP Address

**Command:**
```powershell
minikube ip
```

**What it does:**
- Shows the IP address of the Minikube cluster
- Useful for accessing services

**Example output:**
```
192.168.49.2
```

**Use cases:**
- Accessing services from outside the cluster
- Configuring applications
- Debugging network issues

---

### 6. View Cluster Information

**Command:**
```powershell
minikube version
```

**What it does:**
- Shows Minikube version
- Shows commit hash

**Example output:**
```
minikube version: v1.37.0
commit: 65318f4cfff9c12cc87ec9eb8f4cdd57b25047f3
```

---

## 🔍 Inspection Commands

### View Cluster Logs

**Command:**
```powershell
minikube logs
```

**What it does:**
- Shows logs from all Kubernetes components
- Useful for debugging issues

**View specific component logs:**
```powershell
# View all logs
minikube logs

# View only API server logs
minikube logs --component=apiserver

# View only kubelet logs
minikube logs --component=kubelet

# Follow logs (like tail -f)
minikube logs --follow
```

---

### View Service URLs

**Command:**
```powershell
minikube service list
```

**What it does:**
- Lists all services running in the cluster
- Shows URLs to access them

**Example output:**
```
|-------------|----------------------|-----------------------------|
|  NAMESPACE  |        NAME         |            URL              |
|-------------|----------------------|-----------------------------|
| default     | kubernetes          | No node port                |
| default     | my-app-service      | http://192.168.49.2:30000  |
|-------------|----------------------|-----------------------------|
```

---

### Open Service in Browser

**Command:**
```powershell
minikube service <service-name>
```

**What it does:**
- Opens the service URL in your default browser
- Automatically forwards the port

**Example:**
```powershell
minikube service my-app-service
```

**Opens:** `http://192.168.49.2:30000` in your browser

---

### Open Kubernetes Dashboard

**Command:**
```powershell
minikube dashboard
```

**What it does:**
- Opens Kubernetes web UI (dashboard)
- Shows all resources visually
- Great for learning and monitoring

**What you'll see:**
- Pods, Services, Deployments
- Resource usage
- Logs and events
- Cluster overview

**To stop dashboard:** Press `Ctrl+C` in the terminal

---

## ⚙️ Configuration Commands

### View Current Configuration

**Command:**
```powershell
minikube config view
```

**What it does:**
- Shows all Minikube configuration settings
- Displays driver, memory, CPUs, etc.

**Example output:**
```
- driver: docker
- memory: 4000
- cpus: 2
- disk-size: 20000mb
```

---

### Set Configuration

**Command:**
```powershell
minikube config set <key> <value>
```

**What it does:**
- Changes Minikube configuration
- Takes effect on next `minikube start`

**Common settings:**
```powershell
# Set memory (in MB)
minikube config set memory 4096

# Set CPUs
minikube config set cpus 4

# Set disk size
minikube config set disk-size 20g

# Set driver
minikube config set driver docker
```

**⚠️ Note:** Changes take effect after `minikube delete` and `minikube start`

---

### Unset Configuration

**Command:**
```powershell
minikube config unset <key>
```

**What it does:**
- Removes a configuration setting
- Resets to default value

**Example:**
```powershell
minikube config unset memory
```

---

## 🔧 Advanced Commands

### SSH into Minikube Node

**Command:**
```powershell
minikube ssh
```

**What it does:**
- Opens a shell inside the Minikube node
- Lets you inspect the system directly

**Use cases:**
- Debugging issues
- Checking system resources
- Inspecting files

**To exit:** Type `exit`

**Example:**
```powershell
PS> minikube ssh
docker@minikube:~$ ls
docker@minikube:~$ exit
```

---

### Execute Command in Minikube Node

**Command:**
```powershell
minikube ssh -- <command>
```

**What it does:**
- Runs a command inside the node without opening shell
- Useful for quick checks

**Examples:**
```powershell
# Check disk usage
minikube ssh -- df -h

# Check memory
minikube ssh -- free -h

# List processes
minikube ssh -- ps aux
```

---

### Mount Host Directory

**Command:**
```powershell
minikube mount <host-path>:<vm-path>
```

**What it does:**
- Mounts a directory from your computer into Minikube
- Useful for development (live code changes)

**Example:**
```powershell
# Mount current directory to /app in Minikube
minikube mount D:\kubernetes:/app
```

**Use case:** When developing, you can edit files on your computer and they're available in Minikube.

---

### Add Addons

**Command:**
```powershell
minikube addons enable <addon-name>
```

**What it does:**
- Enables optional Kubernetes features
- Adds extra functionality

**Common addons:**
```powershell
# Enable metrics server (for resource monitoring)
minikube addons enable metrics-server

# Enable dashboard (web UI)
minikube addons enable dashboard

# Enable ingress (for routing)
minikube addons enable ingress

# Enable storage provisioner
minikube addons enable storage-provisioner
```

**List available addons:**
```powershell
minikube addons list
```

**Disable addon:**
```powershell
minikube addons disable <addon-name>
```

---

### View Addon Status

**Command:**
```powershell
minikube addons list
```

**What it does:**
- Shows all available addons
- Indicates which are enabled/disabled

**Example output:**
```
|-----------------------------|----------|--------------|
|         ADDON NAME          | PROFILE  |    STATUS    |
|-----------------------------|----------|--------------|
| dashboard                   | minikube | enabled ✅   |
| default-storageclass        | minikube | enabled ✅   |
| ingress                     | minikube | disabled     |
| metrics-server              | minikube | disabled     |
|-----------------------------|----------|--------------|
```

---

## 🎯 Working with Multiple Profiles

### Create Multiple Clusters

**Command:**
```powershell
minikube start -p <profile-name>
```

**What it does:**
- Creates a cluster with a custom name
- Allows multiple clusters simultaneously

**Example:**
```powershell
# Create cluster named "dev"
minikube start -p dev --driver=docker

# Create cluster named "prod"
minikube start -p prod --driver=docker
```

**Benefits:**
- Test different Kubernetes versions
- Separate development and testing
- Compare configurations

---

### Switch Between Profiles

**Command:**
```powershell
minikube profile <profile-name>
```

**What it does:**
- Switches kubectl to use a different cluster
- Changes active context

**Example:**
```powershell
# Switch to "dev" cluster
minikube profile dev

# Switch to "prod" cluster
minikube profile prod

# Switch back to default
minikube profile minikube
```

---

### List All Profiles

**Command:**
```powershell
minikube profile list
```

**What it does:**
- Shows all created profiles
- Indicates which is active

**Example output:**
```
|----------|-----------|----------------------|------|---------|---------|
| Profile  | VM Driver |      Docker          | Status| Nodes   | Active  |
|----------|-----------|----------------------|------|---------|---------|
| dev      | docker    | Running              |      | 1       |         |
| minikube | docker    | Stopped              |      | 1       | *       |
|----------|-----------|----------------------|------|---------|---------|
```

---

## 🔄 Integration with kubectl

Minikube automatically configures `kubectl` to use the cluster. After `minikube start`, you can use all `kubectl` commands!

### Verify kubectl is Configured

**Command:**
```powershell
kubectl get nodes
```

**What it does:**
- Lists all nodes in the cluster
- Confirms kubectl is working

**Example output:**
```
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   5m    v1.28.0
```

---

### Get Cluster Info

**Command:**
```powershell
kubectl cluster-info
```

**What it does:**
- Shows cluster endpoints
- Displays API server URL

**Example output:**
```
Kubernetes control plane is running at https://127.0.0.1:xxxxx
CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

---

## 📋 Common Workflows

### Workflow 1: Daily Development

```powershell
# 1. Start cluster
minikube start

# 2. Check status
minikube status

# 3. Deploy your app (using kubectl)
kubectl apply -f app.yaml

# 4. Check your app
kubectl get pods

# 5. Access your app
minikube service my-app

# 6. When done, stop cluster
minikube stop
```

---

### Workflow 2: Fresh Start

```powershell
# 1. Delete old cluster
minikube delete

# 2. Start fresh cluster
minikube start --driver=docker

# 3. Enable addons you need
minikube addons enable dashboard
minikube addons enable ingress

# 4. Verify everything works
minikube status
kubectl get nodes
```

---

### Workflow 3: Debugging

```powershell
# 1. Check cluster status
minikube status

# 2. View logs
minikube logs

# 3. SSH into node
minikube ssh

# 4. Check resources
minikube ssh -- df -h
minikube ssh -- free -h

# 5. Restart cluster if needed
minikube stop
minikube start
```

---

## 🐛 Troubleshooting Commands

### Restart Cluster

**Command:**
```powershell
minikube stop
minikube start
```

**Use when:**
- Something is not working
- Components are stuck
- Need a fresh start

---

### Reset Cluster

**Command:**
```powershell
minikube delete
minikube start
```

**Use when:**
- Cluster is completely broken
- Want to start from scratch
- Configuration changes didn't apply

---

### Check Driver Status

**Command:**
```powershell
minikube status
```

**If driver shows errors:**
```powershell
# Check Docker
docker ps

# Check VirtualBox
VBoxManage list vms

# Restart with different driver
minikube start --driver=docker
```

---

### View Detailed Logs

**Command:**
```powershell
minikube logs --file=minikube.log
```

**What it does:**
- Saves logs to a file
- Easier to analyze

---

## 📝 Quick Reference Card

### Essential Commands

```powershell
# Start cluster
minikube start

# Stop cluster
minikube stop

# Delete cluster
minikube delete

# Check status
minikube status

# Get IP
minikube ip

# Open dashboard
minikube dashboard

# View logs
minikube logs
```

### Configuration Commands

```powershell
# View config
minikube config view

# Set memory
minikube config set memory 4096

# Set CPUs
minikube config set cpus 4

# Set driver
minikube config set driver docker
```

### Addon Commands

```powershell
# List addons
minikube addons list

# Enable addon
minikube addons enable dashboard

# Disable addon
minikube addons disable dashboard
```

### Profile Commands

```powershell
# Create profile
minikube start -p <name>

# List profiles
minikube profile list

# Switch profile
minikube profile <name>
```

### Service Commands

```powershell
# List services
minikube service list

# Open service
minikube service <service-name>
```

---

## 🎓 Learning Path

### Step 1: Basic Operations (Day 1)
1. ✅ `minikube start`
2. ✅ `minikube status`
3. ✅ `minikube stop`
4. ✅ `minikube delete`

### Step 2: Inspection (Day 2)
1. ✅ `minikube logs`
2. ✅ `minikube dashboard`
3. ✅ `minikube service list`
4. ✅ `kubectl get nodes`

### Step 3: Configuration (Day 3)
1. ✅ `minikube config view`
2. ✅ `minikube config set`
3. ✅ `minikube addons enable`
4. ✅ `minikube ssh`

### Step 4: Advanced (Day 4+)
1. ✅ Multiple profiles
2. ✅ Mounting directories
3. ✅ Custom configurations
4. ✅ Integration with kubectl

---

## 💡 Pro Tips

1. **Always check status first:**
   ```powershell
   minikube status
   ```

2. **Use dashboard for visual learning:**
   ```powershell
   minikube dashboard
   ```

3. **Enable metrics-server for monitoring:**
   ```powershell
   minikube addons enable metrics-server
   ```

4. **Stop instead of delete when possible:**
   - `minikube stop` - Keeps your cluster
   - `minikube delete` - Removes everything

5. **Use profiles for different environments:**
   ```powershell
   minikube start -p dev
   minikube start -p prod
   ```

6. **Check logs when something breaks:**
   ```powershell
   minikube logs
   ```

---

## ✅ Practice Exercises

### Exercise 1: Basic Setup
1. Start Minikube cluster
2. Check its status
3. Get the cluster IP
4. View cluster information

### Exercise 2: Dashboard Exploration
1. Enable dashboard addon
2. Open dashboard
3. Explore pods, services, deployments
4. Close dashboard

### Exercise 3: Configuration
1. View current configuration
2. Set memory to 4096MB
3. Set CPUs to 2
4. Delete and restart to apply changes

### Exercise 4: Multiple Profiles
1. Create a "dev" profile
2. Create a "test" profile
3. Switch between them
4. List all profiles

---

## 🆘 Getting Help

### View Help for Any Command

```powershell
# General help
minikube --help

# Help for specific command
minikube start --help
minikube addons --help
```

### Common Issues

**Problem:** `minikube start` fails  
**Solution:** Check driver is available (`docker ps` or VirtualBox installed)

**Problem:** Cluster won't start  
**Solution:** `minikube delete` then `minikube start`

**Problem:** Can't access services  
**Solution:** Check `minikube service list` and use `minikube service <name>`

---

## 📚 Next Steps

After mastering Minikube commands:

1. **Learn kubectl commands** - Deploy and manage applications
2. **Create Kubernetes manifests** - YAML files for your apps
3. **Deploy your Django + React app** - Put it on Kubernetes
4. **Learn advanced concepts** - Services, Ingress, ConfigMaps, Secrets

---

**You're now ready to use Minikube! Start with `minikube start` and explore! 🚀**

