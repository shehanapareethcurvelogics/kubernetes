# Kubernetes Installation Guide - Complete Guide Using winget

## 🎯 What We're Installing

1. **kubectl** - Kubernetes command-line tool
2. **Minikube** - Local Kubernetes cluster

**Method:** Using winget (Windows Package Manager - built into Windows 10/11)

---

## ⚡ Quick Installation (Copy-Paste)

**For those who want to get started fast:**

```powershell
# 1. Install kubectl
winget install Kubernetes.kubectl

# 2. Close and reopen PowerShell, then verify:
kubectl version --client

# 3. Install Minikube
winget install Kubernetes.minikube

# 4. Close and reopen PowerShell, then verify:
minikube version

# 5. Set up virtualization (choose ONE):
# Option A: If Docker Desktop is running:
minikube start --driver=docker

# Option B: Install VirtualBox first, then:
minikube start --driver=virtualbox

# Option C: Enable Hyper-V (Windows Pro), then:
minikube start --driver=hyperv

# 6. Verify everything works:
minikube status
kubectl get nodes
```

**That's it!** If everything works, skip to "After Installation" section below.

---

## 📚 Detailed Step-by-Step Installation

### ✅ Pre-Installation Check

Check if tools are already installed:

```powershell
# Check kubectl
kubectl version --client

# Check Minikube
minikube version
```

**If you see version numbers:** Already installed! ✅  
**If you see errors:** Need to install! ⬇️

---

## 📦 Step 1: Install kubectl

### Check if winget is Available

```powershell
winget --version
```

**Expected output:** `v1.12.350` (or similar version)

**If you see an error:** winget may not be available. Update Windows or install from Microsoft Store: https://aka.ms/getwinget

### Search for kubectl

```powershell
winget search kubectl
```

**Expected output:**
```
Name              Id                    Version
-----------------------------------------------
kubectl           Kubernetes.kubectl    1.34.1
```

### Install kubectl

```powershell
winget install Kubernetes.kubectl
```

**What happens:**
- Downloads kubectl
- Installs automatically
- Adds to PATH automatically

**Time:** 1-2 minutes

**Expected output:**
```
Found kubectl [Kubernetes.kubectl] Version 1.34.1
This application is licensed to you by its owner.
...
Successfully installed!
```

### Verify Installation

**⚠️ Important:** Close and reopen PowerShell to refresh PATH!

```powershell
kubectl version --client
```

**Expected output:**
```
Client Version: version.Info{
    Major:"1",
    Minor:"34",
    GitVersion:"v1.34.1",
    ...
}
```

**If you see version info:** ✅ kubectl installed successfully!

---

## 📦 Step 2: Install Minikube

### Search for Minikube

```powershell
winget search minikube
```

**Expected output:**
```
Name                   Id                  Version
-----------------------------------------------
Kubernetes - Minikube  Kubernetes.minikube 1.37.0
```

### Install Minikube

```powershell
winget install Kubernetes.minikube
```

**What happens:**
- Downloads Minikube installer
- Installs automatically
- Adds to PATH automatically

**Time:** 2-3 minutes

**Expected output:**
```
Found Minikube [Kubernetes.minikube] Version 1.37.0
...
Successfully installed!
```

### Verify Installation

**⚠️ Important:** Close and reopen PowerShell to refresh PATH!

```powershell
minikube version
```

**Expected output:**
```
minikube version: v1.37.0
commit: abc123def456...
```

**If you see version info:** ✅ Minikube installed successfully!

---

## 🔧 Step 3: Set Up Virtualization

Minikube needs a virtualization tool to run. **Choose ONE option:**

### Option A: Docker Desktop (Easiest if Already Installed)

**Check if Docker Desktop is installed:**
```powershell
docker --version
docker ps
```

**If Docker is running:**
```powershell
minikube start --driver=docker
```

**Advantages:**
- ✅ No extra installation if Docker is already installed
- ✅ Easy to use
- ✅ Works well with existing Docker setup

### Option B: VirtualBox (Recommended - Works for Everyone)

**Step 1:** Download VirtualBox
- Go to: https://www.virtualbox.org/wiki/Downloads
- Download: "Windows hosts" installer
- Run installer and follow setup wizard

**Step 2:** Restart your computer (important!)

**Step 3:** Start Minikube
```powershell
minikube start --driver=virtualbox
```

**Advantages:**
- ✅ Works on all Windows versions
- ✅ Free and open source
- ✅ Reliable

### Option C: Hyper-V (Windows Pro/Enterprise Only)

**Step 1:** Check if you have Windows Pro/Enterprise
```powershell
systeminfo | findstr /C:"OS Name"
```

**Step 2:** Enable Hyper-V
```powershell
# Run PowerShell as Administrator (Right-click → Run as Administrator)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

**Step 3:** Restart your computer

**Step 4:** Start Minikube
```powershell
minikube start --driver=hyperv
```

**Advantages:**
- ✅ Built into Windows Pro
- ✅ No extra software needed
- ✅ Good performance

---

## 🚀 Step 4: Start Minikube Cluster

### Start Minikube

Choose the command based on your virtualization tool:

```powershell
# If using Docker Desktop
minikube start --driver=docker

