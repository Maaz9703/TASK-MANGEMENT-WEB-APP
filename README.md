# Motion - Advanced Task Management

Motion is a production-ready, full-stack Task Management application built with Next.js 14, TypeScript, MongoDB, and NextAuth.js v5.

## Features

- **Kanban Board**: Drag-and-drop tasks with real-time state management using `@dnd-kit`.
- **Rich Text Editing**: Task descriptions powered by Tiptap with @mentions support.
- **Real-time Collaboration**: Presence indicators and live updates via Pusher.
- **Deep Analytics**: Burndown charts and completion rates using Recharts.
- **Multiple Views**: Kanban, List, Calendar, and My Tasks.
- **Auth Flow**: Secure login/register with Credentials, Google, and GitHub.
- **Modern UI**: Sleek, responsive design with dark mode using Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Auth**: NextAuth.js v5
- **Styling**: Tailwind CSS + Radix UI
- **State**: Zustand + React Query
- **Drag & Drop**: dnd-kit
- **Rich Text**: Tiptap
- **Email**: Resend + React Email

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Pusher account
- Resend API key

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## MongoDB Atlas Setup

1. Create a new cluster on MongoDB Atlas.
2. Under "Network Access", allow your IP address.
3. Under "Database Access", create a user with read/write permissions.
4. Get your connection string and add it to `MONGODB_URI` in `.env.local`.
5. For Search features, create an Atlas Search index on the `tasks` collection with the default name `default`.

## Vercel Deployment

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add all environment variables from `.env.local`.
4. Deploy!

## License

MIT
