# Jenkins + Docker Hub Guide (Beginner Friendly)

## 🎯 What Happened in Your Pipeline?

### ✅ What Worked:
1. **Git Checkout** ✅ - Code was successfully pulled from GitHub
2. **Docker Builds** ✅ - Both images built successfully:
   - `shehanaclg/kubernetes-example-backend:7`
   - `shehanaclg/kubernetes-example-frontend:7`

### ❌ What Didn't Work:
1. **Tests Failed** - But this is OK, tests are optional
2. **Images NOT Pushed to Docker Hub** - This is why you don't see them on Docker Hub
3. **Kubernetes Permissions** - Service account needs more permissions

---

## 📤 How to Push Images to Docker Hub

### Step 1: Create Docker Hub Credentials in Jenkins

1. **Go to Jenkins UI** → `http://192.168.49.2:30090`
2. **Click**: `Manage Jenkins` → `Credentials`
3. **Click**: `(global)` → `Add Credentials`
4. **Fill in**:
   - **Kind**: `Username with password`
   - **Username**: Your Docker Hub username (`shehanaclg`)
   - **Password**: Your Docker Hub **Personal Access Token** (NOT your password!)
   - **ID**: `docker-hub-credentials` (must match exactly!)
   - **Description**: `Docker Hub credentials`
5. **Click**: `Create`

### Step 2: Get Docker Hub Personal Access Token

**If you don't have a token:**

1. Go to **Docker Hub**: https://hub.docker.com
2. Login with your account
3. Click your **username** (top right) → **Account Settings**
4. Go to **Security** → **New Access Token**
5. **Token description**: `Jenkins CI/CD`
6. **Permissions**: `Read & Write` (or `Read, Write & Delete`)
7. **Generate** and **COPY THE TOKEN** (you won't see it again!)

**Important**: Use this token as the password in Jenkins credentials, NOT your Docker Hub password!

### Step 3: Run Pipeline Again

After adding credentials, run the pipeline again. The images will be pushed to Docker Hub.

---

## 🔍 How to Check if Images Were Pushed

### Option 1: Check Docker Hub Website
1. Go to: https://hub.docker.com/u/shehanaclg
2. You should see:
   - `kubernetes-example-backend`
   - `kubernetes-example-frontend`

### Option 2: Check in Terminal
```bash
# Login to Docker Hub
docker login -u shehanaclg

# Check your repositories
# (Go to Docker Hub website to see them)
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Credentials not found"
**Error**: `Credentials 'docker-hub-credentials' not found`

**Fix**: 
- Make sure the credential ID is exactly: `docker-hub-credentials`
- Check: Jenkins → Credentials → Is it there?

### Issue 2: "Authentication failed"
**Error**: `unauthorized: authentication required`

**Fix**:
- Make sure you're using a **Personal Access Token**, not your password
- Check if the token has correct permissions (Read & Write)

### Issue 3: "Permission denied"
**Error**: `denied: requested access to the resource is denied`

**Fix**:
- Make sure your Docker Hub username matches: `shehanaclg`
- Check image name matches your Docker Hub username

---

## 📋 Pipeline Flow (What Happens)

```
1. Git Checkout
   ↓
2. Build Backend Image ✅
   ↓
3. Build Frontend Image ✅
   ↓
4. Run Tests (Optional - failures won't stop pipeline)
   ↓
5. Push Images to Docker Hub ⚠️ (Needs credentials!)
   ↓
6. Deploy to Kubernetes
   ↓
7. Health Check
```

---

## 🎓 Understanding Docker Hub

### What is Docker Hub?
- **Docker Hub** = Cloud storage for Docker images
- Like GitHub, but for Docker images
- You can pull images from anywhere: `docker pull shehanaclg/kubernetes-example-backend`

### Image Names:
- Format: `username/image-name:tag`
- Example: `shehanaclg/kubernetes-example-backend:7`
  - `shehanaclg` = Your Docker Hub username
  - `kubernetes-example-backend` = Image name
  - `7` = Tag (build number)

### Tags:
- `7` = Build number (specific version)
- `latest` = Always points to the newest version

---

## ✅ Quick Checklist

- [ ] Docker Hub account created (`shehanaclg`)
- [ ] Personal Access Token created
- [ ] Credentials added in Jenkins (`docker-hub-credentials`)
- [ ] Pipeline runs successfully
- [ ] Images appear on Docker Hub website

---

## 🚀 Next Steps

1. **Add Docker Hub credentials** (Step 1 above)
2. **Run pipeline again**
3. **Check Docker Hub** - Your images should be there!
4. **Pull images** from anywhere: `docker pull shehanaclg/kubernetes-example-backend:latest`

---

## 💡 Pro Tips

1. **Always use Personal Access Tokens** - Never use passwords
2. **Check Docker Hub after push** - Verify images are there
3. **Use tags** - Tag images with build numbers for versioning
4. **Keep tokens secure** - Don't share or commit them

---

✅ **After fixing credentials, your images will be pushed to Docker Hub automatically!**