# If using VirtualBox
minikube start --driver=virtualbox

# If using Hyper-V
minikube start --driver=hyperv
```

**First start takes 5-10 minutes** (downloads VM image - ~500MB)

**Expected output:**
```
😄  minikube v1.37.0 on Microsoft Windows 10
✨  Using the docker driver based on existing profile
📦  Downloading driver docker-machine-driver-docker...
...
✅  minikube is ready!
```

**What happens:**
- Downloads Kubernetes VM image
- Creates virtual machine
- Starts Kubernetes cluster
- Configures kubectl to use cluster

---

## ✅ Step 5: Verify Everything Works

### Check Cluster Status

```powershell
minikube status
```

**Expected output:**
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### Check Nodes

```powershell
kubectl get nodes
```

**Expected output:**
```
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.28.0
```

### Check Cluster Info

```powershell
kubectl cluster-info
```

**Expected output:**
```
Kubernetes control plane is running at https://127.0.0.1:xxxxx
CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
```

**If all commands work:** ✅ Everything is set up correctly!

---

## 🎓 Understanding What You Installed

### kubectl (Kubernetes Control)

**What it is:**
- Command-line tool to interact with Kubernetes
- Like `docker` command, but for Kubernetes

**What it does:**
- Sends commands to Kubernetes cluster
- Manages resources (pods, services, deployments)
- Views logs, status, etc.

**Example commands:**
```powershell
kubectl get pods              # List all pods
kubectl get services          # List all services
kubectl apply -f file.yaml   # Deploy something
kubectl logs pod-name        # View logs
```

### Minikube (Mini Kubernetes)

**What it is:**
- Local Kubernetes cluster
- Runs in a virtual machine
- Perfect for learning and testing

**What it does:**
- Creates a Kubernetes cluster on your computer
- Runs Kubernetes components (API server, etcd, etc.)
- Gives you a real cluster to practice with

**Why use it:**
- ✅ Learn Kubernetes locally
- ✅ No cloud costs
- ✅ Same as production concepts
- ✅ Fast iteration

---

## 📝 Common Commands Reference

### Minikube Commands

```powershell
minikube start              # Start cluster
minikube stop               # Stop cluster
minikube status             # Check status
minikube dashboard         # Open web UI (opens browser)
minikube delete             # Delete cluster
minikube logs               # View logs
minikube ip                 # Get cluster IP
minikube service <name>     # Access service
```

### kubectl Commands

```powershell
# View resources
kubectl get nodes           # List nodes
kubectl get pods            # List pods
kubectl get services        # List services
kubectl get deployments    # List deployments
kubectl get all             # List all resources

# Describe resources
kubectl describe pod <name>        # Pod details
kubectl describe service <name>    # Service details

# View logs
kubectl logs <pod-name>            # Pod logs
kubectl logs -f <pod-name>         # Follow logs

# Execute commands
kubectl exec -it <pod-name> -- /bin/bash  # Shell into pod

# Apply configurations
kubectl apply -f file.yaml         # Deploy from file
kubectl delete -f file.yaml        # Delete from file

# Cluster info
kubectl cluster-info               # Cluster information
kubectl version                    # Version info
```

---

## 🐛 Troubleshooting

### Problem: "winget: command not found"

**Solution:**
- Update Windows (winget comes with Windows 10 1809+ and Windows 11)
- Or install from Microsoft Store: https://aka.ms/getwinget
- Or use Direct Download method (see alternative below)

### Problem: "kubectl: command not found" after installation

**Solution:**
1. Close and reopen PowerShell (PATH needs refresh)
2. Or restart computer
3. Check PATH: `$env:Path -split ';' | Select-String kubectl`

### Problem: "minikube: command not found" after installation

**Solution:**
1. **Close and reopen PowerShell** (PATH needs refresh)
2. **If still not found, add to PATH manually:**
   
   **⚠️ IMPORTANT: Add the DIRECTORY path, NOT the executable path!**
   
   **❌ WRONG (Don't add this):**
   ```
   C:\Program Files\Kubernetes\Minikube\minikube.exe
   ```
   
   **✅ CORRECT (Add this directory):**
   ```
   C:\Program Files\Kubernetes\Minikube
   ```
   
   **How to fix manually:**
   1. Press `Win + R`, type `sysdm.cpl`, press Enter
   2. Click "Environment Variables"
   3. Under "System variables" (or "User variables"), find "Path"
   4. Click "Edit"
   5. **Remove** any entry with `minikube.exe` (if exists)
   6. **Add NEW** entry: `C:\Program Files\Kubernetes\Minikube`
   7. Click OK on all windows
   8. **Close ALL PowerShell windows**
   9. **Open NEW PowerShell window**
   10. Test: `minikube version`
   
   See `ADD_MINIKUBE_TO_PATH.md` for detailed step-by-step instructions
3. **Or restart computer** (sometimes needed)
4. Check if installed: `winget list | Select-String minikube`

### Problem: "minikube start" fails - "driver not found"

**Solution:**
1. **Install a virtualization tool:**
   - VirtualBox: https://www.virtualbox.org/
   - Or use Docker Desktop
   - Or enable Hyper-V (Windows Pro only)

2. **Specify driver explicitly:**
   ```powershell
   minikube start --driver=virtualbox
   ```

### Problem: "minikube start" fails - virtualization error

**Solution:**
1. **Enable virtualization in BIOS:**
   - Restart computer
   - Enter BIOS/UEFI settings (usually F2, F10, or Del)
   - Enable "Virtualization Technology" or "VT-x"
   - Save and restart

2. **Check if virtualization is enabled:**
   ```powershell
   systeminfo | findstr /C:"Hyper-V"
   ```

### Problem: "minikube start" downloads forever

**Solution:**
- First start downloads VM image (~500MB)
- This is normal and takes 5-10 minutes
- Be patient, check internet connection
- You can see progress in the output

### Problem: Port conflicts

**Solution:**
```powershell
# Check what's using the port
netstat -ano | findstr :8443

