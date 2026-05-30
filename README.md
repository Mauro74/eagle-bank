# Eagle Bank

A personal banking UI built with React 19, TypeScript 5, and Vite 5. Demonstrates modern React patterns — the Compiler, `useActionState`, `useOptimistic`, `useFormStatus`, and `use()` for context — across a realistic feature set: authentication, dashboard, account management, and profile editing.

All data is served from a typed in-memory mock layer with simulated network delay. No backend required.

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # Vitest unit tests
npm run typecheck
npm run build
```

### Demo credentials

| Email | Password |
|---|---|
| `demo@eaglebank.com` | `password123` |

The demo account loads with three accounts (checking, savings, credit card) and twenty transactions across May 2026.

---

## Architecture decisions

### Feature-first folder structure

Each domain (`auth`, `dashboard`, `accounts`, `profile`) is self-contained under `src/features/`. Components, local types, and feature-specific API calls live together. Changes to one feature don't require touching other directories. This scales better than a layer-first structure (all `components/`, all `hooks/`) because the blast radius of a change stays within a single folder.

Shared primitives that are genuinely cross-cutting (shadcn UI components, layouts, the error boundary) live in `src/components/`. Types shared across features live in `src/types/index.ts`.

### Zustand for client state, TanStack Query for server state

These two libraries solve different problems and are intentionally kept separate.

**Zustand** owns synchronous, session-scoped client state: the authenticated user object and auth tokens, persisted to `localStorage` so the session survives a page refresh. There is no server round-trip to read this state.

**TanStack Query** owns asynchronous server state: dashboard summaries, account lists, transaction histories, and the profile. It handles loading/error/stale states, background refetching, and cache invalidation. When `updateProfile` resolves, a single `queryClient.setQueryData` call updates the cache and every subscriber re-renders — no manual state synchronisation needed.

Mixing them would mean either: storing server data in Zustand (losing caching and background refetch) or storing session state in TanStack Query (losing persistence and running unnecessary network calls on every mount).

### shadcn/ui ownership model

shadcn components are copied into `src/components/ui/` and owned by this project rather than consumed from an npm package. The practical effect: the `Button`, `Card`, `Input`, and `Label` components can be edited directly to match design requirements without fighting library APIs, and unused components are simply never added. The trade-off is that upstream shadcn fixes require a manual copy — acceptable given how stable these primitives are.

### Transactions scoped to accounts by design

There is no top-level Transactions page in the sidebar. Transactions are always viewed in context: navigate to an account, then see its transactions with filter, sort, and pagination. This mirrors how banking applications present data — a transaction without its account context is less useful — and avoids the UX problem of a global transaction list that mixes activity across all accounts with no clear grouping.

---

## React 19 features used

| Feature | Where |
|---|---|
| `useActionState` | `ProfilePage` — manages form submission, `isPending`, and success/error state as a single action |
| `useOptimistic` | `ProfilePage` — avatar initials update immediately on save, before the mock API responds |
| `useFormStatus` | `SubmitButton` — reads `pending` from the nearest form action; works automatically when the form has `action={formAction}` |
| `use()` hook | `DashboardPage` — reads `UserContext` with `use(UserContext)` instead of `useContext` |
| React Compiler | Configured in `vite.config.ts` via `babel-plugin-react-compiler`; `useMemo`/`useCallback` are not written manually anywhere |
| Ref as prop | No `forwardRef` in the codebase; refs are passed as regular props per React 19 convention |

---

## Accessibility

- Semantic HTML throughout: `<header>`, `<main>`, `<nav>`, `<section>`, `<aside>`, `<form>`, `<button>`
- All `<input>` elements have associated `<label>` elements via `htmlFor`/`id`
- `autoComplete` attributes on every form field (`email`, `given-name`, `family-name`, `tel`, `postal-code`, etc.)
- `aria-label` on icon-only buttons (logout in mobile header, avatar upload)
- `aria-hidden="true"` on the hidden file input
- Keyboard navigation via Radix UI primitives (dropdowns, dialogs, tabs) which implement ARIA patterns
- Focus-visible ring styles on all interactive elements via Tailwind `focus-visible:ring-*`

---

## Known limitations

- **Mock data resets on page refresh.** Account balances, transaction history, and the profile all reset to fixture values on every hard reload. Edits made to the profile persist for the current session only.
- **Registered users are session-scoped.** Users created via the register form are added to the in-memory `mockUsers` array and are lost on refresh.
- **No real file upload.** Clicking the avatar triggers a file picker for UX demonstration, but no image is processed or stored.
- **Single-user mock.** `getProfile()` and `getDashboard()` always return data for `user-001`. In a real app these calls would be scoped to the authenticated session.
