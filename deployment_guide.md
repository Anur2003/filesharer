# Deployment Guide for FileSharer

This guide will walk you through deploying your FileSharer application so it can be accessed from anywhere.

## Prerequisites

- A [GitHub](https://github.com/) account.
- A [Render](https://render.com/) account (for Backend).
- A [Vercel](https://vercel.com/) account (for Frontend).
- Git installed on your computer.

## Step 1: Push Code to GitHub

1.  **Initialize Git Repository**:
    Open your terminal in the project root (`c:\Users\anura\Desktop\Projects\file-sharer`) and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a Repository on GitHub**:
    - Go to [GitHub.com](https://github.com/new).
    - Create a new repository (e.g., `filesharer`).
    - **Do not** initialize with README, .gitignore, or license.

3.  **Push Code**:
    Copy the commands provided by GitHub under "…or push an existing repository from the command line" and run them in your terminal. They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/filesharer.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy Backend to Render

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub account and select the `filesharer` repository.
4.  **Configure the Service**:
    - **Name**: `filesharer-backend`
    - **Root Directory**: `backend` (Important!)
    - **Runtime**: `Docker`
    - **Instance Type**: Free
5.  Click **Create Web Service**.
6.  Wait for the deployment to finish. Once done, copy the **onrender.com URL** (e.g., `https://filesharer-backend.onrender.com`).

## Step 3: Deploy Frontend to Vercel

1.  Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import the `filesharer` repository.
4.  **Configure the Project**:
    - **Root Directory**: Click `Edit` and select `ui`.
    - **Environment Variables**:
        - Key: `NEXT_PUBLIC_API_URL`
        - Value: The Render URL you copied in Step 2 (e.g., `https://filesharer-backend.onrender.com`). **Do not add a trailing slash.**
5.  Click **Deploy**.

## Step 4: Verify Cross-System Sharing

1.  Open your Vercel deployment URL (e.g., `https://filesharer-ui.vercel.app`).
2.  Upload a file. You should get a share code.
3.  Open the same URL on a **different device** (e.g., your phone).
4.  Enter the share code and download the file.

## Troubleshooting

-   **CORS Errors**: If you see CORS errors in the browser console, ensure the Backend is running and the `NEXT_PUBLIC_API_URL` is correct.
-   **Backend Sleeping**: On the free tier, Render spins down the service after inactivity. The first request might take 50+ seconds.
