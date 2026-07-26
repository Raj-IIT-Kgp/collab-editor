# CoScribe: FAANG Interview Preparation Guide

This document is a comprehensive deep-dive into the CoScribe Collaborative Editor. It is designed to prepare you for System Design and deep-dive technical interview rounds at top-tier tech companies (FAANG). It covers architecture, difficult engineering problems, trade-offs, and data modeling.

---

## 1. System Architecture Overview

**CoScribe** is a real-time, multiplayer rich-text collaborative editor (a Google Docs clone). 

### Tech Stack Choices & Justifications:
- **Frontend: Next.js (React 19)**
  - *Why:* SEO capabilities, App Router for clean API/page separation, server-side rendering for fast initial paints, and a massive ecosystem.
- **Editor Framework: Meta's Lexical**
  - *Why:* Unlike older monolithic editors (Quill, Draft.js), Lexical is highly modular, accessible, and has first-class React bindings. Crucially, it has excellent built-in support for CRDTs (Yjs) which is mandatory for real-time collaboration.
- **Backend: NestJS (Node.js)**
  - *Why:* Provides strong opinions on architecture (Modules, Controllers, Services). Out-of-the-box support for Dependency Injection, WebSockets, Guards (Auth), and Interceptors (Caching) making enterprise-grade scaling easier.
- **Database: PostgreSQL (via Prisma ORM)**
  - *Why:* Relational data is required for complex Access Control Lists (ACLs) like Workspaces, nested Folders, and Document Permissions. Postgres provides ACID compliance.
- **Caching & Pub/Sub: Redis**
  - *Why:* Used to cache heavy database queries (workspace fetching) and acts as a Pub/Sub message broker to scale WebSockets across multiple backend instances.
- **Storage: AWS S3**
  - *Why:* Object storage for images. We use **Presigned URLs** to offload the heavy lifting of file uploads directly to AWS, bypassing our Node.js server entirely.

---

## 2. The "Hard" Problem: Real-Time Collaboration & Concurrency

If you are asked about this project in an interview, **this is the most important section.** How do multiple people edit the same document at the same time without overwriting each other?

### Operational Transformation (OT) vs. CRDTs
Historically, Google Docs used **OT (Operational Transformation)**. OT requires a central server to order incoming operations, resolve conflicts, and broadcast the transformed operations back to clients. It is notoriously difficult to implement correctly and requires the server to understand the document structure.

**We chose CRDTs (Conflict-free Replicated Data Types) via Yjs.**
- **How it works:** CRDTs are mathematical data structures where operations can be applied in *any order* (commutative). The server doesn't need to resolve conflicts; it just blindly forwards binary updates from one client to all others. The clients merge the updates mathematically.
- **Offline Support:** If a user goes offline, they can keep typing. Yjs stores the operations locally. When they reconnect, they send their missed operations to the server, and Yjs merges them perfectly without conflict.
- **The Protocol:** We use **Socket.IO** (WebSockets) to transmit the Yjs update arrays (Uint8Array binaries) between clients in real-time.

### Scaling WebSockets
A single Node.js instance can only handle roughly 10k-50k concurrent WebSocket connections. What if we have 1 million users?
- We scale horizontally by adding more NestJS backend servers behind a Load Balancer.
- **The Problem:** User A connects to Server 1. User B connects to Server 2. If they are in the same document room, how do they sync?
- **The Solution: Redis Pub/Sub (Redis Adapter).** When User A sends a document update to Server 1, Server 1 publishes it to Redis. Server 2 is subscribed to Redis, receives the update, and pushes it down the WebSocket to User B.

---

## 3. Data Modeling & Database Design

The relational database is normalized to ensure data integrity.

### Core Tables & Relationships:
1. **User**: Standard user profile (`id, email, password_hash`).
2. **Workspace**: A collaborative environment (`id, name`).
3. **WorkspaceMember**: Many-to-Many junction table (`workspaceId, userId, role`). Defines if a user is an OWNER, ADMIN, or VIEWER of a workspace.
4. **Folder**: Self-referencing table (`id, name, parentId`) to allow infinite nesting of directories.
5. **Document**: The core entity (`id, title, content (Bytes), workspaceId, ownerId`). Note that `content` is stored as a `ByteA` array because Yjs state is binary.
6. **Permission**: Document-level overrides (`documentId, userId, role`). If a user is only a VIEWER in the workspace, this table can upgrade them to an EDITOR for a specific document.
7. **Comment & Reply**: For document-level discussions (`documentId, userId, content, position`).

