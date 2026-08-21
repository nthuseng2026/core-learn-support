# Nthuseng Learning Room

> Personalised learning support, one learner at a time.

Nthuseng Learning Room is a warm, modern web application built for learning-support practitioners. It helps you manage learners, identify learning needs through structured checks, create personalised learning plans, generate targeted activities, track progress over time, and draft parent-friendly reports — all with thoughtful AI assistance.

![Nthuseng Learning Room](src/assets/hero-learning.jpg)

## Core Workflow

```
Learner → Learning Check → Identify Learning Needs
  → Personalised Learning Plan → Learning Activities
    → Progress Tracking → Parent Report
```

## Features

- **Learner Management** — Keep learner profiles, grades, focus areas, guardian contact details, and notes in one place.
- **Learning Checks** — Run structured assessments for literacy and mathematics with sliders, observations, and AI-generated strengths and goals.
- **AI Learner Profile Assistant** — Get strengths-based insights and suggested focus areas from learner data.
- **Personalised Learning Plans** — Create plans with goals, strategies, and resources; AI can draft a plan from the learner profile and latest check.
- **AI Learning Activity Generator** — Build targeted activities by grade, skill, and difficulty with materials, steps, adaptations, and success criteria.
- **Progress Tracking** — Record session notes and performance scores, then visualise progress with interactive charts.
- **AI Progress Report Generator** — Turn progress data into clear, parent-friendly summaries.
- **Parent Communication Assistant** — Draft messages to parents with tone and purpose options.
- **AI Learning Assistant** — Chat with an educator-focused assistant for strategies, activity ideas, and learning-support guidance.

## Design Philosophy

The interface is designed to feel:

- **Warm** and welcoming
- **Professional** enough for parents and schools
- **Child-friendly** without being childish
- **Clean, calm, and accessible** with lots of white space
- **Responsive** across phone, tablet, and desktop

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [React 19](https://react.dev) — UI library
- [TypeScript](https://www.typescriptlang.org) — type safety
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [shadcn/ui](https://ui.shadcn.com) — accessible UI components
- [Lovable AI Gateway](https://docs.lovable.dev/features/ai-gateway) — AI generation
- [Recharts](https://recharts.org) — progress charts
- [Lucide React](https://lucide.dev) — icons

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [Bun](https://bun.sh) or npm

### Install dependencies

```sh
bun install
# or
npm install
```

### Run the development server

```sh
bun dev
# or
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for production

```sh
bun run build
# or
npm run build
```

## Project Structure

```
src/
  components/        # Reusable UI components
  hooks/             # Custom React hooks
  lib/               # State, types, helpers, AI functions, and prompts
  routes/            # TanStack Start file-based routes
  styles.css         # Global theme and Tailwind imports
public/              # Static assets
```

## AI & Responsible Use

Nthuseng Learning Room uses AI to draft suggestions, not to diagnose. The built-in system prompts instruct the model to:

- Use strengths-based, supportive language
- Avoid clinical or medical diagnoses
- Suggest practical, educator-focused next steps
- Flag when professional assessment may be needed

Always review AI-generated content before sharing it with parents, schools, or learners.

## Deployment

This project is developed in [Lovable](https://lovable.dev). You can publish directly from Lovable or connect the project to GitHub for two-way sync and deploy on your own infrastructure.

## License

This project is built and owned by the project creator. See your Lovable workspace for licensing and export options.

---

Built with care for learning-support practitioners, parents, and the learners they serve.
