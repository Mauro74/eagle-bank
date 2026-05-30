import { createContext } from 'react'
import { useAuthStore } from './store'
import type { User } from '@/types'

// Provided at the app root. Inside RequireAuth the value is always a User,
// but the type is User | null so consumers handle the unauthenticated case.
export const UserContext = createContext<User | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