# Or use different ports
minikube start --apiserver-port=8444 --driver=docker
```

### Problem: Insufficient memory

**Solution:**
```powershell
# Start with less memory
minikube start --memory=2048 --driver=docker

# Or increase Docker Desktop memory
# Docker Desktop → Settings → Resources → Memory → Increase to 4GB+
```

### Problem: "winget install" fails with permission error

**Solution:**
- Run PowerShell as Administrator
- Right-click PowerShell → Run as Administrator
- Then run: `winget install Kubernetes.minikube`

---

## 📋 Installation Checklist

Use this to track your progress:

- [ ] **kubectl installed**
  - [ ] Ran `winget install Kubernetes.kubectl`
  - [ ] Closed and reopened PowerShell
  - [ ] Verified: `kubectl version --client` works

- [ ] **Minikube installed**
  - [ ] Ran `winget install Kubernetes.minikube`
  - [ ] Closed and reopened PowerShell
  - [ ] Verified: `minikube version` works

- [ ] **Virtualization ready**
  - [ ] Installed Docker Desktop OR VirtualBox OR Enabled Hyper-V
  - [ ] Verified virtualization works

- [ ] **Minikube started**
  - [ ] Ran `minikube start --driver=<your-driver>`
  - [ ] Cluster is running: `minikube status`
  - [ ] Can see nodes: `kubectl get nodes`

- [ ] **Ready to proceed**
  - [ ] All commands work
  - [ ] No errors
  - [ ] Ready to create Kubernetes manifests!

---

## 🎯 After Installation - What's Next?

Once everything is installed and running:

### 1. Explore Kubernetes Dashboard

```powershell
minikube dashboard
```

Opens web UI in browser - see your cluster visually!

### 2. Test Basic Commands

```powershell
# See what's running
kubectl get all

# Check cluster info
kubectl cluster-info

# View nodes
kubectl get nodes -o wide
```

### 3. Ready for Next Steps

Now you're ready to:
- ✅ Create Kubernetes manifests
- ✅ Deploy your Django + React app
- ✅ Learn Kubernetes concepts
- ✅ Practice with real cluster

---

## 🎓 Learning Resources

- **Kubernetes Docs:** https://kubernetes.io/docs/
- **Minikube Docs:** https://minikube.sigs.k8s.io/docs/
- **kubectl Cheat Sheet:** https://kubernetes.io/docs/reference/kubectl/cheatsheet/

---

## ✅ Success Indicators

You'll know everything is working when:

```powershell
# This works:
kubectl version --client
# Output: Client Version: v1.34.x

# This works:
minikube version
# Output: minikube version: v1.37.x

# This works:
minikube status
# Output: host: Running, kubelet: Running, apiserver: Running

# This works:
kubectl get nodes
# Output: NAME       STATUS   ROLES
#         minikube   Ready    control-plane
```

---

## 🆘 Getting Help

If you encounter problems:

1. **Check error message** - Read it carefully
2. **Check prerequisites** - Virtualization enabled?
3. **Try different driver** - Switch between Docker/VirtualBox/Hyper-V
4. **Check logs:**
   ```powershell
   minikube logs
   ```
5. **Restart Minikube:**
   ```powershell
   minikube stop
   minikube start --driver=<your-driver>
   ```

---

## 📝 Quick Reference Card

### Installation Commands
```powershell
winget install Kubernetes.kubectl
winget install Kubernetes.minikube
```

### Start/Stop Commands
```powershell
minikube start --driver=docker
minikube stop
minikube delete
```

### Verification Commands
```powershell
kubectl version --client
minikube version
minikube status
kubectl get nodes
```

---

**That's everything you need! One document, winget only, simple and clear!** 🚀

