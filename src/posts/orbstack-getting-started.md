---
title: "Getting Started with OrbStack on macOS"
date: 2025-12-28
tags: ["macos", "devops", "docker", "kubernetes", "orbstack"]
description: "A fast, lightweight guide to replacing Docker Desktop with OrbStack for containers, Linux VMs, and Kubernetes."
toc_side: left
---

For years, Docker Desktop was the de facto standard for containerization on macOS. However, it often came with a heavy cost: battery drain, loud fans, and slow filesystem performance.

Enter **OrbStack**. It is a native macOS application that is significantly lighter, faster, and integrates seamlessly with the OS. It’s not just a Docker replacement; it’s an all-in-one platform for Linux machines and Kubernetes clusters.

This guide focuses on using the `orb` CLI to manage your environment efficiently.

## 1. Installation

The most efficient way to install OrbStack is via Homebrew. Open your terminal and run:

```bash
brew install orbstack
```

On first launch, OrbStack will configure itself. It automatically installs the orb, docker, and kubectl command-line tools for you.

## 2. Running a Linux Virtual Machine

This is where the orb CLI shines. Unlike managing containers, OrbStack manages Linux Virtual Machines directly via its own command structure.

### Create a Machine

To spin up an Ubuntu instance (the default), use the orb create command:

```bash
# Syntax: orb create [distro] [name]
orb create ubuntu sandbox
```

### Access the Machine

You don't need ssh keys or complex configs. The orb CLI handles authentication automatically:

```bash
# Log into the default user
orb -m sandbox
```

## 3. Running a Container


**Note**: The orb CLI manages the engine, but you still use the standard docker CLI to run containers. OrbStack provides a drop-in replacement for the Docker engine, so all your existing commands work natively.

### Run a Web Server

Let's run a simple Nginx container.

```bash
docker run -d --name my-web nginx
```

### Magic Domains

This is OrbStack's "killer feature." Instead of fumbling with localhost:8080, OrbStack automatically assigns a domain to your running containers based on the container name.

Open your browser and visit: [http://my-web.orb.local](http://my-web.orb.local)

It resolves instantly to your container. No port conflicts, no `localhost` confusion.

## 4. Running a Kubernetes Cluster

You can use the orb CLI to enable and manage the cluster status, though you will still use `kubectl` to deploy applications.

### Enable Kubernetes via CLI

By default, K8s is off to save resources. You can turn it on directly from your terminal:

```bash
# Enable and start the Kubernetes cluster
orb start k8s
```

**Note**: It may take a few moments for the cluster to spin up.

### Deploy a Pod

Once the cluster is running, OrbStack automatically configures your context.

```bash
# Create a pod
kubectl run k8s-demo --image=nginx

# Wait for it to start
kubectl get pods -w
```

### Exposing Services

If you create a Service of type `LoadBalancer`, OrbStack will assign it a reachable IP address accessible from your Mac immediately.

```bash
# Expose the pod
kubectl expose pod k8s-demo --type=LoadBalancer --port=80

# Get the External IP
kubectl get svc k8s-demo
```

## 5. Cleanup

Finished exploring? Because OrbStack is so fast, it is easy to spin resources up and down as needed. Here is how to remove everything we created to free up system resources.

### Remove the Linux VM

```bash
orb delete sandbox
```

### Remove the Container

```bash
docker rm -f my-web
```

### Disable the Kubernetes Cluster

```bash
orb stop k8s
orb config set k8s.enabled false
```

## Summary

You have successfully replaced a heavy virtualization stack with a single, native app.

* Infrastructure Management: Use orb (e.g., orb create, orb restart, orb list).
* Container Workloads: Use docker (standard CLI).
* Cluster Workloads: Use kubectl (standard CLI).



