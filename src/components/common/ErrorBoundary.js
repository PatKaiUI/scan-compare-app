import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Hier könnte man den Fehler an einen Error-Tracking-Service senden
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Oops! Etwas ist schiefgelaufen
              </h2>
              <p className="text-gray-600 mb-6">
                Wir arbeiten daran, das Problem zu beheben. Bitte versuchen Sie
                es später erneut.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Seite neu laden
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-700 font-mono">
                  {this.state.error && this.state.error.toString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
