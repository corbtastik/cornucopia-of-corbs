---
title: "MongoDB EA on OrbStack"
date: 2026-01-06
tags: ["tutorial", "orbstack", "mongodb", "mongodb-enterprise", "docker", "database"]
description: "How to run a secure, persistent MongoDB EA instance using OrbStack."
---

# MongoDB Enterprise on OrbStack

This walkthrough stands up a **MongoDB Enterprise Advanced** container on OrbStack (Docker-compatible) with several key features:

*   **Persistent data** using a named Docker volume (`mongodb_ea_data`).
*   **A single-node replica set (`rs0`)**, allowing you to demo:
    *   Transactions
    *   Change streams
    *   "Real-world" replica-set behaviors
*   **A root admin account**.
*   **Two scoped accounts for demos:**
    *   `dbAdmin` (DB admin + readWrite on the demo DB)
    *   `dbUser` (readWrite on the demo DB)
*   **A seeded demo dataset (`demo_gadgets`)** with indexes.

By the end, you’ll have two scripts:
1.  `mongodb_ea_run.sh` > Starts MongoDB Enterprise (idempotent).
2.  `mongodb_ea_setup.sh` > Initializes RS + users + demo data (idempotent).

---

## Files in this repo

You will need the following files in your working directory.

### [GitHub Repo](https://github.com/corbtastik/mongodb-ea-orb)

```
git clone https://github.com/corbtastik/mongodb-ea-orb
cd mongodb-ea-orb
```

### `.env`
You will need to manually create a .env file with your credentials and DB names.

> Note: the .gitignore blocks the .env file from being committed to git.

```bash
# Root (server-wide) admin
MONGO_ROOT_USER=rootAdmin
MONGO_ROOT_PWD=rootAdminIScool123!

# Demo DB
DEMO_DB=demo_gadgets

# Database admin (scoped to DEMO_DB)
DEMO_DBADMIN_USER=dbAdmin
DEMO_DBADMIN_PWD=dbAdminIScool123!

# Data power user (scoped to DEMO_DB)
DEMO_POWER_USER=dbUser
DEMO_POWER_PWD=dbUserIScool123!
```

### `mongodb_ea_run.sh`
Starts MongoDB Enterprise with volumes, keyfile, and replica set flags.

```bash
#!/bin/bash
docker rm -f mongodb-ea 2>/dev/null || true

set -a; source .env; set +a

docker run -d \
  --name mongodb-ea \
  --restart unless-stopped \
  -p 27017:27017 \
  -v mongodb_ea_data:/data/db \
  -v mongodb_ea_keyfile:/keyfile:ro \
  -e MONGODB_INITDB_ROOT_USERNAME="$MONGO_ROOT_USER" \
  -e MONGODB_INITDB_ROOT_PASSWORD="$MONGO_ROOT_PWD" \
  mongodb/mongodb-enterprise-server:8.0-ubi9 \
  mongod --replSet rs0 --bind_ip 0.0.0.0 --keyFile /keyfile/mongodb-keyfile
```

### `mongodb_ea_setup.sh`
*Note: Ensure you have this script ready. It should initialize the replica set, create the users defined in `.env`, and seed your data.*

---

## Step 1: Create the named Docker volumes

Run these commands once. If they already exist, Docker will just report that they are present.

```bash
docker volume create mongodb_ea_data
docker volume create mongodb_ea_keyfile
```

## Step 2: Generate the MongoDB replica-set keyfile

Once you combine **(1) replica sets** with **(2) authentication**, MongoDB needs a way for *nodes to trust each other*.

> Thus: We need to generate a keyfile inside the named volume using Alpine Linux (even for a 1-node replica set).

### Why we need a replica-set keyfile

MongoDB has two different kinds of authentication happening in a replica set:

1. **Client authentication** (you > MongoDB)
   This is the normal username/password login (`rootAdmin`, `dbAdmin`, `dbUser`).

2. **Internal authentication** (MongoDB node > MongoDB node)
   Replica set members need to securely talk to each other to replicate data, coordinate elections, and validate operations.

When you enable a replica set (`--replSet rs0`) **and** enable authentication (by creating users / using root credentials), MongoDB requires **internal authentication** to be configured too. The simplest way to do that is a shared **keyfile** (`--keyFile ...`), which acts like a **shared secret** that replica set members use to authenticate to each other.

Even with a **single-node replica set**, MongoDB still runs in “replica set mode” and expects the internal auth mechanism to be present—otherwise it refuses to start and you’ll see:

`BadValue: security.keyFile is required when authorization is enabled with replica sets`

So the keyfile isn’t about letting *you* connect—it’s about letting the replica set’s internals operate securely once auth is on. We store it in a **named Docker volume** so it persists across container restarts and rebuilds, just like the database files.

---

### 2A) Write a secure random keyfile
We use Alpine because it’s small, predictable, and allows us to install `openssl` on the fly. We use `umask 177` and `chmod 600` because MongoDB requires the keyfile to **not** be world-readable.

