# Jenkins CI/CD Pipeline for Django + React Kubernetes Application

This directory contains Jenkins CI/CD pipeline configuration for automating the build, test, and deployment of your Django + React application to Kubernetes.

## 📁 Files Overview

- **`Jenkinsfile`** - Main CI/CD pipeline definition (Groovy DSL)
- **`jenkins-deployment.yaml`** - Kubernetes manifests to deploy Jenkins in your cluster
- **`jenkins-config.yaml`** - Configuration guide and setup instructions
- **`README.md`** - This file

## 🎯 Pipeline Overview

The Jenkins pipeline automates the following steps:

```
┌─────────────┐
│   Checkout  │  ← Get code from repository
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Build Backend│  ← Build Django Docker image
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Build Frontend│  ← Build React Docker image
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Run Tests   │  ← Execute backend & frontend tests
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Push Images │  ← Push to Docker Hub (optional)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Load to K8s  │  ← Load images to Minikube
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Deploy K8s  │  ← Deploy to Kubernetes
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Health Check │  ← Verify deployment
└─────────────┘
```

## 🚀 Quick Start

### Option 1: Run Jenkins in Kubernetes (Recommended)

1. **Deploy Jenkins to Kubernetes:**

```bash
kubectl apply -f jenkins/jenkins-deployment.yaml
```

2. **Get Jenkins URL:**

```bash
# Get Minikube IP
minikube ip

# Access Jenkins at: http://<minikube-ip>:30088
# Or use port-forward:
kubectl port-forward service/jenkins 8080:8080 -n jenkins
# Access at: http://localhost:8080
```

3. **Get Jenkins Admin Password:**

```bash
kubectl exec -it deployment/jenkins -n jenkins -- cat /var/jenkins_home/secrets/initialAdminPassword
```

### Option 2: Run Jenkins Locally (Docker)

```bash
docker run -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

Access at: `http://localhost:8080`

## ⚙️ Jenkins Setup

### Step 1: Install Required Plugins

Go to **Manage Jenkins > Manage Plugins** and install:

- ✅ **Docker Pipeline** - For building Docker images
- ✅ **Kubernetes** - For deploying to Kubernetes
- ✅ **Git** - For source control integration
- ✅ **Pipeline** - For pipeline support
- ✅ **Blue Ocean** (optional) - Better UI

### Step 2: Configure Docker Hub Credentials

1. Go to **Manage Jenkins > Credentials**
2. Click **Add Credentials**
3. Select **Username with password**
4. Set:
   - **ID**: `docker-hub-credentials`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password/token
5. Click **OK**

### Step 3: Configure Kubernetes Access

**If Jenkins is in Kubernetes:**
- Jenkins service account already has permissions (configured in `jenkins-deployment.yaml`)

**If Jenkins is outside Kubernetes:**
1. Copy your kubeconfig: `~/.kube/config`
2. Go to **Manage Jenkins > Configure System**
3. Add **Kubernetes Cloud** configuration
4. Or ensure `kubectl` and `minikube` commands are available in Jenkins

### Step 4: Create Pipeline Job

1. Click **New Item**
2. Enter name: `django-react-k8s-pipeline`
3. Select **Pipeline**
4. Click **OK**
5. In **Pipeline** section:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your repository URL
   - **Branch**: `*/main` or `*/master`
   - **Script Path**: `jenkins/Jenkinsfile`
6. Click **Save**

### Step 5: Configure Pipeline Parameters (Optional)

Add environment variables in Jenkins:

1. Go to your pipeline > **Configure**
2. Under **Build Triggers**, check **This project is parameterized**
3. Add **String Parameter**:
   - **Name**: `PUSH_TO_REGISTRY`
   - **Default Value**: `false`
4. Add **String Parameter**:
   - **Name**: `LOAD_TO_MINIKUBE`
   - **Default Value**: `true`

## 🔄 Pipeline Stages Explained

### 1. Checkout
- Clones repository
- Gets git commit hash for tagging

### 2. Build Backend
- Builds Django Docker image
- Tags with: `BUILD_NUMBER`, `latest`, `git-commit-hash`

### 3. Build Frontend
- Builds React Docker image
- Tags with: `BUILD_NUMBER`, `latest`, `git-commit-hash`

### 4. Run Tests
- Runs Django tests (backend)
- Runs React tests (frontend)
- Runs in parallel for speed

### 5. Push Images (Optional)
- Pushes images to Docker Hub
- Only runs if `PUSH_TO_REGISTRY=true`

