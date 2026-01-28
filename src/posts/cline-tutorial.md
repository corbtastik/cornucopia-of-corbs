---
title: "Tutorial: Coding with Cline and Google Gemini"
date: 2026-01-28
tags: ["tutorial", "ai", "vscode", "cline"]
description: "A step-by-step guide to setting up the Cline AI coding agent with Google's Gemini Pro model."
---

## Introduction

In the rapidly evolving world of AI-assisted development, **Cline** stands out as a powerful, open-source autonomous coding agent for VSCode. Unlike simple autocomplete tools, Cline can execute terminal commands, create files, and analyze your entire codebase.

In this tutorial, we will walk through setting up Cline with Google's **Gemini Flash 2.0** model—a powerful and cost-effective combination.

## Step 1: Install the Extension

1.  Open **VSCode**.
2.  Navigate to the **Extensions** view (`Cmd+Shift+X` on Mac).
3.  Search for **"Cline"**.
4.  Click **Install**.

Once installed, you will see a robot icon in your sidebar. Click it to open the Cline interface.

## Step 2: Get Your Gemini API Key

To power Cline, we need a "brain." Google's Gemini models are currently some of the best for reasoning and coding tasks.

1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Sign in with your Google account.
3.  Click on **"Get API key"** in the sidebar.
4.  Click **"Create API key"** (you can create it in a new project or an existing one).
5.  **Copy** the generated key string. Keep this secret!

## Step 3: Configure Cline

1.  Back in VSCode, open the Cline sidebar.
2.  Click the **Gear icon** (Settings) in the top right or bottom of the Cline window.
3.  In the **API Provider** dropdown, select **"Google Gemini"**.
4.  Paste your API key into the **"Gemini API Key"** field.
5.  Select your model (e.g., `gemini-2.0-flash-exp` or `gemini-1.5-pro`).
6.  Click **Done**.

## Step 4: Your First Task (The "Hello World" Commit)

Now let's see Cline in action. We will ask it to make a small change to a project and commit it.

1.  Open a project in VSCode (like this blog!).
2.  In the Cline chat box, type:
    > "Create a new file called `hello-cline.txt` with a friendly greeting, and then commit it to the repo with the message 'feat: my first ai commit'."
3.  Press **Enter**.

### What happens next?
Cline will analyze your request and present a plan. You will see it:
1.  **Think**: Analyze the directory structure.
2.  **Act**: Use the `write_to_file` tool to create the file.
3.  **Act**: Use the `execute_command` tool to run `git add` and `git commit`.

You will be asked to **Approve** each step (unless you enable auto-approve). Once confirmed, check your git history—you just committed code without writing a single line yourself!

## Conclusion

You have now set up a fully autonomous coding agent directly in your editor. With the power of Gemini and the capabilities of Cline, you can automate tedious tasks, refactor code, and prototype faster than ever.

Happy coding!
