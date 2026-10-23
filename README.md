# SecureFlow DevSecOps

SecureFlow is a DevSecOps demonstration project that integrates automated testing, static application security testing (SAST), dependency vulnerability auditing, Docker image scanning, and Kubernetes manifest validation into a GitHub Actions CI pipeline.

The project demonstrates how a Node.js REST API can be tested, containerized, security-scanned, and deployed to a local K3s Kubernetes cluster.

**Repository:** https://github.com/bukummy8/secureflow-devsecops

## Project Overview

Building and deploying microservices is straightforward to start, but maintaining security and reliability throughout the delivery process requires consistent checks.

SecureFlow addresses this challenge by integrating automated testing and security validation into the software delivery workflow.

Every push to `main` triggers a GitHub Actions workflow that runs application tests, source-code security analysis, dependency auditing, Docker image building and vulnerability scanning, and Kubernetes manifest validation.

## Project Objectives

- Build a Node.js REST API using Express.
- Write automated tests for API endpoints.
- Containerize the application using Docker.
- Deploy the API to a local K3s Kubernetes cluster.
- Run multiple application replicas.
- Configure readiness and liveness probes.
- Implement static security analysis with Semgrep.
- Audit application dependencies using npm.
- Scan container images with Trivy.
- Validate Kubernetes manifests with Kubeconform.
- Automate quality and security checks with GitHub Actions.

## Architecture

```text
Developer
    |
    | git push
    v
GitHub Repository
    |
    v
GitHub Actions CI Pipeline
    |
    +--> Application Tests (Node.js Test Runner)
    |
    +--> Static Analysis (Semgrep)
    |
    +--> Dependency Audit (npm audit)
    |
    v
Docker Image Build
    |
    v
Trivy Vulnerability Scan
    |
    v
Kubernetes Manifest Validation
    |
    v
Successful CI Pipeline

Local Deployment
    |
    v
K3s Kubernetes Cluster
    |
    +--> SecureFlow API Pod 1
    |
    +--> SecureFlow API Pod 2
    |
    v
Kubernetes Service
    |
    v
SecureFlow REST API
```

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | Application runtime |
| Express.js | REST API framework |
| Node.js Test Runner | Automated API testing |
| npm | Dependency management and auditing |
| Docker | Containerization |
| K3s | Lightweight Kubernetes distribution |
| Kubernetes | Container orchestration |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Actions | CI automation |
| Semgrep | Static application security testing |
| Trivy | Container vulnerability scanning |
| Kubeconform | Kubernetes schema validation |

## Application Endpoints

The API exposes three endpoints:

| Endpoint | Purpose |
|---|---|
| `GET /` | Returns project information |
| `GET /health` | Reports the application health status |
| `GET /api` | Returns service and environment information |

Example health response:

```json
{
  "status": "healthy"
}
```

## Automated Testing

SecureFlow uses the built-in Node.js test runner to test the API without requiring an additional test framework.

The current test suite verifies:

- The root endpoint returns the expected project information.
- The health endpoint returns HTTP 200 and a healthy status.
- The API endpoint returns the expected service and environment information.

Run the tests from the repository root:

```bash
npm --prefix app test
```

**Latest locally verified result:** 3 tests passed, 0 failed.

## DevSecOps CI Pipeline

The workflow is defined in `.github/workflows/devsecops.yml`.

### 1. Application Testing

Installs the application dependencies and runs the automated test suite using Node.js 22.

### 2. Static Application Security Testing

Runs Semgrep against the configured security rules, including checks for:

- `eval(...)`
- `child_process.exec(...)`

These rules are intended to identify potentially dangerous code patterns.

### 3. Dependency Security

Runs:

```bash
npm audit --omit=dev --audit-level=high
```

This checks production dependencies for reported vulnerabilities at the configured severity threshold.

**Latest locally verified result:** zero vulnerabilities reported.

### 4. Docker Build and Vulnerability Scan

Builds the Docker image and scans operating-system packages and application libraries using Trivy.

The pipeline is configured to fail on detected HIGH or CRITICAL vulnerabilities, with unfixed vulnerabilities ignored.

A previously recorded scan of `secureflow-api:1.2` reported zero detected HIGH/CRITICAL vulnerabilities within the configured scan scope.

### 5. Kubernetes Validation

