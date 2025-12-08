<div align="center">

<img src="./public/logo.svg" alt="AmbitiousYou Logo" width="80" height="80" />

# AmbitiousYou

### A Production-Grade Goal Tracking Application

*Transform overwhelming life goals into achievable milestones with a beautifully designed, microservices-based full-stack web application.*

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

[Live Demo](#) · [Features](#-features) · [System Architecture](#-system-architecture) · [Getting Started](#-getting-started)

</div>

---

## 🌟 Project Overview

AmbitiousYou is not just another todo app—it's a **goal tracking system on steroids**. Built as a personal challenge to create a production-ready SaaS application from scratch, this project demonstrates:

- **Microservices Architecture** — Separate concerns with dedicated notification service
- **Modern React Patterns** — Server Components, Server Actions, `useActionState` with React 19
- **Type-Safe Full-Stack** — End-to-end TypeScript with Zod runtime validation
- **Clean Architecture** — Service layer pattern, proper separation of concerns
- **DevOps Maturity** — Docker, CI/CD, E2E testing, multi-stage builds
- **UX Excellence** — Framer Motion animations, responsive design, dark/light themes

> 💡 **Why I Built This**: This project represents my journey in mastering modern full-stack development. Every architectural decision was intentional—from choosing Server Components for performance to implementing a dedicated microservice for notifications.

---

## ✨ Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| 🎯 **Ambitions** | Life goals with flexible tracking via Tasks or Milestones |
| ✅ **Tasks** | Recurring, time-bound actions (e.g., "Exercise 3x/week", "Save $100/month") |
| 🏆 **Milestones** | Sequential achievements (e.g., "5K → 10K → Half Marathon → Marathon") |
| 📝 **Notes** | Attach context, reflections, and learnings to any ambition |
| 📊 **Progress Tracking** | Visual completion percentages, priority levels, status filtering |
| ⭐ **Favorites** | Quick access to your most important goals |

### Technical Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/password with verification & password reset flows |
| 📧 **Email Notifications** | Transactional emails via dedicated microservice |
| 🌓 **Theme System** | Light/dark mode with smooth transitions |
| 📱 **Responsive Design** | Mobile-first, works beautifully on all devices |
| ⚡ **Performance** | Server Components, Turbopack, optimized loading states |
| 🧪 **E2E Testing** | Playwright tests with GitHub Actions CI/CD |
| 🐳 **Docker Ready** | Multi-stage production builds |

---

## 🏗️ System Architecture

AmbitiousYou follows a **microservices architecture** with two main services communicating via REST APIs:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AMBITIOUSYOU SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌───────────────┐  │
│  │                 │         │                 │         │               │  │
│  │     Client      │◄───────►│   Main App      │◄───────►│  PostgreSQL   │  │
│  │    (Browser)    │  HTTP   │  (Next.js 16)   │  SQL    │   Database    │  │
│  │                 │         │                 │         │               │  │
│  └─────────────────┘         └────────┬────────┘         └───────────────┘  │
│                                       │                                     │
│                                       │ REST API                            │
│                                       ▼                                     │
│                              ┌─────────────────┐         ┌───────────────┐  │
│                              │  Notifications  │         │    Email      │  │
│                              │    Service      │────────►│   Provider    │  │
│                              │  (Express.js)   │  SMTP   │ (Nodemailer)  │  │
│                              └─────────────────┘         └───────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Breakdown

| Service | Technology | Responsibility |
|---------|------------|----------------|
| **Main Application** | Next.js 16, React 19 | UI, Business Logic, API Routes, Auth |
| **Notifications Service** | Express.js 5, Node.js | Email delivery, HTML templates, Future: PWA Push |
| **Database** | PostgreSQL + Drizzle ORM | Persistent data storage with migrations |

---

## 🔄 Data Flow & Pipelines

### Authentication Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────────┐
│  User    │───►│  Login/      │───►│ BetterAuth  │───►│   PostgreSQL     │
│ Browser  │    │  Signup Form │    │  Verify     │    │  users/sessions  │
└──────────┘    └──────────────┘    └──────┬──────┘    └──────────────────┘
                                           │
                                           ▼
                                   ┌───────────────┐
                                   │ Notifications │───► Email Verification
                                   │   Service     │───► Password Reset
                                   └───────────────┘───► Welcome Email
```

### Ambition CRUD Flow

```
┌──────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│  Client  │───►│ Server       │───►│ AmbitionsService│───►│  PostgreSQL  │
│Component │    │ Action/Route │    │ (Business Logic)│    │   ambitions  │
└──────────┘    └──────────────┘    └─────────────────┘    │   tasks      │
     ▲                                                     │   milestones │
     │                                                     │   notes      │
     └─────────────────────────────────────────────────────┴──────────────┘
                              Revalidation & UI Update
```

### Form Submission Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TYPE-SAFE FORM PIPELINE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. CLIENT                2. VALIDATION           3. SERVER ACTION      │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────────┐   │
│  │ React Form  │────────►│ Zod Schema  │────────►│ Server Action   │   │
│  │ useAction   │         │ Validation  │         │ with Types      │   │
│  │ State<T>()  │         │             │         │                 │   │
│  └─────────────┘         └─────────────┘         └────────┬────────┘   │
│        ▲                                                  │            │
│        │                                                  ▼            │
│        │                                         ┌─────────────────┐   │
│        │                                         │ Service Layer   │   │
│        │                                         │ (DB Operations) │   │
│        │                                         └────────┬────────┘   │
│        │                                                  │            │
│        └──────────────────────────────────────────────────┘            │
│                          Response with Typed State                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ambitiousyou/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (app)/                    # Protected routes (authenticated)
│   │   │   ├── ambitions/            # Ambition CRUD pages
│   │   │   │   ├── [ambitionId]/     # Dynamic route for single ambition
│   │   │   │   │   ├── edit/         # Edit ambition page
│   │   │   │   │   └── page.tsx      # Ambition details view
│   │   │   │   ├── new/              # Create ambition page
│   │   │   │   └── page.tsx          # Ambitions list
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── settings/             # User preferences
│   │   │   └── billing/              # Subscription management
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (landing)/                # Public marketing pages
│   │   │   ├── features/
│   │   │   └── experience/           # Interactive demo
│   │   └── api/                      # API route handlers
│   │
│   ├── features/                     # Feature-based modules
│   │   ├── (app)/
│   │   │   ├── ambitions/            # Ambition-related components
│   │   │   │   ├── components/       # UI components
│   │   │   │   ├── CreateNewAmbition/
│   │   │   │   │   ├── actions.ts    # Server Actions
│   │   │   │   │   ├── validation.ts # Zod schemas
│   │   │   │   │   └── *.tsx         # Form components
│   │   │   │   └── (ambitionId)/     # Per-ambition features
│   │   │   │       ├── CreateNewTask/
│   │   │   │       ├── CreateMilestone/
│   │   │   │       └── MutateNote/
│   │   │   ├── dashboard/            # Dashboard widgets
│   │   │   └── settings/             # Settings tab components
│   │   ├── (auth)/                   # Auth form components
│   │   └── (landing)/                # Landing page sections
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui components
│   │   └── *.tsx                     # Custom shared components
│   │
│   ├── services/                     # Business logic layer
│   │   ├── ambitionsService.ts       # Ambition CRUD operations
│   │   ├── emailService.ts           # Notification service client
│   │   ├── settingsService.ts        # User settings operations
│   │   └── userService.ts            # User management
│   │
│   ├── db/                           # Database layer
│   │   ├── schema.ts                 # Drizzle schema definitions
│   │   ├── index.ts                  # Database connection
│   │   └── migrations/               # SQL migration files
│   │
│   ├── lib/                          # Utilities & configs
│   │   ├── auth/                     # BetterAuth configuration
│   │   ├── hooks/                    # Custom React hooks
│   │   └── utils.ts                  # Helper functions
│   │
│   ├── types/                        # TypeScript type definitions
│   └── tests/                        # Playwright E2E tests
│
├── public/                           # Static assets
├── .github/workflows/                # CI/CD pipelines
├── Dockerfile                        # Multi-stage production build
├── docker-compose.yml                # Local development setup
└── drizzle.config.ts                 # Database migration config
```

---

## 🗃️ Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────────────────┐   │
│  │    user     │       │   session   │       │     verification        │   │
│  ├─────────────┤       ├─────────────┤       ├─────────────────────────┤   │
│  │ id (PK)     │◄──────│ userId (FK) │       │ id (PK)                 │   │
│  │ name        │       │ token       │       │ identifier              │   │
│  │ email       │       │ expiresAt   │       │ value                   │   │
│  │ emailVerified│      │ ipAddress   │       │ expiresAt               │   │
│  │ image       │       │ userAgent   │       └─────────────────────────┘   │
│  │ createdAt   │       └─────────────┘                                     │
│  │ updatedAt   │                                                           │
│  └──────┬──────┘                                                           │
│         │                                                                   │
│         │ 1:N                                                               │
│         ▼                                                                   │
│  ┌─────────────────┐                                                       │
│  │    ambitions    │                                                       │
│  ├─────────────────┤                                                       │
│  │ id (PK, UUID)   │                                                       │
│  │ userId (FK)     │                                                       │
│  │ ambitionName    │                                                       │
│  │ ambitionDefinition                                                      │
│  │ ambitionTrackingMethod (task | milestone)                               │
│  │ ambitionStartDate                                                       │
│  │ ambitionEndDate │                                                       │
│  │ ambitionStatus (active | completed | missed)                            │
│  │ ambitionPriority (low | medium | high)                                  │
│  │ ambitionPercentageCompleted                                             │
│  │ ambitionColor   │                                                       │
│  │ isFavourited    │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│     ┌─────┴─────┬─────────────┐                                            │
│     │           │             │                                            │
│     ▼           ▼             ▼                                            │
│  ┌────────┐ ┌──────────┐ ┌─────────┐                                       │
│  │ tasks  │ │milestones│ │  notes  │                                       │
│  ├────────┤ ├──────────┤ ├─────────┤                                       │
│  │id (PK) │ │id (PK)   │ │id (PK)  │                                       │
│  │userId  │ │userId    │ │userId   │                                       │
│  │ambition│ │ambitionId│ │ambition │                                       │
│  │Id (FK) │ │(FK)      │ │Id (FK)  │                                       │
│  │task    │ │milestone │ │note     │                                       │
│  │taskDesc│ │milestone │ │createdAt│                                       │
│  │Completed│ │Desc     │ │updatedAt│                                       │
│  │deadline│ │completed │ └─────────┘                                       │
│  └────────┘ │targetDate│                                                   │
│             └──────────┘                                                   │
│                                                                             │
│  ┌─────────────┐      ┌─────────────┐                                      │
│  │  settings   │      │   account   │  (OAuth providers - future)          │
│  ├─────────────┤      ├─────────────┤                                      │
│  │ id (PK)     │      │ id (PK)     │                                      │
│  │ userId (FK) │      │ userId (FK) │                                      │
│  │ userTimezone│      │ providerId  │                                      │
│  └─────────────┘      │ accountId   │                                      │
│                       └─────────────┘                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | App Router, Turbopack, Server Components |
| **React 19** | Latest concurrent features, `useActionState` |
| **TypeScript** | Strict mode, full type coverage |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui + Radix** | Accessible, customizable components |
| **Framer Motion** | Smooth animations & transitions |
| **next-themes** | Dark/light mode support |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | Server Actions & Route Handlers |
| **PostgreSQL** | Relational database |
| **Drizzle ORM** | Type-safe database queries & migrations |
| **BetterAuth** | Modern authentication library |
| **Zod** | Runtime schema validation |

### Notifications Microservice

| Technology | Purpose |
|------------|---------|
| **Express.js 5** | REST API server |
| **Nodemailer** | Email delivery |
| **Zod** | Request validation |
| **HTML Templates** | Beautiful transactional emails |

### DevOps & Testing

| Technology | Purpose |
|------------|---------|
| **Docker** | Multi-stage production builds |
| **GitHub Actions** | CI/CD pipeline |
| **Playwright** | End-to-end testing |
| **pnpm** | Fast, disk-efficient package manager |

---

## 🎯 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Server Components First** | Maximize performance, minimize client JavaScript bundle |
| **Microservices for Notifications** | Separation of concerns, independent scaling, future PWA push support |
| **Service Layer Pattern** | Encapsulate business logic, testable, reusable across routes |
| **Feature-Based Structure** | Colocation of related code (components + actions + validations) |
| **Server Actions + `useActionState`** | Type-safe forms with progressive enhancement |
| **Drizzle over Prisma** | Lightweight, SQL-like syntax, excellent TypeScript DX |
| **BetterAuth over NextAuth** | Modern API, better TypeScript support, simpler configuration |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (or Docker)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ambitiousyou.git
cd ambitiousyou

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start PostgreSQL (via Docker)
docker-compose up -d db

# Run database migrations
pnpm db:migrate

# Start development server (with Turbopack)
pnpm dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ambitiousyou

# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Notifications Service
MAIL_SERVICE_BASE_URL=http://localhost:3001/api/email

# See .env.example for complete list
```

### Running the Notifications Service

```bash
# In a separate terminal
cd ambitiousyou-notifications-service
pnpm install
pnpm dev
```

---

## 🧪 Testing

```bash
# Run E2E tests
pnpm exec playwright test

# Run with UI mode
pnpm exec playwright test --ui

# Generate HTML report
pnpm exec playwright show-report
```

---

## 🐳 Docker Deployment

```bash
# Build production image
docker build -t ambitiousyou .

# Run with docker-compose
docker-compose up -d
```

The Dockerfile uses a **multi-stage build** for optimized production images:
1. **deps** — Install dependencies
2. **builder** — Build the Next.js application
3. **runner** — Minimal production image with standalone output

---

## 📈 What I Learned

Building AmbitiousYou deepened my understanding of:

| Area | Learnings |
|------|-----------|
| **React Server Components** | When to use Server vs Client components, data fetching patterns, streaming |
| **Type-Safe Full-Stack** | End-to-end TypeScript with Zod validation, `useActionState` typing |
| **Modern Authentication** | Implementing secure email verification, password reset, session management |
| **Microservices** | Service separation, API design, inter-service communication |
| **Database Design** | Relational modeling, migrations, type-safe ORMs |
| **Testing Strategy** | E2E testing with Playwright, CI/CD integration |
| **Production Deployment** | Docker multi-stage builds, environment management |

---

## 🗺️ Roadmap

- [ ] GitHub Actions > GHCR > Droplets Deployments
- [ ] PWA push notifications (service worker integration)
- [ ] AI-powered goal suggestions
- [ ] Analytics dashboard with progress insights
- [ ] Scheduled reminder notifications

---

## 🤝 Related Repositories

| Repository | Description |
|------------|-------------|
| [ambitiousyou-notifications-service](https://github.com/hemants1703/ambitiousyou-notifications-service) | Email & push notification microservice |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ and countless cups of ☕ by [Hemant Sharma](https://hemantsharma.tech)**

[LinkedIn](https://linkedin.com/in/hemants1703) · [Twitter](https://x.com/hemants1703) · [Portfolio](https://hemantsharma.tech)

⭐ Star this repo if you find it useful!

</div>
