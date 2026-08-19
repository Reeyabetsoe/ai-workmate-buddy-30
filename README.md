# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web app that helps professionals automate everyday
workplace tasks with AI — drafting emails, summarizing meetings, planning work,
researching topics and chatting with an assistant.

**Live app:** https://ai-workmate-buddy-30.lovable.app

## Features

- **Dashboard** — clean overview of every AI workspace with quick entry points.
- **Smart Email Generator** — structured inputs (recipient, goal, tone) produce a polished, editable draft.
- **Meeting Notes Summarizer** — turns raw notes or transcripts into summaries, decisions and action items.
- **AI Task Planner** — breaks goals into prioritized, time-boxed task plans.
- **AI Research Assistant** — structured briefs with key points, risks and open questions.
- **AI Chatbot Interface** — conversational assistant with markdown responses.
- **Editable AI outputs** — every generated result stays fully editable and copyable.
- **Responsible AI disclaimers** — persistent reminders to review AI output before use.
- **Responsive design** — collapsible sidebar navigation on mobile, grid layout on desktop.

## Tech stack

- TanStack Start (React 19, file-based routing, server functions)
- TypeScript
- Vite 8
- Tailwind CSS v4 + shadcn/ui components
- Vercel AI SDK via the Lovable AI Gateway (`google/gemini-3.7-flash`)

## Project structure

```text
src/
  components/       AppShell, ToolWorkspace, shadcn/ui primitives
  lib/
    ai.functions.ts     server functions: generateOutput, chatReply
    ai-gateway.server.ts AI gateway provider setup
  routes/
    __root.tsx      app shell, fonts, toaster
    index.tsx       dashboard
    email.tsx       Smart Email Generator
    notes.tsx       Meeting Notes Summarizer
    planner.tsx     AI Task Planner
    research.tsx    AI Research Assistant
    chat.tsx        Assistant Chat
  styles.css        design tokens and theme
```

## Getting started

Requires Node.js 20+ and npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The dev server runs at http://localhost:8080.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format with Prettier |

## Environment

AI requests run server-side and require `LOVABLE_API_KEY`, which is provided
automatically inside Lovable. For local development, set it in a `.env` file:

```sh
LOVABLE_API_KEY=your_key_here
```

## Responsible AI

Outputs are AI-generated and may be inaccurate or incomplete. Review and edit
anything before sending or acting on it, and never paste confidential data.

## Development in Lovable

Open the project in [Lovable](https://lovable.dev) and keep building with prompts.
Changes made in Lovable sync to the connected GitHub repository automatically, and
pushes to GitHub sync back into Lovable.
