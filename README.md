# Motion â€” Kanban Task Management

A full-stack task manager with drag-and-drop Kanban boards, list and calendar views, and live analytics. Built with **Next.js 16 (App Router), TypeScript, NextAuth v5 and MongoDB** (with an Upstash Redis option), deployed on **Vercel**.

**Live demo:** https://motion-pied.vercel.app
â†’ Open **Login** and click **â€œTry the live demo â€” no sign-upâ€** to explore a ready-made project.

## Features

- **Kanban board** with drag-and-drop between Backlog, To Do, In Progress and Done (dnd-kit); moving a card updates its status
- **Multiple projects** per user with a project switcher; each new account starts with a sample project
- **Task details** with priority, rich-text description (Tiptap) and due dates; create, edit and delete
- **List view** and **calendar view** of every task with a due date
- **Dashboard** with open/in-progress/completed counts and upcoming or overdue deadlines
- **Analytics** computed from real data: completion rate, created vs completed (last 7 days), tasks by status and priority
- **Authentication** with email + password (bcrypt, JWT sessions via NextAuth); Google/GitHub sign-in turn on automatically when keys are configured
- Light/dark theme and responsive layout

## Security

- Every project is owned by a user and indexed per user â€” users can only read or change their own projects and tasks
- All server actions check the session and ownership before reading or writing
- Inputs are validated with Zod on the server

## Tech stack

Next.js 16 Â· React 19 Â· TypeScript Â· Tailwind CSS Â· Radix UI Â· NextAuth v5 Â· Upstash Redis Â· dnd-kit Â· Tiptap Â· Recharts Â· Zustand Â· React Query

## Run locally

```bash
npm install
npm run dev
```

Create `.env.local`:

```
AUTH_SECRET=<random string>
MONGODB_URI=<MongoDB connection string>
# or, instead of MongoDB:
UPSTASH_REDIS_REST_URL=<from Upstash>
UPSTASH_REDIS_REST_TOKEN=<from Upstash>
# Optional OAuth
GOOGLE_CLIENT_ID= / GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID= / GITHUB_CLIENT_SECRET=
```

## Data model

Storage goes through a small key-value layer (lib/redis.ts) that runs on MongoDB or Upstash Redis.


| Key | Value |
| --- | --- |
| `user:{email}` | user record (bcrypt password hash) |
| `user:{userId}:projects` | set of the userâ€™s project IDs |
| `project:{id}` / `project:{id}:columns` / `project:{id}:tasks` | project, its column IDs and task IDs |
| `column:{id}`, `task:{id}` | column and task records |

---

Built by [Maaz](https://github.com/Maaz9703).
