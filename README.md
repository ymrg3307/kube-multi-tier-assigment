# Multi-Tier Kubernetes Demo

This repository contains a simple Node.js + MySQL application, fully containerised and deployable on Kubernetes.

## Repository

<https://github.com/ymrg3307/kube-multi-tier-assigment>

## Docker images

<https://hub.docker.com/r/maniratnagupta/api-demo>


## Deployed API endpoint

Once the `ingress.yaml` load-balancer is ready, records can be retrieved at:

```text
http://34.54.52.41/records or curl http://34.54.52.41/records | jq in command line
```
