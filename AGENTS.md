## Project Overview
AmbitiousYou is a goal-tracking application. It's not another todo application rather it is a todo application on steroids! AmbitiousYou let's you become a superhuman by letting you focus on your life goals in a prioritised approach!

### Key Features
- **Ambitions**: Users can add/update/delete ambitions like achieving something in life, to achieve it, they can break down the steps/smaller tasks into todos and milestones and such things. So an Ambition is an accumulation of all those tasks. _e.g.: An Ambition to achieve 9+ GPA this semester - break down steps to achieve it!_
  - **Tracking Methods**:
    - `task`: Time-bound, recurring actions (e.g., "Exercise 3x/week", "Save $100/month")
    - `milestone`: Sequential achievements (e.g., "5K → 10K → Half Marathon → Marathon")
- **Notes**: Users can add/edit/delete notes to Ambitions.
- **Ambition Stats**: Stats about the Ambition and it's current state.
- **Ambition Details**: About the ambition, start date, end date, priority, percentage completed stuff etc.

### Tech Stack
1. Next.js (App Router, Router Handlers)
2. TypeScript
3. PostgreSQL (Drizzle)
4. Docker
5. BetterAuth for Authentication (Email signup initially)
6. pnpm (default package manager)
7. Playwright for E2E testing
8. Tabler React Icons
9. Zod for Schema Validation (in Route Handlers and Server Actions, input validation should be very serious and strict)
10. shadcn
11. `cn` utility to write conditional classes in TSX files

### Project Structure

under the root directory
- `/public` - for any static content
- `AGENTS.md` - this file, the single source for the entire project's context

under the `/src` directory.
- `/app` - Next.js App Router
- `/app/api` - Next.js Route Handlers (uses services to implement most tasks)
- `/components` - All the common UI Components are present here
- `/features` - All the routes/page specific UI Components and forms and Server Actions are present here. _e.g.: `ambitions/actions.ts`; `ambitions/components/AmbitionCreateForm.tsx`;_
- `/hooks` - Single source to all the custom React Hooks
- `/db` - for Drizzle and db specific work
- `/lib` - contains all the useful utils, services and 
- `/lib/auth.ts` - BetterAuth auth config
- `/services` - contains the class based services for API Route Handlers _(e.g.: `ambitionsService.ts`)_
- `/styles` - Single source for all stylesheets
- `/types` - Single source of all the types of the project for TypeScript (`globals.ts`), the types that are pretty common and would be used in numerous places will only be placed here _(e.g.: `interface Ambition` in `/types/globals.ts` since it will be required in a lot of places)_ rest others would be defined only where required _(e.g.: `interface AmbitionPageProps` in `/ambitions` `page.tsx` only)_
- `/tests` - Playwright tests

### Design System
**Principle**: Heavily B&W with accent colors for key elements only. Do not overuse these colors.

```css
--custom-light: #64ccc5;
--custom-dark: #176b87;
--custom-light-pale: rgba(100, 204, 197, 0.3);
--custom-completed: rgba(16, 185, 129, 0.3);
--custom-ongoing: rgba(59, 130, 246, 0.3);
--custom-future: rgba(168, 85, 247, 0.3);
--custom-incomplete: rgba(255, 99, 71, 0.3);
--custom-background-gradient-start: rgba(100, 204, 197, 0.251);
--scrollbar-bg-light: #ffffff;
--scrollbar-thumb-light: #000000;
--scrollbar-bg-dark: #000000;
--scrollbar-thumb-dark: #ffffff;
```

### Development Conventions
**Code Quality**: Production-grade, efficient, bug-free, cost-effective code always.

- Services as class based like `AmbitionsService.ts` has everything to do with `Ambitions`. Each method in the class should return `Promise<<whatever)might_be_required_based_on_service> | Error>`.
- Server Components are strictly preferred, Client Components should be the last option unless we need browser APIs or something of that sort, else we strictly stick to Server Components. If some Server Component requires client or browser APIs/interactivity, we create it's specific Client Component in the dedicated `/features` dir _(e.g.: `/features/<route_group(only if any)>/<route_name>/components/EditAmbitionForm.tsx`, `/features/<route_group(only if any)>/<route_name>/actions.ts`)_.
- Since we have services (`AmbitionsService.fetchActiveAmbition()`) we use these services to fetch data from the DB into Server Components.
- We have a dedicated Error page i.e. `error.tsx`, either in root or if would be good then in the dedicated page.
- If any service throws error instead of returning data, we catch it in the Server Components and throw it so that error.tsx is rendered.
- If required, we can also use the `loading.tsx` file in the App Router
- When working with Forms, we make the forms, super tightly integrated by using the useActionState<>() fully typed and using Server Actions.
- When building individual components, we still prefer Server Components and if any client interactivity is required, only the part where it is required we extract away into a separate Client Component and build it. Server Components are the first preference always.
- Do not make any changes until you have 95% confidence that you know what to build ask me follow up questions until you have that confidence.
