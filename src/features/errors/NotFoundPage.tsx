import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
      <p className="text-8xl font-bold text-brand-100 select-none">404</p>
      <h1 className="text-2xl font-bold text-foreground mt-4">Page not found</h1>
      <p className="text-muted-foreground mt-2">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
