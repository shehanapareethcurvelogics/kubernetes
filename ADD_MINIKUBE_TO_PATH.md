# Add Minikube to PATH - Manual Guide

## ⚠️ IMPORTANT: Add Directory Path, NOT Executable Path!

**❌ WRONG - Don't add this to PATH:**
```
C:\Program Files\Kubernetes\Minikube\minikube.exe
```

**✅ CORRECT - Add this directory to PATH:**
```
C:\Program Files\Kubernetes\Minikube
```

**Why?** PATH should contain directories, not full file paths. Windows will automatically find `minikube.exe` inside the directory.

---

## 📍 Minikube Installation Location

**Minikube directory (add this to PATH):**
```
C:\Program Files\Kubernetes\Minikube
```

**Full path to executable (for reference only, don't add to PATH):**
```
C:\Program Files\Kubernetes\Minikube\minikube.exe
```

---

## 🔧 Method 1: Add to PATH via GUI (Easiest)

### Step 1: Open Environment Variables

1. Press `Win + R` (Windows key + R)
2. Type: `sysdm.cpl`
3. Press Enter
4. Click **"Environment Variables"** button

### Step 2: Edit PATH

1. Under **"User variables"** section (top half)
2. Find **"Path"** in the list
3. Click **"Edit"** button

### Step 3: Add Minikube Path

1. **First, check if wrong path exists:**
   - Look for any entry with `minikube.exe` in the list
   - If found, select it and click **"Delete"** to remove it
   
2. Click **"New"** button
3. Paste this **directory** path (NOT the .exe file):
   ```
   C:\Program Files\Kubernetes\Minikube
   ```
   **⚠️ Make sure it does NOT end with `.exe`**
4. Click **"OK"**

### Step 4: Save Changes

1. Click **"OK"** on Environment Variables window
2. Click **"OK"** on System Properties window

### Step 5: Restart PowerShell

1. **Close** all PowerShell windows
2. **Open** a new PowerShell window
3. Test:
   ```powershell
   minikube version
   ```

---

## 🔧 Method 2: Add to PATH via PowerShell (Quick)

### Run PowerShell as Administrator

**Right-click PowerShell → Run as Administrator**

### Add to PATH

```powershell
# Add to User PATH
$currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "C:\Program Files\Kubernetes\Minikube"
if ($currentPath -notlike "*$newPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$newPath", "User")
    Write-Host "Added to PATH successfully!"
} else {
    Write-Host "Already in PATH!"
}
```

### Restart PowerShell

1. **Close** PowerShell
2. **Open** new PowerShell window
3. Test:
   ```powershell
   minikube version
   ```

---

## ✅ Verify It Works

After adding to PATH and restarting PowerShell:

```powershell
# Check if minikube is found
where.exe minikube

# Expected output:
# C:\Program Files\Kubernetes\Minikube\minikube.exe

# Check version
minikube version

# Expected output:
# minikube version: v1.37.0
```

---

## 🐛 If It Still Doesn't Work

### Check PATH was added correctly:

```powershell
$env:Path -split ';' | Select-String "Minikube"
```

**✅ Expected output (CORRECT):**
```
C:\Program Files\Kubernetes\Minikube
```

**❌ If you see this (WRONG - remove it):**
```
C:\Program Files\Kubernetes\Minikube\minikube.exe
```

**How to fix if wrong path is in PATH:**
1. Open Environment Variables (Win+R → `sysdm.cpl` → Environment Variables)
2. Find "Path" → Edit
3. Find and **DELETE** the entry with `minikube.exe`
4. **ADD** new entry: `C:\Program Files\Kubernetes\Minikube` (no .exe)
5. Click OK, close PowerShell, open new PowerShell
6. Test: `minikube version`

### If not found:

1. **Restart computer** (sometimes needed)
2. **Check spelling** - Make sure path is exactly:
   ```
   C:\Program Files\Kubernetes\Minikube
   ```
3. **Check if folder exists:**
   ```powershell
   Test-Path "C:\Program Files\Kubernetes\Minikube\minikube.exe"
   ```
   Should return: `True`

---

## 📝 Quick Reference

**Path to add:**
```
C:\Program Files\Kubernetes\Minikube
```

**Full executable path:**
```
C:\Program Files\Kubernetes\Minikube\minikube.exe
```

**After adding:**
- Close PowerShell
- Open new PowerShell
- Run: `minikube version`

---

**Add this path to your PATH environment variable, then restart PowerShell!** 🚀

