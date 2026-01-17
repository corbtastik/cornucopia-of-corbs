---
title: "VMs on macOS (Apple Silicon) with Lima 🦙"
date: 2026-01-16
tags: ["apple-silicon", "virtualization", "vm", "lima", "ubuntu", "mongodb"]
description: "A repeatable, CLI-first way to boot an Ubuntu ARM64 VM on Apple Virtualization.framework (via Lima), attach a persistent data disk, and install MongoDB Community with auth/users."
---

## VMs with Lima (Apple Virtualization.framework) 🦙🍏

This post is **Part 1** of my VM series. The goal is simple:

> Code on GitHub: [https://github.com/corbtastik/vm-bakeoff](https://github.com/corbtastik/vm-bakeoff)

✅ Boot an **Ubuntu ARM64 VM** on Apple Silicon using **[Lima](https://lima-vm.io/)**  
✅ Use **[Apple’s Virtualization.framework](https://developer.apple.com/documentation/virtualization)** (native, not emulation)  
✅ Attach a **separate persistent disk** for MongoDB (clear persistence story)  
✅ Install **[MongoDB Community](https://www.mongodb.com/docs/manual/administration/install-on-linux/)**, enable auth, create users, and store data on the attached disk  
✅ Make it repeatable with `make` + scripts (same “shape” across platforms)

---

## 0) What you’ll build 🧱

- An **[Ubuntu Server ARM64](https://ubuntu.com/download/server/arm)** VM running via Lima (`vmType: vz`)
- A persistent data disk mounted at **`/data`**
- MongoDB Community installed via apt repo (MongoDB 8.0 line)
- MongoDB configured to store data at **`/data/mongodb`**
- Auth enabled + 2 users created:
  - `dbAdmin` (root role)
  - `dbUser` (readWrite + dbAdmin on the `todo` DB)
- A root-only secrets file: **`/etc/todo-secrets.env`**
- Convenience aliases available in new shells:
  - `mdb_admin`
  - `mdb_user`

---

## ✅ Why pick Lima?

- **CLI-first** (exactly what we want for a reproducible automation) ⌨️
- Uses **Virtualization.framework** on Apple Silicon (`vmType: vz`) 🍏⚡
- Easy YAML-driven VM config + port forwards 🧩
- Great for automation comparisons (same workflow per platform) 🧪

⚠️ Gotchas:
- Lima’s CLI output varies a bit by version (we avoid `--format` for portability)
- `vmType` is “birth-time” — changing it later usually means recreating the VM 🔁

---

## 1) Repo layout 🗂️

This series repo is structured so each platform can plug into the same `make` targets:

- `drivers/`
  - `lima.sh` — platform driver (create/start/stop/destroy/run/provision helper)
- `platforms/lima/`
  - `lima.yaml` — generated pinned VM config
- `scripts/`
  - `lima-pin-ubuntu.sh` — generates `platforms/lima/lima.yaml` deterministically
  - `up.sh`, `down.sh`, `destroy.sh`, `ssh.sh`, `status.sh`, `endpoints.sh`
  - `provision.sh` — runs guest provisioning script
  - `guest/provision.sh` — runs *inside the VM* (MongoDB install + config + users)

---

## 2) Prereqs (host) 🧰

### Install Lima
Recommended: **Homebrew** 🍺

```bash
brew install lima
limactl --version
```

### Optional but handy
- **[HTTPie](https://httpie.io/)**
- `git`

---

## 3) Deterministic Ubuntu image pinning 🔒

We generate a Lima YAML that pins:
- the Ubuntu cloud image URL
- the SHA256 digest

That means: **reproducible builds** even if defaults change later.

### Generate `platforms/lima/lima.yaml`

```bash
make ubuntu-pin
```

(Behind the scenes that calls `./scripts/lima-pin-ubuntu.sh`.)

### What the generated YAML looks like (example)
Your generated file pins Ubuntu 24.04 ARM64 and uses `vmType: "vz"`:

```bash
cat platforms/lima/lima.yaml
```

Expected shape:

```bash
vmType: "vz"
cpus: 4
memory: "6GiB"
disk: "20GiB"
images:
  - location: "https://cloud-images.ubuntu.com/releases/noble/release-<BUILD>/ubuntu-24.04-server-cloudimg-arm64.img"
    arch: "aarch64"
    digest: "sha256:<SHA>"
portForwards:
  - guestPort: 80
    hostPort: 8080
  - guestPort: 3000
    hostPort: 8081
```

> 🎯 Note: We don’t forward guest `22` because Lima manages SSH access internally and some versions reject forwarding `22` explicitly.

---

## 4) Data disk strategy (MongoDB lives on `/data`) 💾

We create a named Lima disk on the host:

- Disk name: `ubuntu-todo-data-lima`
- Disk size: `20GiB`

Your `drivers/lima.sh` ensures the disk exists before bringing the VM up.

### Key part of `drivers/lima.sh` (disk + up)

```bash
ensure_data_disk() {
  : "${DATA_DISK_NAME:=ubuntu-todo-data-${PLATFORM}}"
  : "${DATA_DISK_SIZE:=20GiB}"

  if limactl disk list 2>/dev/null | awk 'NR>1 {print $1}' | grep -qx "${DATA_DISK_NAME}"; then
    echo "✅ Data disk exists: ${DATA_DISK_NAME}"
  else
    echo "💾 Creating data disk: ${DATA_DISK_NAME} (${DATA_DISK_SIZE})"
    limactl disk create "${DATA_DISK_NAME}" --size "${DATA_DISK_SIZE}"
  fi
}

up() {
  require
  ensure_data_disk

  if [[ ! -f "${LIMA_YAML}" ]]; then
    echo "🧩 Missing ${LIMA_YAML} — generating via ./scripts/lima-pin-ubuntu.sh"
    ./scripts/lima-pin-ubuntu.sh
  fi

  if exists; then
    echo "▶️  Starting VM: ${VM_NAME}"
    limactl start --tty=false "${VM_NAME}"
  else
    echo "🚀 Creating VM (VZ): ${VM_NAME}"
    limactl start --name="${VM_NAME}" --tty=false "${LIMA_YAML}"
  fi
}
```

Inside the VM, Lima mounts the attached disk here:

- `/mnt/lima-ubuntu-todo-data-lima`

Then guest provisioning bind-mounts it to:

- `/data`

✅ MongoDB stores data under `/data/mongodb`

---

## 5) Bring the VM up 🚀

### Start VM

```bash
make up PLATFORM=lima
```

### Check status

```bash
make status PLATFORM=lima
```

### Shell into the VM

```bash
make ssh PLATFORM=lima
```

Quick sanity inside the VM:

```bash
uname -m
ls -la /mnt | grep lima-
```

You should see:
- `aarch64`
- the disk mount like `/mnt/lima-ubuntu-todo-data-lima`

---

## 6) Provision MongoDB Community + users + auth 🔐🍃

This runs the guest script inside the VM:

```bash
make provision PLATFORM=lima
```

What provisioning does (high level):

1) Ensures the disk is reachable in the guest (`/mnt/lima-ubuntu-todo-data-lima`)  
2) Creates `/data` and bind-mounts the disk there (and persists it in `/etc/fstab`)  
3) Installs MongoDB Community from MongoDB’s apt repo  
4) Updates `/etc/mongod.conf`:
   - `storage.dbPath: /data/mongodb`
   - log path under `/data`
   - `bindIp: 127.0.0.1` (MongoDB is not exposed externally)
5) Creates `/etc/todo-secrets.env` (root-only)
6) Reconciles users deterministically (safe on reruns):
   - temporarily disables auth
   - creates/updates `dbAdmin` (root)
   - enables auth
   - creates/updates `dbUser` on DB `todo`
