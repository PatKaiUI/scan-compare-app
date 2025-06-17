import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/30 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            to="/"
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            Scan & Compare
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors ${
                isActive("/")
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/scan"
              className={`text-lg font-medium transition-colors ${
                isActive("/scan")
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              Scanner
            </Link>
            {location.pathname.startsWith("/product/") && (
              <span className="text-lg font-medium text-green-600 border-b-2 border-green-600">
                Produkt
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
