# FileSharer 🚀

**Secure, Direct P2P File Sharing**

FileSharer is a modern file-sharing application built with **Java 21** and **Next.js 14**. It allows users to share files instantly using simple 6-character codes.

[**🔴 Live Demo**](https://filesharer-fwvm33c1a-anurag-kumars-projects-58e808b2.vercel.app/)

## ✨ Features

*   **Simple Sharing**: Upload a file and get a unique 6-character code (e.g., `A7X9P2`).
*   **Instant Download**: Enter the code on any device to download the file.
*   **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS.
*   **High Performance**: Backend powered by Java 21 Virtual Threads.
*   **Deployment Ready**: Uses standard HTTP ports (8080) for easy cloud hosting.

## 🛠️ Tech Stack

*   **Backend**: Java 21 (LTS), `com.sun.net.httpserver` (Lightweight), Virtual Threads.
*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
*   **Architecture**: REST API with In-Memory Storage for ephemeral sharing.

## 🚀 How to Run Locally

### Prerequisites
*   Java 21+
*   Node.js 20+
*   Maven

### Quick Start
1.  Clone the repository.
2.  Run the startup script (Windows):
    ```powershell
    ./start-all.bat
    ```
3.  Open [http://localhost:3000](http://localhost:3000).

### Manual Start
**Backend:**
```bash
cd backend
mvn clean package
java -jar target/filesharer-backend-1.0-SNAPSHOT.jar
```

**Frontend:**
```bash
cd ui
npm install
npm run dev
```

## 🌍 Deployment

### Backend (Render/Railway)
1.  Push this repo to GitHub.
2.  Connect your repo to Render/Railway.
3.  Root Directory: `backend`
4.  Build Command: `mvn clean package`
5.  Start Command: `java -jar target/peerlink-backend-1.0-SNAPSHOT.jar`

### Frontend (Vercel)
1.  Push this repo to GitHub.
2.  Connect your repo to Vercel.
3.  Root Directory: `ui`
4.  Framework: Next.js
5.  Environment Variables: Set `NEXT_PUBLIC_API_URL` to your backend URL.

---
Built with ❤️ for the Java & Next.js Community.