Uses Kubeconform to validate the Kubernetes Namespace, Deployment, and Service manifests in strict mode.

**Latest locally verified result:** 3 resources valid, 0 invalid.

## GitHub Actions Results

The successful GitHub Actions run below confirms that all five workflow jobs completed successfully.

- **Workflow run:** #6
- **Commit:** `4395a52`
- **Branch:** `main`
- **Status:** Success
- **Duration:** 1 minute 23 seconds

The successful jobs were:

1. Test Application
2. SAST Security Scan
3. Dependency Security
4. Build and Scan Docker Image
5. Validate Kubernetes

View the [GitHub Actions workflow runs](https://github.com/bukummy8/secureflow-devsecops/actions).

## Docker

Build the application image from the repository root:

```bash
docker build -t secureflow-api:1.2 .
```

Run the container:

```bash
docker run -d \
  --name secureflow-api-test \
  -p 3000:3000 \
  secureflow-api:1.2
```

Test the API:

```bash
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api
```

To stop and remove the test container:

```bash
docker rm -f secureflow-api-test
```

## Local K3s Deployment

SecureFlow has been deployed to a local K3s cluster using the `secureflow-api:1.2` image.

The deployment configuration includes:

- Two application replicas.
- Readiness and liveness HTTP probes.
- CPU and memory requests and limits.
- A Kubernetes Service of type `NodePort`.
- A locally imported container image with `imagePullPolicy: Never`.

### 1. Import the Docker image into K3s

K3s uses containerd, so a locally built Docker image must be imported into its image store.

```bash
docker save secureflow-api:1.2 | sudo k3s ctr images import -
```

### 2. Apply the Kubernetes manifests

```bash
sudo k3s kubectl apply -f kubernetes/namespace.yaml
sudo k3s kubectl apply -f kubernetes/deployment.yaml
sudo k3s kubectl apply -f kubernetes/service.yaml
```

### 3. Verify the deployment

```bash
sudo k3s kubectl rollout status deployment/secureflow-api \
  -n secureflow --timeout=120s

sudo k3s kubectl get pods,svc -n secureflow
```

### 4. Test through Kubernetes networking

Start port forwarding:

```bash
sudo k3s kubectl port-forward \
  -n secureflow svc/secureflow-api 3001:3000
```

Keep the command running and use another terminal:

```bash
curl http://127.0.0.1:3001/
curl http://127.0.0.1:3001/health
curl http://127.0.0.1:3001/api
```

**Verified deployment result:** the rollout completed successfully, both application pods were running, and all three endpoints returned their expected JSON responses through Kubernetes port forwarding.

## Project Structure

```text
secureflow-devsecops/
├── .github/
│   └── workflows/
│       └── devsecops.yml
├── app/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── server.test.js
├── kubernetes/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   └── service.yaml
├── security/
│   └── semgrep.yml
├── Dockerfile
└── README.md
```

## Security and Operational Scope

SecureFlow demonstrates selected DevSecOps controls rather than a complete security assurance process.

The current workflow includes automated tests, configured Semgrep rules, production dependency auditing, Docker image vulnerability scanning, and Kubernetes schema validation.

The Semgrep rules cover specific code patterns, not every possible vulnerability. The dependency audit covers the dependency scope specified by the command. The recorded Trivy scan covers OS and library vulnerabilities at the configured severities; it does not establish that every type of security issue, such as exposed secrets or runtime threats, has been eliminated.

The local K3s deployment and the GitHub Actions workflow are separate execution environments. The workflow validates and scans a Docker image, while the local K3s cluster runs the locally imported `secureflow-api:1.2` image.

## Future Improvements

Potential extensions include:

- Add API integration tests for invalid requests and error handling.
- Add dedicated container secret scanning.
- Add image signing and software bill of materials (SBOM) generation.
- Publish versioned images to a container registry.
- Deploy to a remote Kubernetes environment.
- Add deployment smoke tests and runtime monitoring.
- Introduce automated deployment and rollback stages.

## Author and Project

SecureFlow is a practical DevSecOps portfolio project demonstrating application testing, container security, Kubernetes operations, and CI automation.

**Organization:** NISA Technology

**Repository:** https://github.com/bukummy8/secureflow-devsecops

**Website:** https://nisa-technology.vercel.app/
