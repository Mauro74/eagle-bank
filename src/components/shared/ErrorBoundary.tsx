import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              An unexpected error occurred. You can try reloading the page.
            </p>
            {this.state.message && (
              <p className="mt-3 rounded-md bg-muted px-4 py-2 text-xs font-mono text-muted-foreground text-left break-words">
                {this.state.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