```bash
docker run --rm --user 0:0 \
  -v mongodb_ea_keyfile:/keyfile \
  alpine:3.20 \
  sh -lc '
    set -e
    apk add --no-cache openssl >/dev/null
    umask 177
    openssl rand -base64 756 > /keyfile/mongodb-keyfile
    chmod 600 /keyfile/mongodb-keyfile
    ls -l /keyfile/mongodb-keyfile
  '
```

### 2B) Ensure MongoDB can read the keyfile
Some MongoDB container images run as a non-root user. If the keyfile is owned by root with `600` permissions, MongoDB might not be able to read it.

We need to detect the user ID used by the MongoDB image and `chown` the keyfile inside the volume.

```bash
MONGO_UID=$(docker run --rm mongodb/mongodb-enterprise-server:8.0-ubi9 bash -lc 'id -u mongodb 2>/dev/null || id -u')
MONGO_GID=$(docker run --rm mongodb/mongodb-enterprise-server:8.0-ubi9 bash -lc 'id -g mongodb 2>/dev/null || id -g')
echo "Mongo UID:GID = $MONGO_UID:$MONGO_GID"

docker run --rm --user 0:0 \
  -v mongodb_ea_keyfile:/keyfile \
  alpine:3.20 \
  sh -lc "chown $MONGO_UID:$MONGO_GID /keyfile/mongodb-keyfile && chmod 600 /keyfile/mongodb-keyfile && ls -l /keyfile/mongodb-keyfile"
```

## Step 3: Start MongoDB Enterprise

Make your scripts executable:

```bash
chmod +x mongodb_ea_run.sh mongodb_ea_setup.sh
```

Run the container:

```bash
./mongodb_ea_run.sh
```

Check the status to ensure it is **Up** and not restarting:

```bash
docker ps | grep mongodb-ea
docker logs --tail 80 mongodb-ea
```

## Step 4: Run the one-time setup

Initialize the replica set, users, and seed data:

```bash
./mongodb_ea_setup.sh
```

*This script is designed to be idempotent:*
*   If the RS is already initialized, it prints a message and moves on.
*   If users exist, it skips creating them.
*   If data exists, it skips reseeding.

## Step 5: Connect and verify

You can copy and paste these commands to verify your connections. First, load your environment variables:

```bash
set -a; source .env; set +a
```

### Root admin
```bash
mongosh "mongodb://localhost:27017/?replicaSet=rs0" \
  -u "$MONGO_ROOT_USER" -p "$MONGO_ROOT_PWD" \
  --authenticationDatabase admin
```

### DB admin (scoped to demo DB)
```bash
mongosh "mongodb://localhost:27017/$DEMO_DB?replicaSet=rs0&authSource=admin" \
  -u "$DEMO_DBADMIN_USER" -p "$DEMO_DBADMIN_PWD"
```

### Power user (readWrite on demo DB)
```bash
mongosh "mongodb://localhost:27017/$DEMO_DB?replicaSet=rs0&authSource=admin" \
  -u "$DEMO_POWER_USER" -p "$DEMO_POWER_PWD"
```

### Quick checks inside `mongosh`
```javascript
db.products.countDocuments()
db.orders.countDocuments()
db.products.findOne()
```

## Step 6: Prove persistence

To verify the data survives a container restart:

```bash
docker restart mongodb-ea
```

Reconnect and check the counts:
```javascript
db.products.countDocuments()
```

> Because your data lives in the named volume `mongodb_ea_data`, it survives restarts and container recreation.

---

## Common pitfalls + what to do

### 1) Container keeps restarting
This almost always means:
*   Missing keyfile volume.
*   Wrong permissions on the keyfile.
*   Started `replSet` + `auth` without `--keyFile`.

Check logs:
```bash
docker logs --tail 120 mongodb-ea
```

If you see `BadValue: security.keyFile is required...`, re-run **Step 2**.

### 2) Can’t connect from host
We solved this in the run script with `--bind_ip 0.0.0.0`. If you bind only to `127.0.0.1` inside the container, host connections can fail depending on Docker/OrbStack networking.

---

## Reset / rebuild commands

### Keep data (recreate container only)
```bash
docker rm -f mongodb-ea
./mongodb_ea_run.sh
```

### Wipe everything (data + keyfile) and start fresh
```bash
docker rm -f mongodb-ea
docker volume rm mongodb_ea_data mongodb_ea_keyfile

docker volume create mongodb_ea_data
docker volume create mongodb_ea_keyfile

# You must re-run keyfile generation (Step 2)
# Then run ./mongodb_ea_run.sh and ./mongodb_ea_setup.sh
```

## Pro Tip: Multi-line pastes in `mongosh`

If you paste multi-line code into `mongosh` (like a large `insertOne` command), the prompt may switch to a continuation prompt (`|`) and appear to "hang" due to terminal line editing.

**The Fix:** Use `.editor`.

Inside `mongosh`, type:

```text
.editor
```

Then paste your multi-line command. When you are done:
*   **Ctrl+D** to execute.
*   **Ctrl+C** to cancel.