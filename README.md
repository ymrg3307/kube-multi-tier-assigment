# Multi-Tier Kubernetes Demo

This repository contains a simple Node.js + MySQL application, fully containerised and deployable on Kubernetes.

## Repository

<https://github.com/ymrg3307/kube-multi-tier-assigment>

## Docker image

<https://hub.docker.com/r/maniratnagupta/api-demo>


## 🚀 Step-by-Step Deployment Guide

> This guide shows how I built and deployed the Node.js + MySQL app on Google Kubernetes Engine (GKE). 

---

### 0. Prerequisites

| Tool | Version tested |
|------|----------------|
| Docker | 25.x (CLI only) |
| kubectl | v1.30 |
| gcloud | 473+ |
| Git | any |

Commands assume macOS / Linux shell. Windows users can run them in WSL.

---

### 1. Clone the repo
```bash
git clone https://github.com/ymrg3307/kube-multi-tier-assigment.git
cd kube-multi-tier-assigment
```
---

### 2. Build & push the API image

```bash
# Build
cd api
DOCKER_USER=maniratnagupta
IMAGE=api-demo
TAG=v1

docker build -t $DOCKER_USER/$IMAGE:$TAG .
# Test locally (optional)
docker run -p 3000:3000 -e DB_HOST=localhost $DOCKER_USER/$IMAGE:$TAG
# Push to Docker Hub
docker push $DOCKER_USER/$IMAGE:$TAG
cd ..
```
---

### 3. Create a GKE cluster

```bash
PROJECT=<your project id>
gcloud config set project $PROJECT
gcloud container clusters create demo-cluster \
  --zone $ZONE \
  --num-nodes 3 \
  --disk-type pd-standard \
  --disk-size 50GB \
  --machine-type e2-medium \
  --enable-ip-alias
```
---

### 4. Get cluster credentials

```bash
gcloud container clusters get-credentials demo-cluster --zone us-central1-a
kubectl get nodes
```
---

### 4. Deploy the manifests

```bash
kubectl create namespace demo
kubectl -n demo apply -f k8s/
```

To check the status
```bash
kubectl -n demo get pods -w
```

*What happens*
1. PersistentVolumeClaim is provisioned.
2. MySQL Deployment starts and initialises the DB (schema + seed data).
3. API Deployment spins up 4 pods.
4. Ingress obtains an external IP.

---

## Verify the application

### 1. Fetch Data

```bash
# Get external IP
kubectl -n demo get ingress
curl http://<IP_ADDRESS_FROM_ABOVE_COMMAND>/records | jq
```
---

### 2. Demonstrate self-healing

```bash
#Fetch POD details
kubectl -n demo get pods

# Delete one API pod
kubectl -n demo delete pod <ANY_API_POD_FROM_ABOVE>
# Watch it get recreated
kubectl -n demo get pods
```
---

### 3. Test data persistence

```bash
# Delete the MySQL pod
kubectl -n demo delete pod <DB_POD_FROM_ABOVE>
# Wait until it restarts, then:
curl http://<INGRESS_IP_ADDRESS>/records | jq
```
---

### 5. Clean-up

```bash
kubectl delete -f k8s/
gcloud container clusters delete demo-cluster --zone us-central1-a
```
---

### Appendix: Directory Layout

```
├── api/               # Node.js code + Dockerfile
├── db/                # SQL schema & seed scripts
├── k8s/               # Kubernetes manifests
└── README.md          # (this file)
```
---
