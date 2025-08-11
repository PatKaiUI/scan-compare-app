import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="backdrop-blur bg-white/70 shadow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img
            src={process.env.PUBLIC_URL + "/footprintLeaf.png"}
            alt="Logo"
            className="h-10 w-10 ml-2 align-middle"
            style={{ display: "inline-block" }}
          />
          <span className="text-2xl font-bold text-green-700 tracking-tight">
            Scan & Compare
          </span>
        </div>
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
                ? "text-green-700 border-b-2 border-green-700"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Scanner
          </Link>
          {location.pathname.startsWith("/product/") && (
            <span className="text-lg font-medium text-green-700 border-b-2 border-green-700">
              Produkt
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
