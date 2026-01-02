---
title: "Deploying 11ty to Google Firebase"
gdate: 2025-12-31
tags: ["tutorial", "firebase", "11ty", "hosting"]
description: "A quick guide on setting up the Firebase CLI and deploying a static 11ty site."
---

I recently decided to move this blog to Google Firebase Hosting. It’s fast, offers a global CDN, and for a static site like this one, it is incredibly cost-effective.

Since I’m working on a Mac with Apple Silicon, I wanted to document the exact steps I took to install the tools, configure the project, and deploy my [Eleventy (11ty)](https://www.11ty.dev/) build.

Here is how to go from zero to deployed.

## 1. Install Node.js and the Firebase CLI

Firebase tools run on Node.js. If you haven't installed Node yet, grab the LTS version from [nodejs.org](https://nodejs.org/).

Once Node is installed, open your Terminal. We need to install the Firebase command-line tools globally so we can run them from any folder.

```bash
sudo npm install -g firebase-tools
```

**Note**: You may be asked for your Mac password since we are using sudo to install a global tool.

## 2. Authenticate

Next, connect the CLI to your Google account.

```bash
firebase login
```

This will open your web browser. Log in with the Google account where you want to host your site. Once you grant permissions, you can close the browser tab.

To verify everything is connected, list your projects:

```bash
firebase projects:list
```

## 3. Initialize the Project

```bash
cd ~/path/to/my-blog
```

Run the initialization wizard:

```bash
firebase init hosting
```

The CLI will ask you a series of questions. Here are the specific answers needed for a standard 11ty site:

1. Project Setup: Select Use an existing project (or create a new one here if you haven't yet).
2. Public Directory: Type _site. Why? This is the default folder where 11ty outputs your HTML/CSS.
3. Configure as a single-page app (SPA)? Type No (N). _Important_: 11ty is a static site generator, not a SPA. Answering "Yes" here will break your SEO and 404 handling.
4. Set up automatic builds with GitHub? Type No (N) for now.
5. Overwrite `index.html`? Type No (N).

## 4. Build and Deploy

Now that the plumbing is set up, the deployment workflow is simple. You need to tell 11ty to build your site into the _site folder, and then tell Firebase to upload that folder.

Run this sequence in your terminal:

```bash
# 1. Clean and build the static files
npx @11ty/eleventy

# 2. Upload to Google's servers
firebase deploy
```

The terminal will output a Hosting URL (ending in `.web.app`). Click that, and your blog is live!

## 5. Future Updates

Whenever I write a new post, I just run that same two-step build/deploy sequence. If I ever need to take the site down temporarily, I can run `firebase hosting:disable`.



