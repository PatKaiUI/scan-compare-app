import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/layout/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Lazy loaded components
const Home = lazy(() => import("./pages/Home"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Product = lazy(() => import("./pages/Product"));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scan" element={<Scanner />} />
                <Route path="/product/:barcode" element={<Product />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
