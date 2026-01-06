# Use Minikube on a Different Drive - Complete Guide

## 🎯 Problem
Your C: drive is full, but you have space on another drive (like D:, E:, etc.). Minikube stores its data in `C:\Users\<username>\.minikube` by default, which is causing disk space issues.

## ✅ Solution: Use Another Drive

You can configure Minikube to store all its data on a different drive using the `MINIKUBE_HOME` environment variable.

---

## 📋 Step-by-Step Instructions

### Step 1: Choose Your Drive

**Check available drives:**
```powershell
Get-PSDrive -PSProvider FileSystem
```

**Example output:**
```
Name           Used (GB)     Free (GB)     Provider      Root
----           ---------     ---------     --------      ----
C                 200.5         0.5        FileSystem    C:\
D                 50.2        149.8       FileSystem    D:\
E                 10.0        190.0       FileSystem    E:\
```

**Choose a drive with enough space** (at least 2-3 GB free recommended)

---

### Step 2: Delete Existing Minikube Cluster (If Any)

**First, clean up any existing cluster on C: drive:**

```powershell
# Delete existing cluster
minikube delete

# Or if that doesn't work, manually delete the folder
Remove-Item -Recurse -Force "$env:USERPROFILE\.minikube" -ErrorAction SilentlyContinue
```

---

### Step 3: Set MINIKUBE_HOME Environment Variable

**Option A: Set for Current PowerShell Session (Temporary)**

```powershell
# Replace D: with your chosen drive
$env:MINIKUBE_HOME = "D:\minikube"
```

**This only works for the current PowerShell window!**

---

**Option B: Set Permanently (Recommended)**

**Method 1: Using PowerShell (Run as Administrator)**

```powershell
# Replace D: with your chosen drive
[Environment]::SetEnvironmentVariable("MINIKUBE_HOME", "D:\minikube", "User")
```

**Method 2: Using GUI**

1. Press `Win + R`
2. Type: `sysdm.cpl`
3. Press Enter
4. Click **"Environment Variables"**
5. Under **"User variables"**, click **"New"**
6. Variable name: `MINIKUBE_HOME`
7. Variable value: `D:\minikube` (replace D: with your drive)
8. Click **"OK"** on all windows
9. **Close and reopen PowerShell**

---

### Step 4: Verify Environment Variable is Set

**Check if it's set:**
```powershell
# Check current session
$env:MINIKUBE_HOME

# Check permanent setting
[Environment]::GetEnvironmentVariable("MINIKUBE_HOME", "User")
```

**Expected output:**
```
D:\minikube
```

---

### Step 5: Start Minikube on New Drive

**Now start Minikube - it will use the new location:**

```powershell
# Start Minikube (it will create D:\minikube automatically)
minikube start --driver=docker --memory=2096 --cpus=2
```

**What happens:**
- Minikube creates `D:\minikube` folder automatically
- All data (images, configs, logs) stored on D: drive
- No more C: drive space issues!

---

### Step 6: Verify It's Using the New Location

**Check where Minikube is storing data:**
```powershell
# Check environment variable
$env:MINIKUBE_HOME

# Check if folder exists
Test-Path "D:\minikube"

# List contents
Get-ChildItem "D:\minikube"
```

**You should see:**
- `D:\minikube\cache\` - Downloaded images
- `D:\minikube\logs\` - Log files
- `D:\minikube\machines\` - VM/container configs
- `D:\minikube\profiles\` - Cluster profiles

---

## 🔄 Alternative Method: Use --base-dir Flag

**Instead of setting environment variable, you can use `--base-dir` flag:**

```powershell
# Delete old cluster first
minikube delete

# Start with custom base directory
minikube start --driver=docker --base-dir="D:\minikube" --memory=2096 --cpus=2
```

**Note:** You'll need to use `--base-dir` flag every time you run minikube commands, so the environment variable method is easier.

---

## 📝 Quick Reference

### Set MINIKUBE_HOME Permanently

```powershell
# PowerShell (as Administrator)
[Environment]::SetEnvironmentVariable("MINIKUBE_HOME", "D:\minikube", "User")
```

### Start Minikube

```powershell
minikube start --driver=docker --memory=2096 --cpus=2
```

### Verify Location

```powershell
$env:MINIKUBE_HOME
Test-Path "D:\minikube"
```

---

## 🐛 Troubleshooting

### Problem: "MINIKUBE_HOME not working"

**Solution:**
1. **Close ALL PowerShell windows**
2. **Open NEW PowerShell window**
3. **Check:** `$env:MINIKUBE_HOME`
4. **If empty, set it again:**
   ```powershell
   [Environment]::SetEnvironmentVariable("MINIKUBE_HOME", "D:\minikube", "User")
   ```
5. **Close and reopen PowerShell again**

---

### Problem: "Permission denied" when creating folder

**Solution:**
- Make sure the drive exists and is writable
- Try creating the folder manually first:
  ```powershell
  New-Item -ItemType Directory -Path "D:\minikube" -Force
  ```

---

### Problem: "Still using C: drive"

**Solution:**
1. **Check if old cluster exists:**
   ```powershell
   Test-Path "$env:USERPROFILE\.minikube"
   ```
2. **Delete old cluster:**
   ```powershell
   minikube delete
   Remove-Item -Recurse -Force "$env:USERPROFILE\.minikube" -ErrorAction SilentlyContinue
   ```
3. **Verify MINIKUBE_HOME is set:**
   ```powershell
   $env:MINIKUBE_HOME
   ```
4. **Start fresh:**
   ```powershell
   minikube start --driver=docker
   ```

---

## ✅ Success Checklist

- [ ] Chose a drive with enough space (2-3 GB minimum)
- [ ] Set `MINIKUBE_HOME` environment variable
- [ ] Closed and reopened PowerShell
- [ ] Verified `$env:MINIKUBE_HOME` shows correct path
- [ ] Deleted old cluster (if existed)
- [ ] Started Minikube successfully
- [ ] Verified `D:\minikube` folder was created
- [ ] Cluster is running: `minikube status`

---

## 💡 Tips

1. **Choose a drive with plenty of space** - Minikube needs ~2-3 GB for images and data
2. **Set it permanently** - Use environment variable so you don't have to remember
3. **Clean up old data** - Delete old `.minikube` folder on C: drive after confirming new location works
4. **Check before starting** - Always verify `$env:MINIKUBE_HOME` before running minikube commands

---

## 🎯 Example: Complete Setup on D: Drive

```powershell
# 1. Set environment variable permanently
[Environment]::SetEnvironmentVariable("MINIKUBE_HOME", "D:\minikube", "User")

# 2. Close and reopen PowerShell

# 3. Verify it's set
$env:MINIKUBE_HOME
# Output: D:\minikube

# 4. Delete old cluster (if exists)
minikube delete

# 5. Start Minikube on D: drive
minikube start --driver=docker --memory=2096 --cpus=2

# 6. Verify it's working
minikube status
kubectl get nodes

# 7. Check folder was created
Get-ChildItem "D:\minikube"
```

---

**That's it! Minikube will now use your chosen drive instead of C: drive! 🚀**


