import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from '@/features/auth/context'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppRouter } from '@/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <TooltipProvider>
            <AppRouter />
          </TooltipProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
