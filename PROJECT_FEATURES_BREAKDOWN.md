# CoScribe: Complete Feature Breakdown & Implementation Guide

This document explains every feature built into CoScribe, detailing **what it does** from a user perspective, and **how it is developed** across the Frontend and Backend.

---

## 1. Authentication & Authorization

**What it does:** Allows users to sign up, log in, and securely access their documents.
- **Backend Implementation:** 
  - Uses `@nestjs/jwt` and `@nestjs/passport` for JWT-based authentication.
  - `AuthService` handles password hashing (`bcrypt`) and issues an `access_token` and `refresh_token`.
  - Global `JwtAuthGuard` secures all API routes. Only users passing a valid Bearer token can hit the endpoints.
- **Frontend Implementation:** 
  - Uses a global Zustand store (`useAuthStore`) to keep track of the logged-in user state.
  - Provides a `/login` and `/register` page built with React Hook Form and Zod for validation.
  - Automatically attaches the JWT to API calls via an Axios interceptor (`api.ts`).

---

## 2. Workspaces & Document Organization

**What it does:** Users can create multiple isolated workspaces, organize documents into folders, and manage document lifecycles (Star, Trash, Restore).
- **Backend Implementation:** 
  - `WorkspaceService` handles creating Workspaces and assigning `WorkspaceMember` roles (OWNER, ADMIN, VIEWER).
  - `DocumentsService` manages Document CRUD operations. It implements "Soft Deletes" by toggling `isDeleted` or `isStarred` boolean flags in PostgreSQL, rather than running `DELETE` queries, making restores instant.
  - Heavy queries (like fetching a user's workspaces) are wrapped with `@nestjs/cache-manager` to cache results in Redis, significantly reducing DB load.
- **Frontend Implementation:** 
  - The `Sidebar` component dynamically renders the active workspace's hierarchy. 
  - Tabs are provided in the Workspace dashboard to filter standard documents, Starred documents, and the Trash bin.
  - Action Dropdowns (`...`) on documents trigger API calls to toggle these boolean states and optimistically update the React UI.

---

## 3. Real-Time Collaborative Editor (The Core Engine)

**What it does:** The main interface where multiple users can type in the same document simultaneously, seeing each other's live cursors and edits without conflicting.
- **Backend Implementation (WebSockets):** 
  - A NestJS Gateway (`EditorGateway`) listens for Socket.IO connections. 
  - It intercepts standard HTTP JWTs during the Socket handshake to ensure unauthorized users cannot connect.
  - Uses the `y-websocket` protocol to blindly forward binary CRDT (Yjs) update arrays from one client to all other clients connected to the same Document Room.
- **Frontend Implementation (Lexical + Yjs):** 
  - Uses Meta's **Lexical** rich-text framework wrapped in `LexicalComposer`.
  - The `@lexical/yjs` package translates local Lexical state changes into mathematical CRDT operations.
  - We use standard Lexical plugins to support specific node types: `HeadingNode`, `ListNode`, `CodeNode`, etc.
  - A custom `CollaborationPlugin` binds the Yjs document to the local Socket.IO client, broadcasting updates at 60fps.

---

## 4. Image Upload System

**What it does:** Allows users to insert rich media into the document text.
- **Backend Implementation:** 
  - Instead of receiving a heavy 5MB image payload directly on the Node server, the `UploadsController` securely communicates with AWS S3 using `@aws-sdk/s3-request-presigner`.
  - It returns a temporary, secure upload URL directly to the frontend.
- **Frontend Implementation:** 
  - A custom Lexical node (`ImageNode`) was built to represent an `<img>` tag in the editor AST.
  - The `ImagePlugin` intercepts file drops or uploads, pushes the file directly to the AWS S3 Presigned URL, and then dispatches an `INSERT_IMAGE_COMMAND` to render the uploaded URL in the document.

---

## 5. Sharing & Permissions Modal

**What it does:** Users can selectively share a document with colleagues by email, or generate a public "Anyone with the link can view/edit" URL.
- **Backend Implementation:** 
  - The ACL (Access Control List) in `DocumentsService` dynamically checks multiple tables before granting write access. 
  - It checks if the user is a Workspace Admin, OR if there is a specific `Permission` override for that document, OR if the document has a `publicRole` of EDITOR.
- **Frontend Implementation:** 
  - A `ShareModal` built with Shadcn UI allows owners to search for users by email and add them to the document. 
  - Includes toggles for Public Sharing which instantly updates the `isPublic` flag in the backend database.

---

## 6. Comments & Threading System

**What it does:** Users can highlight text in the editor and leave a comment, initiating a thread that others can reply to.
- **Backend Implementation:** 
  - Standard CRUD `CommentsService`. Stores the comment text, the ID of the author, and an optional `position` JSON object (to map it back to the editor node). Comments can have nested `Replies`.
- **Frontend Implementation:** 
  - Built a custom Lexical `MarkNode` (`@lexical/mark`) that wraps highlighted text in a visible yellow background.
  - A `CommentsSidebar` sits alongside the editor. When a user clicks a marked text block, the sidebar scrolls to the relevant comment thread.

---

## 7. Real-Time Notification System

**What it does:** If User A shares a document with User B, User B instantly receives an alert via a ringing bell in their navigation bar without needing to refresh the page.
- **Backend Implementation:** 
  - `NotificationsService` writes a Notification record to Postgres.
  - Crucially, it then uses Dependency Injection to call the Socket.IO `EditorGateway`, emitting a `new-notification` event directly to a special private room (`user_{userId}`).
- **Frontend Implementation:** 
  - A `NotificationDropdown` in the Navbar establishes a background Socket.IO connection.
  - It listens for `new-notification` events. When one arrives, it increments an unread counter (a red dot) and adds the new alert to a dropdown list.

---

## 8. Command-K Global Search

**What it does:** Users can press `Cmd + K` (Mac) or `Ctrl + K` (Win) to pop open a global search bar to instantly find documents across their workspace by title.
- **Backend Implementation:** 
  - `SearchController` exposes a GET endpoint accepting a `?q=` parameter.
  - Prisma queries the Postgres database using a `contains` operator with `mode: 'insensitive'` to quickly pattern-match document titles.
- **Frontend Implementation:** 
  - Built a `SearchModal` component in the Navbar that binds an event listener for the `keydown` event on `Meta+K`.
  - Implements a 300ms **debounce** function to ensure we don't bombard the backend API with requests on every single keystroke.