---

## 4. Security, Auth, and Access Control

### Authentication
- Uses **JWT (JSON Web Tokens)**. 
- WebSockets are secured by forcing the client to pass the JWT token in the initial Socket handshake (`auth: { token }`). The NestJS Gateway verifies the token before allowing the client to join a document room.

### Authorization (Access Control List - ACL)
When a user attempts to edit a document, the system evaluates permissions in a hierarchy:
1. **Is the user the Owner?** -> Allow.
2. **Check Workspace Level:** Is the user an ADMIN/EDITOR in the workspace? -> Allow.
3. **Check Document Level:** Does the user have a specific `Permission` record for this document as an EDITOR? -> Allow.
4. **Check Public Link Level:** Is the document `isPublic` and is the `publicRole` set to EDITOR? -> Allow.
5. Otherwise -> Deny (HTTP 403 Forbidden).

### API Security & Performance
- **Helmet:** Adds standard HTTP headers (XSS protection, preventing MIME-sniffing).
- **Rate Limiting:** NestJS Throttler restricts IP addresses to 100 requests per minute to prevent brute-force attacks and DDOS.
- **Redis Caching:** Read-heavy, infrequently changing queries (like "Get all Workspaces for User") are cached in Redis. The cache is served in O(1) time, saving a complex SQL join.

---

## 5. Trade-offs and Architectural Decisions

During an interview, you must be able to discuss *why* you made certain choices and what the drawbacks are.

**1. Presigned S3 URLs vs. Direct Server Uploads**
- *Choice:* We use Presigned URLs. The client asks the backend for a secure URL, then uploads the image directly to AWS S3.
- *Trade-off:* Slightly more complex frontend logic.
- *Benefit:* The Node.js server doesn't have to process large binary payloads (images), which would block the single-threaded Event Loop and consume immense bandwidth and RAM.

**2. WebSockets vs. Server-Sent Events (SSE)**
- *Choice:* WebSockets (Socket.IO).
- *Trade-off:* WebSockets are stateful and require sticky sessions at the load balancer (or Redis Adapter) which makes scaling harder than stateless HTTP.
- *Benefit:* WebSockets provide full-duplex, bi-directional communication with minimal overhead. Since collaborative editing requires clients to send updates *and* receive updates simultaneously at 60fps (cursor movements), SSE (which is unidirectional from server-to-client) would force clients to use HTTP POST for sending updates, causing immense HTTP header overhead and latency.

**3. Soft Deletes (isDeleted, isArchived) vs. Hard Deletes**
- *Choice:* We use boolean flags to mark documents as deleted (Trash).
- *Trade-off:* Database size grows perpetually; queries must always remember to include `where: { isDeleted: false }`.
- *Benefit:* Accidental deletions can be reversed instantly. It also preserves analytical data and prevents foreign-key cascade nightmares in heavily relational databases.

---

## 6. Common Interview Questions You Can Answer With This Project

**Q: "Design Google Docs" (System Design)**
- *A:* Draw the architecture: Clients connect via WebSockets to a Node.js fleet. Node.js fleet uses Redis Pub/Sub for cross-server communication. Yjs (CRDT) handles conflict resolution on the clients. Postgres stores metadata. S3 stores images.

**Q: "How do you handle a thundering herd problem or database bottleneck?"**
- *A:* Implement caching (Redis). For example, caching the Workspace Document list. If cache gets invalidated on write, the next read hits the DB and repopulates the cache. For extreme loads, implement DB Read Replicas.

**Q: "How do you handle a user uploading a 5GB file crashing your server?"**
- *A:* Mention Presigned S3 URLs. The file never touches the application server.

**Q: "What happens if two people edit the exact same word at the exact same millisecond?"**
- *A:* CRDTs (Yjs) resolve this mathematically. Each character inserted is assigned a globally unique ID (Site ID + Logical Clock). The CRDT algorithm ensures that all peers will eventually converge on the exact same state based on these IDs, without needing a central server to arbitrate.
