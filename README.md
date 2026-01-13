<div align="center">

<img src="./public/logo.svg" alt="AmbitiousYou Logo" width="80" height="80" />

# AmbitiousYou

### A Production-Grade Goal Tracking Application

_Transform overwhelming life goals into achievable milestones with a beautifully designed, microservices-based full-stack web application._

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

[Features](#-features) · [System Architecture](#-system-architecture) · [Getting Started](#-getting-started)

**AmbitiousYou Homepage**

https://github.com/user-attachments/assets/e4a95969-a3e4-4978-a371-8217d56a7568

**Dashboard Overview**

https://github.com/user-attachments/assets/fa6f9be8-9d5c-4303-a107-3ddfbce86982

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

| Feature                  | Description                                                                 |
| ------------------------ | --------------------------------------------------------------------------- |
| 🎯 **Ambitions**         | Life goals with flexible tracking via Tasks or Milestones                   |
| ✅ **Tasks**             | Recurring, time-bound actions (e.g., "Exercise 3x/week", "Save $100/month") |
| 🏆 **Milestones**        | Sequential achievements (e.g., "5K → 10K → Half Marathon → Marathon")       |
| 📝 **Notes**             | Attach context, reflections, and learnings to any ambition                  |
| 📊 **Progress Tracking** | Visual completion percentages, priority levels, status filtering            |
| ⭐ **Favorites**         | Quick access to your most important goals                                   |

### Technical Features

| Feature                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| 🔐 **Authentication**      | Email/password with verification & password reset flows |
| 📧 **Email Notifications** | Transactional emails via dedicated microservice         |
| 🌓 **Theme System**        | Light/dark mode with smooth transitions                 |
| 📱 **Responsive Design**   | Mobile-first, works beautifully on all devices          |
| ⚡ **Performance**         | Server Components, Turbopack, optimized loading states  |
| 🧪 **E2E Testing**         | Playwright tests with GitHub Actions CI/CD              |
| 🐳 **Docker Ready**        | Multi-stage production builds                           |

---

## System Architecture

AmbitiousYou follows a **microservices architecture** with two main services communicating via REST APIs:

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Browser["Browser<br/>(React 19)"]
    end

    subgraph MainApp["📦 Main Application"]
        NextJS["Next.js 16<br/>App Router"]
        ServerComponents["Server Components"]
        ServerActions["Server Actions"]
        BetterAuth["BetterAuth"]
        Services["Service Layer<br/>(Business Logic)"]
    end

    subgraph NotificationsService["📧 Notifications Microservice"]
        Express["Express.js 5"]
        MailController["Mail Controller"]
        MailService["Mail Service<br/>(Microsoft Azure Email Communication Service)"]
        Templates["HTML Templates"]
    end

    subgraph DataLayer["🗄️ Data Layer"]
        PostgreSQL[("PostgreSQL<br/>Database")]
        Drizzle["Drizzle ORM"]
    end

    subgraph External["☁️ External Services"]
        EmailProvider["Email Provider<br/>(SMTP)"]
    end

    Browser <-->|"HTTP/SSR"| NextJS
    NextJS --> ServerComponents
    NextJS --> ServerActions
    ServerComponents --> Services
    ServerActions --> Services
    NextJS --> BetterAuth
    Services --> Drizzle
    Drizzle --> PostgreSQL
    BetterAuth -->|"REST API"| Express
    Services -->|"REST API"| Express
    Express --> MailController
    MailController --> MailService
    MailController --> Templates
    MailService -->|"SMTP"| EmailProvider
```

### Service Breakdown

| Service                   | Technology               | Responsibility                                   |
| ------------------------- | ------------------------ | ------------------------------------------------ |
| **Main Application**      | Next.js 16, React 19     | UI, Business Logic, API Routes, Auth             |
| **Notifications Service** | Express.js 5, Node.js    | Email delivery, HTML templates, Future: PWA Push |
| **Database**              | PostgreSQL + Drizzle ORM | Persistent data storage with migrations          |

---

## 🔄 Data Flow & Pipelines

### Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant User as 👤 User
    participant Form as 📝 Auth Form
    participant Auth as 🔐 BetterAuth
    participant DB as 🗄️ PostgreSQL
    participant Notif as 📧 Notifications

    User->>Form: Enter credentials
    Form->>Auth: Submit login/signup
    Auth->>DB: Verify/Create user
    DB-->>Auth: User data

    alt Signup Flow
        Auth->>Notif: Send verification email
        Notif-->>User: 📬 Email verification link
        User->>Auth: Click verification link
        Auth->>DB: Mark email verified
    end

    alt Password Reset
        Auth->>Notif: Send reset link
        Notif-->>User: 📬 Password reset email
        User->>Auth: Submit new password
        Auth->>DB: Update password
        Auth->>Notif: Send confirmation
        Notif-->>User: 📬 Password updated
    end

    Auth-->>Form: Session token
    Form-->>User: ✅ Authenticated
```

### Ambition CRUD Flow

```mermaid
flowchart LR
    subgraph Client["Client Component"]
        UI["React UI"]
        Form["Form with<br/>useActionState"]
    end

    subgraph Server["Server Layer"]
        SA["Server Action"]
        Zod["Zod Validation"]
        Service["AmbitionsService"]
    end

    subgraph Database["Database"]
        PG[("PostgreSQL")]
    end

    UI --> Form
    Form -->|"FormData"| SA
    SA --> Zod
    Zod -->|"Validated Data"| Service
    Service -->|"Drizzle Query"| PG
    PG -->|"Result"| Service
    Service -->|"Typed Response"| SA
    SA -->|"Revalidate Path"| UI
```

### Form Submission Pipeline

```mermaid
flowchart TB
    subgraph Step1["1️⃣ Client Side"]
        ReactForm["React Form Component"]
        UseActionState["useActionState&lt;T&gt;()"]
        FormData["FormData Object"]
    end

    subgraph Step2["2️⃣ Validation Layer"]
        ZodSchema["Zod Schema"]
        TypeInference["Type Inference"]
        ValidationResult{"Valid?"}
    end

    subgraph Step3["3️⃣ Server Action"]
        ServerAction["Server Action<br/>(Fully Typed)"]
        BusinessLogic["Business Logic"]
    end

    subgraph Step4["4️⃣ Service Layer"]
        ServiceClass["Service Class<br/>(e.g., AmbitionsService)"]
        DrizzleORM["Drizzle ORM"]
        DBQuery["Database Query"]
    end

    subgraph Step5["5️⃣ Response"]
        TypedState["Typed State Response"]
        UIUpdate["UI Revalidation"]
    end

    ReactForm --> UseActionState
    UseActionState --> FormData
    FormData --> ZodSchema
    ZodSchema --> TypeInference
    TypeInference --> ValidationResult
    ValidationResult -->|"✅ Yes"| ServerAction
    ValidationResult -->|"❌ No"| ReactForm
    ServerAction --> BusinessLogic
    BusinessLogic --> ServiceClass
    ServiceClass --> DrizzleORM
    DrizzleORM --> DBQuery
    DBQuery --> TypedState
    TypedState --> UIUpdate
    UIUpdate --> ReactForm
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

```mermaid
erDiagram
    USER {
        varchar id PK
        varchar name
        varchar email UK
        boolean emailVerified
        varchar image
        timestamp createdAt
        timestamp updatedAt
    }

    SESSION {
        varchar id PK
        varchar userId FK
        varchar token
        timestamp expiresAt
        varchar ipAddress
        varchar userAgent
        timestamp createdAt
        timestamp updatedAt
    }

    ACCOUNT {
        varchar id PK
        varchar userId FK
        varchar accountId
        varchar providerId
        varchar accessToken
        varchar refreshToken
        timestamp createdAt
        timestamp updatedAt
    }

    VERIFICATION {
        varchar id PK
        varchar identifier
        varchar value
        timestamp expiresAt
        timestamp createdAt
        timestamp updatedAt
    }

    AMBITIONS {
        uuid id PK
        varchar userId FK
        text ambitionName
        text ambitionDefinition
        text ambitionTrackingMethod "task | milestone"
        timestamp ambitionStartDate
        timestamp ambitionEndDate
        timestamp ambitionCompletionDate
        text ambitionStatus "active | completed | missed"
        varchar ambitionPriority "low | medium | high"
        integer ambitionPercentageCompleted
        varchar ambitionColor
        boolean isFavourited
        timestamp createdAt
        timestamp updatedAt
    }

    TASKS {
        uuid id PK
        varchar userId FK
        uuid ambitionId FK
        text task
        text taskDescription
        boolean taskCompleted
        timestamp taskDeadline
        timestamp createdAt
        timestamp updatedAt
    }

    MILESTONES {
        uuid id PK
        varchar userId FK
        uuid ambitionId FK
        text milestone
        text milestoneDescription
        boolean milestoneCompleted
        timestamp milestoneTargetDate
        timestamp createdAt
        timestamp updatedAt
    }

    NOTES {
        uuid id PK
        varchar userId FK
        uuid ambitionId FK
        text note
        timestamp createdAt
        timestamp updatedAt
    }

    SETTINGS {
        uuid id PK
        varchar userId FK
        varchar userTimezone
        timestamp createdAt
        timestamp updatedAt
    }

    USER ||--o{ SESSION : "has"
    USER ||--o{ ACCOUNT : "has"
    USER ||--o{ AMBITIONS : "creates"
    USER ||--o{ SETTINGS : "has"
    AMBITIONS ||--o{ TASKS : "contains"
    AMBITIONS ||--o{ MILESTONES : "contains"
    AMBITIONS ||--o{ NOTES : "has"
```

---

## 🛠️ Tech Stack

### Frontend

| Technology            | Purpose                                      |
| --------------------- | -------------------------------------------- |
| **Next.js 16**        | App Router, Turbopack, Server Components     |
| **React 19**          | Latest concurrent features, `useActionState` |
| **TypeScript**        | Strict mode, full type coverage              |
| **Tailwind CSS v4**   | Utility-first styling                        |
| **shadcn/ui + Radix** | Accessible, customizable components          |
| **Framer Motion**     | Smooth animations & transitions              |
| **next-themes**       | Dark/light mode support                      |

### Backend

| Technology             | Purpose                                 |
| ---------------------- | --------------------------------------- |
| **Next.js API Routes** | Server Actions & Route Handlers         |
| **PostgreSQL**         | Relational database                     |
| **Drizzle ORM**        | Type-safe database queries & migrations |
| **BetterAuth**         | Modern authentication library           |
| **Zod**                | Runtime schema validation               |

### Notifications Microservice

| Technology                                      | Purpose                        |
| ----------------------------------------------- | ------------------------------ |
| **Express.js 5**                                | REST API server                |
| **Microsoft Azure Email Communication Service** | Email delivery                 |
| **Zod**                                         | Request validation             |
| **HTML Templates**                              | Beautiful transactional emails |

### DevOps & Testing

| Technology         | Purpose                              |
| ------------------ | ------------------------------------ |
| **Docker**         | Multi-stage production builds        |
| **GitHub Actions** | CI/CD pipeline                       |
| **Playwright**     | End-to-end testing                   |
| **pnpm**           | Fast, disk-efficient package manager |

---

## 🎯 Key Architectural Decisions

| Decision                              | Rationale                                                            |
| ------------------------------------- | -------------------------------------------------------------------- |
| **Server Components First**           | Maximize performance, minimize client JavaScript bundle              |
| **Microservices for Notifications**   | Separation of concerns, independent scaling, future PWA push support |
| **Service Layer Pattern**             | Encapsulate business logic, testable, reusable across routes         |
| **Feature-Based Structure**           | Colocation of related code (components + actions + validations)      |
| **Server Actions + `useActionState`** | Type-safe forms with progressive enhancement                         |
| **Drizzle over Prisma**               | Lightweight, SQL-like syntax, excellent TypeScript DX                |
| **BetterAuth over NextAuth**          | Modern API, better TypeScript support, simpler configuration         |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (or Docker)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hemants1703/ambitiousyou.git
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
NOTIFICATIONS_SERVICE_BASE_URL=http://localhost:8000

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

| Area                        | Learnings                                                                  |
| --------------------------- | -------------------------------------------------------------------------- |
| **React Server Components** | When to use Server vs Client components, data fetching patterns, streaming |
| **Type-Safe Full-Stack**    | End-to-end TypeScript with Zod validation, `useActionState` typing         |
| **Modern Authentication**   | Implementing secure email verification, password reset, session management |
| **Microservices**           | Service separation, API design, inter-service communication                |
| **Database Design**         | Relational modeling, migrations, type-safe ORMs                            |
| **Testing Strategy**        | E2E testing with Playwright, CI/CD integration                             |
| **Production Deployment**   | Docker multi-stage builds, environment management                          |

---

## 🗺️ Roadmap

- [x] GitHub Actions > GHCR > Droplets Deployments
- [ ] PWA push notifications (service worker integration)
- [ ] AI-powered goal suggestions
- [ ] Analytics dashboard with progress insights
- [ ] Scheduled reminder notifications

---

## 🤝 Related Repositories

| Repository                                                                                              | Description                            |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [ambitiousyou-notifications-service](https://github.com/hemants1703/ambitiousyou-notifications-service) | Email & push notification microservice |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ and countless cups of ☕ by [Hemant Sharma](https://hemantsharma.tech)**

[LinkedIn](https://hemantsharma.tech/linkedin) · [Twitter](https://hemantsharma.tech/x) · [Portfolio](https://hemantsharma.tech)

⭐ Star this repo if you find it useful!

</div>
