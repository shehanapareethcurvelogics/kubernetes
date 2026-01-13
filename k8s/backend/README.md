# Kubernetes Backend Deployment - Reference Guide

This README explains the Kubernetes YAML objects, keys, and structure used in the backend deployment configuration. Perfect for beginners learning Kubernetes!

## Table of Contents
1. [Overview](#overview)
2. [Complete Line-by-Line Key & Value Explanations](#complete-line-by-line-key--value-explanations)
3. [YAML Structure & Formatting](#yaml-structure--formatting)
4. [Database Configuration Section](#database-configuration-section)
5. [Complete Object Reference](#complete-object-reference)
6. [Key Concepts Explained](#key-concepts-explained)

---

## Overview

The `deployment.yaml` file defines a Kubernetes **Deployment** that runs a Django backend application with database migrations and health checks.

---

## Complete Line-by-Line Key & Value Explanations

This section provides detailed explanations for **every single key and value** in the `deployment.yaml` file, organized by section.

### Top-Level Object Definition

#### Line 1: `apiVersion: apps/v1`
- **Key**: `apiVersion`
- **Value**: `apps/v1`
- **Purpose**: Specifies which version of the Kubernetes API to use
- **Details**: 
  - `apps/v1` is the stable API version for Deployment objects
  - Different Kubernetes objects use different API versions (e.g., `v1` for ConfigMap, `apps/v1` for Deployment)
  - This tells Kubernetes which API schema to use when parsing the YAML
- **Why it matters**: Using the wrong API version can cause errors or unexpected behavior

#### Line 2: `kind: Deployment`
- **Key**: `kind`
- **Value**: `Deployment`
- **Purpose**: Defines the type of Kubernetes object this YAML file creates
- **Details**:
  - `Deployment` is a controller that manages Pods and ReplicaSets
  - It ensures a specified number of pod replicas are running
  - Provides rolling updates and rollback capabilities
- **Alternatives**: Could be `Pod`, `Service`, `ConfigMap`, `Secret`, etc.

### Metadata Section

#### Line 3: `metadata:`
- **Key**: `metadata`
- **Value**: (object/block)
- **Purpose**: Contains identifying information about the object
- **Details**: All Kubernetes objects have metadata that describes them

#### Line 4: `name: backend-deployment`
- **Key**: `name`
- **Value**: `backend-deployment`
- **Purpose**: Unique identifier for this Deployment within the namespace
- **Details**:
  - Must be unique within the namespace
  - Used in commands: `kubectl get deployment backend-deployment`
  - Follows DNS naming conventions (lowercase, hyphens allowed)
- **Naming Convention**: Usually `{application}-deployment` or `{component}-deployment`

#### Line 5: `namespace: django-auth-app`
- **Key**: `namespace`
- **Value**: `django-auth-app`
- **Purpose**: Logical grouping/partitioning of Kubernetes resources
- **Details**:
  - Isolates resources from other namespaces
  - Allows multiple teams/projects to share a cluster
  - Resources in different namespaces can have the same name
  - Default namespace is `default` if not specified
- **Why use namespaces**: Organization, access control, resource quotas

#### Line 6: `labels:`
- **Key**: `labels`
- **Value**: (object/block)
- **Purpose**: Key-value pairs for identifying and selecting objects
- **Details**: Labels are used for filtering, grouping, and selecting resources

#### Line 7: `app: backend`
- **Key**: `app` (under labels)
- **Value**: `backend`
- **Purpose**: Label that identifies this as a backend application component
- **Details**:
  - Used by selectors to find related resources
  - Can query: `kubectl get pods -l app=backend`
  - Common label keys: `app`, `version`, `environment`, `tier`
- **Usage**: Service selectors use this to route traffic to pods

### Spec Section (Deployment Level)

#### Line 8: `spec:`
- **Key**: `spec`
- **Value**: (object/block)
- **Purpose**: Describes the desired state of the Deployment
- **Details**: `spec` defines "what you want", Kubernetes makes it happen

#### Line 9: `replicas: 2`
- **Key**: `replicas`
- **Value**: `2`
- **Purpose**: Number of identical pod instances to run
- **Details**:
  - Kubernetes will ensure exactly 2 pods are running
  - If one fails, Kubernetes creates a new one
  - Provides high availability and load distribution
  - Can be changed: `kubectl scale deployment backend-deployment --replicas=3`
- **Why 2**: Balances availability with resource usage

#### Line 10: `selector:`
- **Key**: `selector`
- **Value**: (object/block)
- **Purpose**: Defines which pods this Deployment manages
- **Details**: Deployment uses selectors to identify pods it should control

#### Line 11: `matchLabels:`
- **Key**: `matchLabels`
- **Value**: (object/block)
- **Purpose**: Label selector that matches pods with specific labels
- **Details**: Only pods with matching labels are managed by this Deployment

#### Line 12: `app: backend`
- **Key**: `app` (under selector.matchLabels)
- **Value**: `backend`
- **Purpose**: Matches pods with label `app=backend`
- **Details**:
  - Must match labels in `spec.template.metadata.labels` (line 16)
  - Ensures Deployment only manages pods it created
  - Critical: Mismatch between selector and template labels causes errors

### Template Section (Pod Template)

#### Line 13: `template:`
- **Key**: `template`
- **Value**: (object/block)
- **Purpose**: Template for creating pods
- **Details**: Kubernetes uses this template to create new pods when needed

#### Line 14: `metadata:`
- **Key**: `metadata` (under template)
- **Value**: (object/block)
- **Purpose**: Metadata for pods created from this template
- **Details**: Each pod gets this metadata when created

#### Line 15: `labels:`
- **Key**: `labels` (under template.metadata)
- **Value**: (object/block)
- **Purpose**: Labels applied to each pod created from this template
- **Details**: Must match selector labels (line 12)

#### Line 16: `app: backend`
- **Key**: `app` (under template.metadata.labels)
- **Value**: `backend`
- **Purpose**: Label each pod with `app=backend`
- **Details**: 
  - Used by Services to route traffic
  - Must match selector.matchLabels (line 12)
  - Can add more labels: `version: v1`, `tier: backend`

#### Line 17: `spec:`
- **Key**: `spec` (under template)
- **Value**: (object/block)
- **Purpose**: Pod specification - defines containers, volumes, etc.
- **Details**: This is where you define what runs inside each pod

### Init Containers Section

#### Line 18: `initContainers:`
- **Key**: `initContainers`
- **Value**: (array/list)
- **Purpose**: Containers that run before main containers start
- **Details**:
  - Run sequentially (one after another)
  - All must succeed before main containers start
  - If any fails, pod is restarted
  - Common uses: migrations, data initialization, dependency checks

#### Line 19: `# Run migrations before starting the app`
- **Key**: (comment)
- **Value**: Documentation comment
- **Purpose**: Explains why init container exists
- **Details**: Comments help other developers understand the configuration

#### Line 20: `- name: migrate`
- **Key**: `name` (first item in initContainers array)
- **Value**: `migrate`
- **Purpose**: Unique name for this init container within the pod
- **Details**:
  - Used in logs: `kubectl logs <pod-name> -c migrate`
  - Helps identify which container to debug
  - Must be unique within the pod

#### Line 21: `image: shehanapareethcurvelogics/kubernetes-example-backend:latest`
- **Key**: `image`
- **Value**: `shehanapareethcurvelogics/kubernetes-example-backend:latest`
- **Purpose**: Docker image to use for this container
- **Details**:
  - Format: `[registry/]repository:tag`
  - `latest` tag means "most recent version"
  - Kubernetes pulls from Docker Hub (default registry)
  - Can use private registries with imagePullSecrets
- **Breaking it down**:
  - `shehanapareethcurvelogics` = Docker Hub username/organization
  - `kubernetes-example-backend` = repository name
  - `latest` = tag (version identifier)

#### Line 22: `imagePullPolicy: Always`
- **Key**: `imagePullPolicy`
- **Value**: `Always`
- **Purpose**: When to pull the image from registry
- **Details**:
  - `Always`: Always pull, even if image exists locally
  - `IfNotPresent`: Pull only if not present locally (default)
  - `Never`: Never pull, use local image only
- **Why Always**: Ensures you get the latest code changes during development
- **Production tip**: Use specific tags (e.g., `v1.2.3`) instead of `latest` for stability

#### Line 23: `command:`
- **Key**: `command`
- **Value**: (array/list)
- **Purpose**: Overrides the default command from Docker image
- **Details**: 
  - Docker images have default `CMD` or `ENTRYPOINT`
  - This replaces it with custom commands
  - First item is executable, rest are arguments

#### Line 24: `- sh`
- **Key**: (first command argument)
- **Value**: `sh`
- **Purpose**: Shell interpreter to use
- **Details**: `sh` is a basic shell available in most Linux containers

#### Line 25: `- -c`
- **Key**: (second command argument)
- **Value**: `-c`
- **Purpose**: Flag to `sh` meaning "execute command string"
- **Details**: Tells shell to execute the next argument as a command

#### Line 26: `- |`
- **Key**: (third command argument)
- **Value**: `|` (YAML multiline string indicator)
- **Purpose**: Starts a multiline string block
- **Details**: `|` preserves newlines, allows multiple commands

#### Lines 27-28: Migration Commands
```yaml
python manage.py makemigrations
python manage.py migrate
```
- **Purpose**: Django database migration commands
- **Details**:
  - `makemigrations`: Creates migration files for model changes
  - `migrate`: Applies migrations to database
  - These run before the app starts, ensuring DB schema is current
- **Why in init container**: Ensures database is ready before app tries to connect

#### Line 29: `env:`
- **Key**: `env`
- **Value**: (array/list)
- **Purpose**: Environment variables for the container
- **Details**: Variables available to processes running in the container

#### Line 30: `- name: DATABASE_URL`
- **Key**: `name` (first env variable)
- **Value**: `DATABASE_URL`
- **Purpose**: Environment variable name
- **Details**: Django uses this to connect to database

#### Line 31: `value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-svc:5432/$(POSTGRES_DB)"`
- **Key**: `value`
- **Value**: Connection string with variable substitution
- **Purpose**: Full database connection URL
- **Breaking it down**:
  - `postgresql://` = protocol
  - `$(POSTGRES_USER)` = username (substituted at runtime)
  - `:` = separator
  - `$(POSTGRES_PASSWORD)` = password (substituted)
  - `@` = separator before host
  - `postgres-svc` = Kubernetes service name (DNS resolves to pod IP)
  - `:5432` = PostgreSQL default port
  - `/$(POSTGRES_DB)` = database name
- **Variable substitution**: `$(VAR_NAME)` references other env vars
- **Why service name**: Kubernetes DNS resolves service names to pod IPs automatically

#### Line 32: `- name: DB_HOST`
- **Key**: `name` (second env variable)
- **Value**: `DB_HOST`
- **Purpose**: Database hostname environment variable
- **Details**: Some Django configurations use separate host variable

#### Line 33: `value: "postgres-svc"`
- **Key**: `value`
- **Value**: `postgres-svc`
- **Purpose**: Database service name
- **Details**:
  - This is the Kubernetes Service name, not an IP address
  - Kubernetes DNS automatically resolves this to the PostgreSQL pod's IP
  - Works because both are in the same namespace
  - Full DNS: `postgres-svc.django-auth-app.svc.cluster.local`

#### Line 34: `- name: POSTGRES_USER`
- **Key**: `name` (third env variable)
- **Value**: `POSTGRES_USER`
- **Purpose**: Database username environment variable
- **Details**: Used by Django and PostgreSQL connection

#### Line 35: `valueFrom:`
- **Key**: `valueFrom`
- **Value**: (object/block)
- **Purpose**: Get value from external source instead of hardcoding
- **Details**: More secure and flexible than hardcoded values

#### Line 36: `configMapKeyRef:`
- **Key**: `configMapKeyRef`
- **Value**: (object/block)
- **Purpose**: Reference to a ConfigMap key
- **Details**: Pulls non-sensitive configuration from ConfigMap

#### Line 37: `name: app-config`
- **Key**: `name` (under configMapKeyRef)
- **Value**: `app-config`
- **Purpose**: Name of the ConfigMap to reference
- **Details**: Must exist in the same namespace

#### Line 38: `key: POSTGRES_USER`
- **Key**: `key` (under configMapKeyRef)
- **Value**: `POSTGRES_USER`
- **Purpose**: Key name in the ConfigMap
- **Details**: The value of this key becomes the env var value

#### Lines 39-43: POSTGRES_PASSWORD from Secret
```yaml
- name: POSTGRES_PASSWORD
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: POSTGRES_PASSWORD
```
- **Purpose**: Get password from Secret (not ConfigMap)
- **Details**:
  - `secretKeyRef` instead of `configMapKeyRef` (sensitive data)
  - `name: app-secrets` = Secret name
  - `key: POSTGRES_PASSWORD` = key in Secret
- **Why Secret**: Passwords are sensitive, Secrets provide better security

#### Lines 44-48: POSTGRES_DB from ConfigMap
```yaml
- name: POSTGRES_DB
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: POSTGRES_DB
```
- **Purpose**: Database name from ConfigMap
- **Details**: Same pattern as POSTGRES_USER (non-sensitive config)

### Main Container Section

#### Line 49: `containers:`
- **Key**: `containers`
- **Value**: (array/list)
- **Purpose**: Main application containers
- **Details**: These run after init containers succeed

#### Line 50: `- name: backend`
- **Key**: `name` (first container)
- **Value**: `backend`
- **Purpose**: Container name identifier
- **Details**: Used in logs: `kubectl logs <pod-name> -c backend`

#### Line 51: `image: shehanapareethcurvelogics/kubernetes-example-backend:latest`
- **Key**: `image`
- **Value**: Same as init container
- **Purpose**: Docker image for main application
- **Details**: Same image, but runs different command (default from image)

#### Line 52: `imagePullPolicy: Always`
- **Key**: `imagePullPolicy`
- **Value**: `Always`
- **Purpose**: Same as init container
- **Details**: Ensures latest code is pulled

#### Line 53: `ports:`
- **Key**: `ports`
- **Value**: (array/list)
- **Purpose**: Container ports to expose
- **Details**: Documents which ports the container listens on

#### Line 54: `- containerPort: 8000`
- **Key**: `containerPort`
- **Value**: `8000`
- **Purpose**: Port number the container listens on
- **Details**:
  - Django default port is 8000
  - This is informational (doesn't actually open the port)
  - Service objects use this to route traffic
  - Must match what your app actually listens on

#### Line 55: `env:`
- **Key**: `env`
- **Value**: (array/list)
- **Purpose**: Environment variables for main container
- **Details**: Similar to init container, but includes more variables

#### Line 56: `- name: DEBUG`
- **Key**: `name` (first env var)
- **Value**: `DEBUG`
- **Purpose**: Django debug mode flag
- **Details**: Controls whether Django shows detailed error pages

#### Lines 57-60: DEBUG from ConfigMap
```yaml
valueFrom:
  configMapKeyRef:
    name: app-config
    key: DEBUG
```
- **Purpose**: Get DEBUG value from ConfigMap
- **Details**: Non-sensitive configuration, safe in ConfigMap

#### Lines 61-62: DATABASE_URL
- **Same as init container** (lines 30-31)
- **Purpose**: Database connection string for main app
- **Details**: Main container also needs DB access

#### Lines 63-64: DB_HOST
- **Same as init container** (lines 32-33)
- **Purpose**: Database hostname

#### Lines 65-69: POSTGRES_USER from ConfigMap
- **Same pattern as init container** (lines 34-38)
- **Purpose**: Database username

#### Lines 70-74: POSTGRES_PASSWORD from Secret
- **Same pattern as init container** (lines 39-43)
- **Purpose**: Database password

#### Lines 75-79: POSTGRES_DB from ConfigMap
- **Same pattern as init container** (lines 44-48)
- **Purpose**: Database name

#### Line 80: `- name: SECRET_KEY`
- **Key**: `name`
- **Value**: `SECRET_KEY`
- **Purpose**: Django secret key for cryptographic signing
- **Details**: Used for sessions, CSRF tokens, password reset links, etc.

#### Lines 81-84: SECRET_KEY from Secret
```yaml
valueFrom:
  secretKeyRef:
    name: app-secrets
    key: SECRET_KEY
```
- **Purpose**: Get secret key from Secret
- **Details**: 
  - Sensitive data, must be in Secret
  - Never hardcode in YAML or code
  - Different from POSTGRES_PASSWORD but same pattern

### Health Probes Section

#### Line 85: `livenessProbe:`
- **Key**: `livenessProbe`
- **Value**: (object/block)
- **Purpose**: Health check to determine if container is alive
- **Details**: 
  - If probe fails, Kubernetes restarts the container
  - Prevents serving traffic from dead/broken containers
  - Different from readiness probe

#### Line 86: `httpGet:`
- **Key**: `httpGet`
- **Value**: (object/block)
- **Purpose**: Type of probe - HTTP GET request
- **Details**: 
  - Other types: `exec` (run command), `tcpSocket` (TCP connection)
  - `httpGet` checks if HTTP endpoint responds

#### Line 87: `path: /api/auth/health/`
- **Key**: `path`
- **Value**: `/api/auth/health/`
- **Purpose**: HTTP path to check
- **Details**: 
  - Your Django app must have this endpoint
  - Should return 200 OK if healthy
  - Should be lightweight (don't check database here)

#### Line 88: `port: 8000`
- **Key**: `port`
- **Value**: `8000`
- **Purpose**: Port to check
- **Details**: Must match containerPort (line 54)

#### Line 89: `initialDelaySeconds: 30`
- **Key**: `initialDelaySeconds`
- **Value**: `30`
- **Purpose**: Wait 30 seconds before first probe
- **Details**:
  - Gives app time to start up
  - Prevents false failures during startup
  - Should be longer than app startup time

#### Line 90: `periodSeconds: 10`
- **Key**: `periodSeconds`
- **Value**: `10`
- **Purpose**: Check every 10 seconds after initial delay
- **Details**: 
  - Balance between responsiveness and load
  - Too frequent = unnecessary load
  - Too infrequent = slow failure detection

#### Line 91: `readinessProbe:`
- **Key**: `readinessProbe`
- **Value**: (object/block)
- **Purpose**: Health check to determine if container is ready for traffic
- **Details**:
  - Different from liveness: readiness removes from load balancer, liveness restarts
  - Pod can be alive but not ready (e.g., still starting up)

#### Lines 92-94: Readiness HTTP Get
```yaml
httpGet:
  path: /api/auth/health/
  port: 8000
```
- **Same as liveness probe**
- **Purpose**: Check if app can handle requests
- **Details**: Uses same endpoint but different timing

#### Line 95: `initialDelaySeconds: 10`
- **Key**: `initialDelaySeconds` (readiness)
- **Value**: `10`
- **Purpose**: Wait 10 seconds before first readiness check
- **Details**: 
  - Shorter than liveness (30s) because readiness checks earlier
  - App might be ready before fully "alive"

#### Line 96: `periodSeconds: 5`
- **Key**: `periodSeconds` (readiness)
- **Value**: `5`
- **Purpose**: Check every 5 seconds
- **Details**: More frequent than liveness (10s) for faster traffic routing

#### Line 97: `successThreshold: 1`
- **Key**: `successThreshold`
- **Value**: `1`
- **Purpose**: Number of consecutive successes needed to mark ready
- **Details**: 
  - `1` means one success = ready
  - Higher values prevent flapping (ready/unready/ready)
  - Default is 1

#### Line 98: `failureThreshold: 3`
- **Key**: `failureThreshold`
- **Value**: `3`
- **Purpose**: Number of consecutive failures before marking unready
- **Details**:
  - `3` failures = 3 × 5 seconds = 15 seconds of failures
  - Prevents temporary glitches from marking pod unready
  - Default is 3

---

## Summary: Key-Value Reference Table

| Line | Key Path | Value | Purpose |
|------|----------|-------|---------|
| 1 | `apiVersion` | `apps/v1` | Kubernetes API version |
| 2 | `kind` | `Deployment` | Object type |
| 4 | `metadata.name` | `backend-deployment` | Deployment identifier |
| 5 | `metadata.namespace` | `django-auth-app` | Resource grouping |
| 7 | `metadata.labels.app` | `backend` | Label for selection |
| 9 | `spec.replicas` | `2` | Number of pod instances |
| 12 | `spec.selector.matchLabels.app` | `backend` | Pod selector |
| 16 | `spec.template.metadata.labels.app` | `backend` | Pod label (must match selector) |
| 20 | `spec.template.spec.initContainers[0].name` | `migrate` | Init container name |
| 21 | `spec.template.spec.initContainers[0].image` | `shehanapareethcurvelogics/kubernetes-example-backend:latest` | Docker image |
| 22 | `spec.template.spec.initContainers[0].imagePullPolicy` | `Always` | Always pull latest image |
| 30 | `spec.template.spec.initContainers[0].env[0].name` | `DATABASE_URL` | Database connection string |
| 50 | `spec.template.spec.containers[0].name` | `backend` | Main container name |
| 54 | `spec.template.spec.containers[0].ports[0].containerPort` | `8000` | Application port |
| 87 | `spec.template.spec.containers[0].livenessProbe.httpGet.path` | `/api/auth/health/` | Health check endpoint |
| 89 | `spec.template.spec.containers[0].livenessProbe.initialDelaySeconds` | `30` | Wait before first liveness check |
| 95 | `spec.template.spec.containers[0].readinessProbe.initialDelaySeconds` | `10` | Wait before first readiness check |

---

## YAML Structure & Formatting

### Basic YAML Rules
- **Indentation**: Uses spaces (typically 2 spaces per level)
- **Key-Value Pairs**: `key: value`
- **Lists**: Items prefixed with `-` (hyphen)
- **Nested Objects**: Indented under parent keys
- **Comments**: Start with `#`

### Top-Level Structure
```yaml
apiVersion: apps/v1          # Kubernetes API version
kind: Deployment             # Type of Kubernetes object
metadata:                    # Object identification
  name: backend-deployment
  namespace: django-auth-app
  labels:                    # Key-value pairs for grouping
    app: backend
spec:                        # Desired state configuration
  # ... deployment specifications
```

---

## Database Configuration Section

### Database Environment Variables

The database configuration appears in two places:
1. **Init Container** (runs migrations before app starts)
2. **Main Container** (runs the application)

#### Database-Related Keys

| Key | Purpose | Source | Example Value |
|-----|---------|--------|---------------|
| `DATABASE_URL` | Full PostgreSQL connection string | Constructed from other env vars | `postgresql://user:pass@postgres-svc:5432/dbname` |
| `DB_HOST` | Database server hostname | Hardcoded value | `postgres-svc` (Kubernetes service name) |
| `POSTGRES_USER` | Database username | ConfigMap (`app-config`) | `django_user` |
| `POSTGRES_PASSWORD` | Database password | Secret (`app-secrets`) | `django_pass` (base64 encoded) |
| `POSTGRES_DB` | Database name | ConfigMap (`app-config`) | `django_auth_db` |

### Database Configuration Breakdown

#### 1. DATABASE_URL (Constructed Connection String)
```yaml
env:
- name: DATABASE_URL
  value: "postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@postgres-svc:5432/$(POSTGRES_DB)"
```
- **Purpose**: Complete database connection URL for Django
- **Format**: `postgresql://username:password@host:port/database`
- **Variable Substitution**: Uses `$(VARIABLE_NAME)` syntax to reference other env vars
- **Host**: `postgres-svc` is the Kubernetes Service name (not an IP address)

#### 2. DB_HOST
```yaml
env:
- name: DB_HOST
  value: "postgres-svc"
```
- **Purpose**: Database hostname for Django settings
- **Why Service Name?**: In Kubernetes, services provide DNS names. `postgres-svc` resolves to the PostgreSQL pod's IP automatically.

#### 3. POSTGRES_USER (from ConfigMap)
```yaml
env:
- name: POSTGRES_USER
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: POSTGRES_USER
```
- **Purpose**: Database username
- **Source**: ConfigMap (non-sensitive configuration)
- **Reference Pattern**: `valueFrom.configMapKeyRef` pulls values from ConfigMaps

#### 4. POSTGRES_PASSWORD (from Secret)
```yaml
env:
- name: POSTGRES_PASSWORD
  valueFrom:
    secretKeyRef:
      name: app-secrets
      key: POSTGRES_PASSWORD
```
- **Purpose**: Database password (sensitive data)
- **Source**: Secret (encrypted storage for sensitive data)
- **Reference Pattern**: `valueFrom.secretKeyRef` pulls values from Secrets
- **Security**: Never hardcode passwords in YAML files!

#### 5. POSTGRES_DB (from ConfigMap)
```yaml
env:
- name: POSTGRES_DB
  valueFrom:
    configMapKeyRef:
      name: app-config
      key: POSTGRES_DB
```
- **Purpose**: Name of the database to connect to
- **Source**: ConfigMap

---

## Complete Object Reference

### Deployment Object Structure

```yaml
apiVersion: apps/v1
kind: Deployment
```

#### metadata Section
| Key | Purpose | Example |
|-----|---------|---------|
| `name` | Unique name for this deployment | `backend-deployment` |
| `namespace` | Logical grouping of resources | `django-auth-app` |
| `labels` | Key-value pairs for selection/grouping | `app: backend` |

#### spec Section (Deployment Level)
| Key | Purpose | Example |
|-----|---------|---------|
| `replicas` | Number of pod instances to run | `2` (for high availability) |
| `selector.matchLabels` | Labels to identify pods managed by this deployment | `app: backend` |
| `template` | Pod template definition | See below |

#### spec.template Section (Pod Template)
| Key | Purpose |
|-----|---------|
| `metadata.labels` | Labels applied to pods created from this template |
| `spec` | Pod specification (containers, volumes, etc.) |

#### spec.template.spec Section (Pod Spec)
| Key | Purpose |
|-----|---------|
| `initContainers` | Containers that run before main containers (e.g., migrations) |
| `containers` | Main application containers |
| `volumes` | Storage volumes (if needed) |

### Init Container Section

```yaml
initContainers:
- name: migrate
```

| Key | Purpose | Example |
|-----|---------|---------|
| `name` | Container name identifier | `migrate` |
| `image` | Docker image to use | `shehanapareethcurvelogics/kubernetes-example-backend:latest` |
| `imagePullPolicy` | When to pull image | `Always` (always pull latest) |
| `command` | Command to run in container | `["sh", "-c", "..."]` |
| `env` | Environment variables | See [Database Configuration](#database-configuration-section) |

**Init Container Purpose**: Runs database migrations before the main app starts, ensuring the database schema is up-to-date.

### Main Container Section

```yaml
containers:
- name: backend
```

| Key | Purpose | Example |
|-----|---------|---------|
| `name` | Container name | `backend` |
| `image` | Docker image | Same as init container |
| `imagePullPolicy` | Image pull behavior | `Always` |
| `ports` | Exposed container ports | `containerPort: 8000` |
| `env` | Environment variables | See [Database Configuration](#database-configuration-section) |
| `livenessProbe` | Health check to restart unhealthy pods | HTTP GET to `/api/auth/health/` |
| `readinessProbe` | Health check to route traffic only to ready pods | HTTP GET to `/api/auth/health/` |

### Health Probe Configuration

#### Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /api/auth/health/
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
```

| Key | Purpose | Value |
|-----|---------|-------|
| `httpGet.path` | Health check endpoint | `/api/auth/health/` |
| `httpGet.port` | Port to check | `8000` |
| `initialDelaySeconds` | Wait time before first check | `30` seconds |
| `periodSeconds` | Time between checks | `10` seconds |

**Purpose**: If health check fails, Kubernetes restarts the pod.

#### Readiness Probe
```yaml
readinessProbe:
  httpGet:
    path: /api/auth/health/
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 5
  successThreshold: 1
  failureThreshold: 3
```

| Key | Purpose | Value |
|-----|---------|-------|
| `initialDelaySeconds` | Wait before first check | `10` seconds |
| `periodSeconds` | Time between checks | `5` seconds |
| `successThreshold` | Consecutive successes needed | `1` |
| `failureThreshold` | Consecutive failures before marking unready | `3` |

**Purpose**: Pod receives traffic only when ready. If unready, traffic is stopped.

---

## Key Concepts Explained

### 1. ConfigMap vs Secret

| Feature | ConfigMap | Secret |
|---------|-----------|--------|
| **Use Case** | Non-sensitive configuration | Sensitive data (passwords, keys) |
| **Reference** | `configMapKeyRef` | `secretKeyRef` |
| **Example** | `POSTGRES_USER`, `POSTGRES_DB`, `DEBUG` | `POSTGRES_PASSWORD`, `SECRET_KEY` |
| **Storage** | Plain text (base64 encoded) | Base64 encoded (not encrypted!) |

**Important**: Secrets are base64 encoded, not encrypted. For production, use external secret management tools.

### 2. Environment Variable Sources

Three ways to set environment variables:

1. **Direct Value**
   ```yaml
   env:
   - name: DB_HOST
     value: "postgres-svc"
   ```

2. **From ConfigMap**
   ```yaml
   env:
   - name: POSTGRES_USER
     valueFrom:
       configMapKeyRef:
         name: app-config
         key: POSTGRES_USER
   ```

3. **From Secret**
   ```yaml
   env:
   - name: POSTGRES_PASSWORD
     valueFrom:
       secretKeyRef:
         name: app-secrets
         key: POSTGRES_PASSWORD
   ```

### 3. Service Names as Hostnames

In Kubernetes, **Services** provide DNS names for pods:
- Service name: `postgres-svc`
- Resolves to: Pod IP addresses automatically
- Format: `service-name.namespace.svc.cluster.local`
- Short form: `postgres-svc` (same namespace) or `postgres-svc.django-auth-app` (cross-namespace)

### 4. Init Containers

- Run **before** main containers
- Must complete successfully before main containers start
- Common use cases:
  - Database migrations
  - Data initialization
  - Dependency checks

### 5. Health Probes

| Probe Type | Purpose | Action on Failure |
|------------|---------|-------------------|
| **Liveness** | Is the app running? | Restart the pod |
| **Readiness** | Is the app ready for traffic? | Remove from load balancer |

---

## Quick Reference: Database Configuration Flow

```
┌─────────────────┐
│  ConfigMap      │
│  (app-config)   │───┐
└─────────────────┘   │
                      ├──► POSTGRES_USER
┌─────────────────┐   │    POSTGRES_DB
│  Secret         │   │
│  (app-secrets)  │───┼──► POSTGRES_PASSWORD
└─────────────────┘   │
                      │
┌─────────────────┐   │
│  Hardcoded      │   │
│  DB_HOST        │───┘
└─────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │  DATABASE_URL        │
         │  (Constructed)       │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │  Backend Container   │
         │  (Django App)        │
         └──────────────────────┘
                      │
                      ▼
         ┌──────────────────────┐
         │  PostgreSQL Service  │
         │  (postgres-svc)      │
         └──────────────────────┘
```

---

## Common Patterns

### Pattern 1: Referencing ConfigMap Values
```yaml
env:
- name: VARIABLE_NAME
  valueFrom:
    configMapKeyRef:
      name: config-map-name
      key: key-name
```

### Pattern 2: Referencing Secret Values
```yaml
env:
- name: VARIABLE_NAME
  valueFrom:
    secretKeyRef:
      name: secret-name
      key: key-name
```

### Pattern 3: Constructing Connection Strings
```yaml
env:
- name: CONNECTION_STRING
  value: "protocol://$(USERNAME):$(PASSWORD)@$(HOST):$(PORT)/$(DATABASE)"
```

---

## Best Practices

1. ✅ **Use Secrets for passwords** - Never hardcode sensitive data
2. ✅ **Use ConfigMaps for non-sensitive config** - Easy to update
3. ✅ **Use Service names for inter-pod communication** - Not IP addresses
4. ✅ **Set appropriate health probe delays** - Allow app startup time
5. ✅ **Use init containers for setup tasks** - Keeps main container focused
6. ✅ **Use namespaces** - Organize resources logically
7. ✅ **Label everything** - Makes selection and management easier

---

## Troubleshooting Tips

### Check if environment variables are set:
```bash
kubectl exec -it <pod-name> -n django-auth-app -- env | grep POSTGRES
```

### View ConfigMap:
```bash
kubectl get configmap app-config -n django-auth-app -o yaml
```

### View Secret (decoded):
```bash
kubectl get secret app-secrets -n django-auth-app -o jsonpath='{.data.POSTGRES_PASSWORD}' | base64 -d
```

### Check pod logs:
```bash
kubectl logs <pod-name> -n django-auth-app
```

### Check init container logs:
```bash
kubectl logs <pod-name> -n django-auth-app -c migrate
```

---

## Additional Resources

- [Kubernetes Deployment Documentation](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [ConfigMaps Documentation](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets Documentation](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Init Containers Documentation](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)
- [Health Probes Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)

---

**Happy Learning! 🚀**

