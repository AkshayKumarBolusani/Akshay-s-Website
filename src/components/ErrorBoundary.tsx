"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.sectionName || "component"}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border/50 bg-bg-soft/50 p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-3/10">
              <AlertTriangle className="h-6 w-6 text-accent-3" />
            </div>
            <p className="mb-2 font-medium text-fg">
              {this.props.sectionName
                ? `Failed to load ${this.props.sectionName}`
                : "Something went wrong"}
            </p>
            <p className="mb-4 text-sm text-muted">
              This section encountered an error.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent/40 hover:bg-white/[0.04]"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  sectionName?: string
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary sectionName={sectionName}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}
