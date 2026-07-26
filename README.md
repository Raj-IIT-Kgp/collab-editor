# CoScribe

A production-grade, real-time collaborative document editor.

## Architecture
- **Frontend**: Next.js 15, React 19, Lexical Editor, TailwindCSS, Yjs (CRDT), Socket.IO Client.
- **Backend**: NestJS, Prisma, PostgreSQL, Redis, Socket.IO, Yjs.
- **Infrastructure**: Docker Compose, AWS S3 (for image uploads).

## Features
- Rich Text Editing (Markdown, Tables, Checklists, Code Blocks, Images).
- Real-Time Collaboration (Live cursors, Typing indicators, Selection highlighting).
- Organization (Workspaces, Folders, Starred, Trash).
- Sharing & Permissions (Viewer/Editor roles, Public link sharing).
- Communication (Document-level Comments, Threaded Replies).
- Real-Time Notifications (Socket.IO dispatched alerts).
- Search (Cmd+K Global Search).
- Performance & Security (Redis Caching, Rate Limiting, Helmet).

---

## Local Development

### 1. Start Services
Ensure you have Docker Desktop running, then start the PostgreSQL and Redis containers:
```bash
docker compose up -d
```

### 2. Backend Setup
```bash
cd backend
pnpm install
pnpm exec prisma db push
pnpm start:dev
```
The backend will run on `http://localhost:3001`.

### 3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```
The frontend will run on `http://localhost:3000`.

---

## Production Deployment

A production-ready Docker Compose file (`docker-compose.prod.yml`) is provided for deploying the entire stack on a single server (e.g., EC2, DigitalOcean Droplet).

### 1. Environment Configuration
Create `.env` files in both `backend` and `frontend` directories with your production secrets.
- **Backend**: Needs `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`, and `AWS_S3_*` credentials.
- **Frontend**: Needs `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.

### 2. Deploy
Run the following command on your production server:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

This will:
1. Spin up PostgreSQL and Redis.
2. Build the optimized NestJS backend and run Prisma migrations.
3. Build the Next.js standalone frontend.
4. Start everything behind isolated Docker networks.

### 3. Reverse Proxy (Optional but Recommended)
For SSL termination, it is recommended to set up an NGINX reverse proxy or use a service like Cloudflare pointing to your server's ports 3000 (Frontend) and 3001 (Backend API & WebSockets).
