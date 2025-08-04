# Assignment DOC

This file explains what I built as part of the kubernetes assignment.

### Quick links

* Code repo: <https://github.com/ymrg3307/kube-multi-tier-assigment>
* Docker Hub image: <https://hub.docker.com/r/maniratnagupta/api-demo>
* API endpoint used: <http://34.54.52.41/records>

## 1. Requirements Understanding

"To design, containerize, and deploy a multi-tier architecture on Kubernetes involving
one microservice and one database."

Build a tiny system with two parts:

1. **Micro Service** – a small Node.js program that shows a list of records.
2. **Database** – MySQL where those records live.

The rules given in the assignment:

* The API should talk to the DB and be reachable from the internet.
* The DB must keep its data even if the pod restarts.
* Settings (host, user, password) have to come from ConfigMap / Secret, **not** hard-coded.
* Run 4 API pods and 1 DB pod.
* Use Kubernetes Ingress for the outside world.

---

## 2. Assumptions

* This is just a demo, so low traffic. No fancy autoscaling.
* I’m using Google Kubernetes Engine (GKE) because I have a free tier.
* I pushed the Docker image to Docker Hub to keep things simple.
* Security add-ons (TLS, NetworkPolicies) are skipped for now.

---

## 3. How the solution works

| Part | What it is | How I run it |
|------|------------|--------------|
| API  | Node.js + Express | `Deployment` with 4 replicas ➜ `Service` ➜ `Ingress` |
| DB   | MySQL 8.3 | `Deployment` with 1 replica ➜ `Service` ➜ **PVC** for storage |
| Config | DB host, user, name | `ConfigMap` |
| Secret | DB password | `Secret` |

Flow:

1. `kubectl apply -f k8s/` creates everything.
2. MySQL pod starts first, sets up table + demo data.
3. Four API pods start and connect to the DB using the info from ConfigMap/Secret.
4. Ingress gets an external IP (for me it was `34.54.52.41`). Browsing `/records` shows the data.
5. If I delete an API pod, Deployment makes a new one. If I delete the DB pod, it also comes back **with the same data** because of the PVC.

---

## 4. Why I chose these settings

* **4 API pods** – enough to see rolling updates in action but still lightweight.
* **1 DB pod + PVC** – simple and meets the “keep data” rule.
* **Small node size (e2-medium)** – fits free GCP quota.
* **50 GB standard disk** – cheap and plenty for a demo.