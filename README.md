# SecureFlow DevSecOps

SecureFlow is a DevSecOps demonstration project that shows how a Node.js microservice can be securely built, tested, containerized, scanned, and deployed to a lightweight Kubernetes cluster.

The project combines application development, container security, Kubernetes, automated testing, static analysis, dependency scanning, container vulnerability scanning, and Kubernetes manifest validation into one CI pipeline.

---

## Problem Statement

Building and deploying microservices is easy to start but difficult to secure consistently.

SecureFlow demonstrates a simple solution by integrating security checks directly into the software delivery process.

Every change pushed to the `main` branch automatically passes through:

- Application testing
- Static Application Security Testing (SAST)
- Dependency vulnerability scanning
- Docker image building
- Container vulnerability scanning
- Kubernetes manifest validation

---

## Project Objectives

The objectives of SecureFlow are to:

- Build a working Node.js REST API
- Containerize the application with Docker
- Deploy the application to K3s Kubernetes
- Run multiple application replicas
- Implement Kubernetes health probes
- Scan application source code for security issues
- Scan application dependencies for vulnerabilities
- Scan the container image for vulnerabilities
- Validate Kubernetes manifests automatically
- Create a repeatable GitHub Actions DevSecOps pipeline

---

## Architecture

```text
                    Developer
                       |
                       | git push
                       v
                  GitHub Repository
                       |
                       v
                GitHub Actions CI
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
     npm test       Semgrep       npm audit
        |              |              |
        +--------------+--------------+
                       |
                       v
                 Docker Build
                       |
                       v
                  Trivy Scan
                       |
                       v
             Kubernetes Validation
                  kubeconform
                       |
                       v
                    SUCCESS
                       
                       
              Local Deployment
                       |
                       v
                     K3s
                       |
              +--------+--------+
              |                 |
              v                 v
           Pod 1             Pod 2
              |                 |
              +--------+--------+
                       |
                       v
                 SecureFlow API
                       |
                       v
                NodePort :30368
                | Technology     | Purpose                           |
| -------------- | --------------------------------- |
| Node.js        | Application runtime               |
| Express.js     | REST API framework                |
| npm            | Dependency management             |
| Docker         | Containerization                  |
| K3s            | Lightweight Kubernetes            |
| kubectl        | Kubernetes management             |
| Git            | Version control                   |
| GitHub         | Source code hosting               |
| GitHub Actions | CI pipeline                       |
| Semgrep        | Static security analysis          |
| npm audit      | Dependency vulnerability scanning |
| Trivy          | Container vulnerability scanning  |
| kubeconform    | Kubernetes manifest validation    |
