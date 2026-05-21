# Project Architecture & AI Instructions Context

## 1. Project Overview & Tech Stack
You are assisting a Computer Systems Engineer in building a production-ready, highly scalable enterprise system.
- **Architecture**: Monorepo using **Turborepo**
- **Frameworks**: Next.js App Router (Customer Facing Store) & React + Vite (Merchant Admin Panel)
- **Backend & Data Layer**: **Convex** (Reactive Database, Full-stack Type Safety)
- **Styling Core**: Tailwind CSS + Sub-atomic design tokens mapped into theme configs
- **Component Base**: Headless UI components using **Ark UI** (Zag.js state machine powered)
- **Animations**: **GSAP (GreenSock)** for high-end UI animations + **Lenis** for ultra-smooth scrolling
- **Folder Pattern**: Strictly **Feature-Driven Architecture**
- **DevOps**: Automated **CI/CD Pipeline** via GitHub Actions

## 2. Directory Structure (Monorepo Layout)
The project is strictly organized as follows. Never deviate or suggest layouts outside this ecosystem:
```text
├── apps/
│   ├── shop/               # Next.js App Router (Customer Store)
│   └── dashboard/          # React + Vite (Admin Panel)
├── packages/
│   ├── ui/                 # Pure UI Design System (Isolated Design Tokens & Ark UI)
│   └── types/              # Shared TypeScript definitions and global interfaces
├── package.json            # Root package
└── turbo.json              # Turborepo configurations

## 3. Strict Architectural Rules & Guardrails
A. Separation of Concerns & Blind UI
Every component inside packages/ui MUST be completely blind. It has zero knowledge of APIs, backend functions, Global States, or server contexts. It only accepts data via props, using Ark UI for headless primitives and Tailwind CSS for styling.

No Convex hooks (useQuery/useMutation) or async side-effects are allowed inside packages/ui.

B. Custom Hooks & Convex Data Layer
All business logic, data fetching, mutations, and local/global states within apps/ MUST be isolated into Custom Hooks.

Component files in features should focus primarily on UI composition and layout.

Rely strictly on Convex's native reactive hooks. Do NOT introduce Axios, React Query, or Redux.

C. Feature-Driven Co-location
Do NOT create global, flat components/ or hooks/ directories inside apps for business logic. Organize code by business capabilities: features/auth, features/cart, features/products.

Each feature directory houses its specific components, hooks, and API layer.

D. Sub-Atomic Design Tokens
Design primitives (Colors, padding, spacing, border-radii) must originate from packages/ui. Do NOT generate hardcoded arbitrary values (e.g., bg-[#0284c7] or p-[12px]) in layouts.

E. Ultra-Smooth Animations (GSAP & Lenis)
All interactive, scroll-triggered, or entry animations must utilize GSAP. Ensure proper lifecycle cleanup in React (gsap.context() or useGSAP hook) to prevent memory leaks.

Implement Lenis for global smooth scrolling to ensure that GSAP ScrollTrigger features look fluid.

4. How to Assist
Be Proactive as an Architect: Always double-check if a component can be split into reusable primitives before writing flat monolithic structures.

Type Safety Enforcement: Maintain strict TypeScript patterns. Leverage the packages/types workspace to share data models between the frontend apps and Convex schemas.