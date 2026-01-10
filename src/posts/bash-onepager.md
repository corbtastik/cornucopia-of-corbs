---
title: "Bash One Pager"
date: 2025-12-27
tags: ["tutorial", "bash", "linux"]
description: "A little ditty about bash"
---

This is a one-page reference for the top Bash commands and tricks. It covers everything from basic file operations to intermediate shell scripting.

## File Operations

Essential commands for manipulating files.

| Command | Description |
| :--- | :--- |
| `ls -lah` | List all files (including hidden) with human-readable sizes. |
| `cp -r source dest` | Copy files or directories recursively. |
| `mv source dest` | Move or rename a file/directory. |
| `rm -rf path` | **Danger:** Forcefully remove a directory and its contents. |
| `touch file.txt` | Create an empty file or update its timestamp. |
| `cat file.txt` | Output the entire content of a file. |
| `less file.txt` | View file content one page at a time (`q` to quit). |
| `head -n 10 file` | View the first 10 lines of a file. |
| `tail -f file.log` | Follow the output of a file as it grows (great for logs). |
| `find . -name "*.js"` | Find files ending in `.js` in the current directory. |

## Directory Operations

Navigating the filesystem.

| Command | Description |
| :--- | :--- |
| `pwd` | Print Working Directory (where am I?). |
| `cd /path/to/dir` | Change directory. |
| `cd ..` | Go up one directory level. |
| `cd ~` | Go to the user's home directory. |
| `cd -` | Go back to the *previous* directory you were in. |
| `mkdir -p a/b/c` | Create a nested directory tree in one go. |
| `tree -L 2` | Show directory structure as a tree (max depth 2). |

## Disk, CPU, and Memory

Checking system resources.

| Command | Description |
| :--- | :--- |
| `df -h` | Show **Disk Free** space in human-readable format. |
| `du -sh folder/` | Show **Disk Usage** summary for a specific folder. |
| `free -h` | Show available RAM and Swap memory. |
| `top` | Live view of system processes and resource usage. |
| `htop` | A prettier, more interactive version of `top` (if installed). |
| `uptime` | Show how long the system has been running and load averages. |

## Process Management

Viewing and controlling running programs.

| Command | Description |
| :--- | :--- |
| `ps aux` | List all running processes for all users. |
| `ps aux \| grep node` | Find a specific process (e.g., node). |
| `pidof app_name` | Get the ID (PID) of a specific program. |
| `kill 1234` | Terminate process with PID 1234. |
| `kill -9 1234` | **Force** kill process 1234 (use carefully). |
| `killall nginx` | Kill all processes named `nginx`. |
| `bg` / `fg` | Send a job to background or bring to foreground. |
| `Ctrl + Z` | Suspend the current foreground process. |

## Users and Environment

Who are you and where are you?

| Command | Description |
| :--- | :--- |
| `whoami` | Display current username. |
| `id` | Show user ID and group IDs. |
| `sudo command` | Run command as root (SuperUser). |
| `su - username` | Switch to another user environment. |
| `env` | List all environment variables. |
| `export VAR=value` | Set an environment variable. |
| `echo $PATH` | Print the executable search path. |
| `history` | Show command history. |

## Network & Host Info

Connectivity and identity.

| Command | Description |
| :--- | :--- |
| `hostname -I` | Display the host's IP address(es). |
| `ping google.com` | Check connectivity to a host. |
| `curl -I example.com` | Fetch HTTP headers from a URL. |
| `wget url` | Download a file from the web. |
| `netstat -tuln` | Show active listening ports (TCP/UDP). |
| `ss -tulpn` | Modern replacement for `netstat`. |
| `ssh user@host` | Secure Shell: Connect to a remote server. |
| `scp file user@host:~` | Secure Copy: Upload file to remote home dir. |

## Date, Time, & Scheduling

| Command | Description |
| :--- | :--- |
| `date` | Show current date and time. |
| `date -u` | Show time in UTC. |
| `cal` | Show a calendar for the current month. |
| `crontab -e` | Edit cron jobs (scheduled tasks). |
| `crontab -l` | List current cron jobs. |
| `at 5pm` | Schedule a one-time job for 5 PM. |

---

# Bash Scripting Basics

Top syntax patterns for writing `.sh` scripts.

## Variables & I/O

```bash
#!/bin/bash

# Definition (no spaces!)
NAME="John"
COUNT=5

# Usage
echo "Hello, $NAME"
echo "Count is ${COUNT}"

# Reading Input
read -p "Enter your age: " AGE
echo "You are $AGE years old."