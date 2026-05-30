# Eagle Bank – Project Context

## Stack
React 19, TypeScript 5, Vite 5, React Router v6, Zustand, TanStack Query,
React Hook Form + Zod, Tailwind CSS, shadcn/ui (Radix primitives), Vitest + Testing Library.

## Architecture
Feature-first folder structure. Each domain (auth, dashboard, accounts,
transactions, profile) is self-contained under src/features/.
Shared primitives live in src/components/ui/ (shadcn-owned code).
Mock API layer lives in src/lib/api/ — typed fixtures + simulated delays.

## React 19 conventions
- Use useActionState for all async form submissions (login, register, profile edit)
- Use useFormStatus in submit button components
- Use useOptimistic for profile save
- Use use() hook for reading context, not useContext
- Never use forwardRef — pass ref as a regular prop
- React Compiler is configured in vite.config.ts — do not add useMemo/useCallback manually

## Code conventions
- Strict TypeScript — no `any`
- All API responses are typed via interfaces in src/types/
- Components are functional only
- Tailwind for all styling — no inline styles, no CSS modules
- Design tokens defined in tailwind.config.ts (colors, fonts, spacing)