import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-12">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-red-100 max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h1 className="text-3xl font-black text-primary mb-4 uppercase tracking-tight">Something went wrong</h1>
            <p className="text-gray-500 mb-8 font-medium">
              We encountered an error while rendering this page. Please try refreshing or returning home.
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl text-left mb-8 overflow-auto max-h-40 border border-gray-100">
              <code className="text-xs text-red-500 font-bold">{this.state.error?.toString()}</code>
            </div>
            <button 
              onClick={() => window.location.href = '/book'}
              className="bg-primary text-accent font-black px-12 py-4 rounded-xl hover:bg-primary/90 transition-all uppercase tracking-widest text-xs"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