### 6. Load Images to Minikube
- Loads images into Minikube's Docker daemon
- Required for local Kubernetes deployment

### 7. Deploy to Kubernetes
- Applies all Kubernetes manifests
- Waits for deployments to be ready
- Shows deployment status

### 8. Health Check
- Checks if frontend is accessible
- Checks if backend API is responding
- Verifies deployment success

## 🎛️ Pipeline Configuration

### Environment Variables

Edit `Jenkinsfile` to customize:

```groovy
environment {
    DOCKER_REGISTRY = 'shehanaclg'  // Your Docker Hub username
    BACKEND_IMAGE = "${DOCKER_REGISTRY}/kubernetes-example-backend"
    FRONTEND_IMAGE = "${DOCKER_REGISTRY}/kubernetes-example-frontend"
    K8S_NAMESPACE = 'django-auth-app'
    DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
}
```

### Conditional Stages

The pipeline includes conditional stages:

- **Push Images**: Only runs if `PUSH_TO_REGISTRY=true`
- **Load to Minikube**: Runs if `LOAD_TO_MINIKUBE=true` or if not pushing to registry

## 🔗 Webhook Setup (Automatic Triggers)

### GitHub Webhook

1. Go to your GitHub repository > **Settings > Webhooks**
2. Click **Add webhook**
3. Set:
   - **Payload URL**: `http://your-jenkins-url/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: Just the `push` event
4. Click **Add webhook**

### GitLab Webhook

1. Go to your GitLab project > **Settings > Webhooks**
2. Set:
   - **URL**: `http://your-jenkins-url/project/your-pipeline-name`
   - **Trigger**: Push events
3. Click **Add webhook**

## 📊 Monitoring Pipeline

### View Pipeline Status

1. Go to your pipeline job
2. Click **Build Now** to trigger manually
3. Click on build number to see details
4. Click **Console Output** to see logs

### Blue Ocean UI (Optional)

1. Install **Blue Ocean** plugin
2. Click **Open Blue Ocean** from pipeline
3. Visual pipeline representation
4. Better debugging and monitoring

## 🐛 Troubleshooting

### Issue: "docker: command not found"

**Solution:**
- Install Docker in Jenkins container
- Or mount Docker socket: `/var/run/docker.sock`
- Or use Docker-in-Docker (DinD)

### Issue: "kubectl: command not found"

**Solution:**
- Install kubectl in Jenkins container
- Or use Kubernetes plugin
- Or mount kubectl binary

### Issue: "minikube: command not found"

**Solution:**
- Install Minikube in Jenkins container
- Or use `kubectl` directly instead of `minikube` commands
- Update pipeline to use `kubectl` instead

### Issue: "Permission denied" for Docker

**Solution:**
- Add Jenkins user to docker group
- Or run Jenkins with Docker socket mounted
- Check Docker socket permissions

### Issue: Images not found in Minikube

**Solution:**
- Ensure images are loaded: `minikube image load <image>`
- Or use Docker Hub images instead
- Check image names match in deployment files

### Issue: Pipeline fails at deployment

**Solution:**
- Check Kubernetes manifests are valid: `kubectl apply --dry-run=client -f k8s/`
- Verify namespace exists: `kubectl get namespace django-auth-app`
- Check pod logs: `kubectl logs -n django-auth-app <pod-name>`

## 📝 Customizing the Pipeline

### Add More Stages

Edit `Jenkinsfile` to add stages:

```groovy
stage('Your Stage') {
    steps {
        echo 'Your steps here...'
        sh 'your-command'
    }
}
```

### Add Notifications

Add to `post` section:

```groovy
post {
    failure {
        emailext (
            subject: "Pipeline Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            body: "Check console output: ${env.BUILD_URL}",
            to: "your-email@example.com"
        )
    }
}
```

### Add Slack Notifications

1. Install **Slack Notification** plugin
2. Add to `post` section:

```groovy
post {
    success {
        slackSend(
            channel: '#deployments',
            color: 'good',
            message: "✅ Pipeline succeeded: ${env.BUILD_URL}"
        )
    }
}
```

## 🎓 Learning Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Jenkinsfile Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)

## ✅ Checklist

- [ ] Jenkins installed and running
- [ ] Required plugins installed
- [ ] Docker Hub credentials configured
- [ ] Kubernetes access configured
- [ ] Pipeline job created
- [ ] Webhook configured (optional)
- [ ] Test pipeline run successful

---

**Happy CI/CD! 🚀**

