---
title: "OrbStack and MongoDB"
date: 2025-12-28
tags: ["tutorial", "orbstack", "mongodb", "docker", "database"]
description: "How to run a secure, persistent MongoDB Community instance on using OrbStack."
---

In [Part 1](/posts/getting-started-with-orbstack-on-macos/), we covered how to get OrbStack up and running with ephemeral containers. Now, let's build something you can actually use for development: a persistent **MongoDB** database.

By default, Docker containers lose their data when you remove them. For a database, that is obviously a problem. Furthermore, the default MongoDB container leaves the door wide open with no password.

In this guide, we will:
1.  Set up **local persistent storage** so your data survives container restarts.
2.  Run the **latest MongoDB Community** container.
3.  **Secure the instance** by creating an Admin user and a dedicated Application user.

---

## 1. Prepare Local Storage

OrbStack maps your Mac's file system into containers incredibly fast. We will create a folder on your Mac to hold the database files.

Open your terminal and run:

```bash
# Create a directory for your data
mkdir -p ~/orbstack-data/mongo

# Navigate to it to verify
cd ~/orbstack-data/mongo
pwd
```

> Make a note of this path. OrbStack will write the database files here.

## 2. Run the Secure Container

We will use the official `mongodb/mongodb-community-server` image. To secure it immediately upon creation, we pass environment variables that initialize a root user.

Run the following command (you can copy/paste this whole block):

```bash
docker run -d \
  --name orb-mongo \
  -p 27017:27017 \
  -v ~/orbstack-data/mongo:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=securepass123 \
  mongodb/mongodb-community-server:latest
```

### Breakdown of flags:

* `-v ~/orbstack-data/mongo:/data/db`: Maps the folder we just created to MongoDB's internal data directory.
* `-e MONGO_INITDB_ROOT...`: These variables trigger the container to start with access control enabled and create a "Root" user in the admin database.
* `mongodb/mongodb-community-server:latest`: Pulls the absolute latest version of the Community Edition.

Verify it is running:

```bash
docker ps
```

## 3. Create a Database and App User

Now that we have a secure admin account, we should not use it for our actual application. Best practice is to create a specific user with limited privileges for your specific database.

We will use `docker exec` to jump inside the running container and use the `mongosh` CLI tool.

### A. Connect as Admin

Log in to the database using the credentials we set in step 2:

```bash
docker exec -it orb-mongo mongosh -u admin -p securepass123
```

You should see the `test>` prompt.

### B. Create the Database and User

Copy and run the following script inside the `mongosh` prompt. This will create a database named `my_app` and a user named `app_user` who has permission to read and write **only** to that database.

```javascript
// Switch to (or create) the new database
use my_app

// Create the restricted user
db.createUser({
  user: "app_user",
  pwd: "app_password_456",
  roles: [
    { role: "readWrite", db: "my_app" }
  ]
})
```

If successful, you will see `{ ok: 1 }`. Type `exit` to leave the shell.

## 4. Verify Persistence

Let's prove that our data is safe.

1. Kill the container:

```bash
docker rm -f orb-mongo
```

2. Check your Mac folder:

Look at `~/orbstack-data/mongo`. You will see a bunch of files (WiredTiger, `collection-*.wt`). These are your database files.

3. Spin it up again:

Run the exact same `docker run` command from Step 2.

4. Test the User:

Try logging in with the new user we created.

```bash
docker exec -it orb-mongo mongosh "mongodb://app_user:app_password_456@localhost:27017/my_app"
```

If you get in, congratulations! You have a persistent, password-protected MongoDB database running on your Mac via OrbStack.

### Connection String for your App

When connecting your Node.js, Python, or Go app to this database, use this URI:

`mongodb://app_user:app_password_456@localhost:27017/my_app?authSource=my_app`