7) Verifies auth by running a ping using `MONGODB_URI`
8) Installs shell aliases in `/etc/profile.d/mongo-aliases.sh`

---

## 7) How to verify it worked ✅

### A) Confirm MongoDB is using `/data/mongodb`

Inside the VM:

```bash
sudo ls -la /data
sudo ls -la /data/mongodb
sudo systemctl status mongod --no-pager
```

### B) Check the secrets file exists

```bash
sudo ls -la /etc/todo-secrets.env
sudo cat /etc/todo-secrets.env
```

You should see values for:
- `DB_ADMIN_USER`, `DB_ADMIN_PASS`
- `DB_USER`, `DB_USER_PASS`
- `MONGODB_URI`

### C) Auth as dbUser (app user)

After provisioning, open a new shell (or source the aliases):

```bash
source /etc/profile.d/mongo-aliases.sh
mdb_user
```

In mongosh, confirm:

```bash
db.runCommand({ connectionStatus: 1 })
db.getSiblingDB("todo").getName()
```

### D) Auth as dbAdmin (root)

```bash
source /etc/profile.d/mongo-aliases.sh
mdb_admin
```

Then confirm privileges:

```bash
use admin
db.runCommand({ connectionStatus: 1 })
db.getUsers()
```

> If `mdb_user` and `mdb_admin` both work, auth is on and the users are real. 🎉

---

## 8) Useful host commands 🕹️

```bash
make endpoints PLATFORM=lima
make ssh PLATFORM=lima
make down PLATFORM=lima
make up PLATFORM=lima
make destroy PLATFORM=lima
```

---

## 9) Teardown (clean exit) 🧹

Stop the VM:

```bash
make down PLATFORM=lima
```

Delete the VM:

```bash
make destroy PLATFORM=lima
```

> Note: We intentionally keep the data disk as a persistence artifact unless we explicitly delete it (that’s the point of the demo). 😄

---

## Acceptance checklist ✅

- [✅] VM boots Ubuntu **ARM64** (`uname -m` → `aarch64`)
- [✅] VM is created with `vmType: "vz"` (Apple Virtualization.framework)
- [✅] Data disk exists on host (`limactl disk list`)
- [✅] Disk is mounted and bound to `/data` inside guest
- [✅] MongoDB data lives on `/data/mongodb`
- [✅] Auth is enabled
- [✅] `mdb_user` works
- [✅] `mdb_admin` works
- [✅] Rerunning `make provision PLATFORM=lima` is safe (idempotent-ish)

---

That’s it for lima! ✅  
