import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-white p-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Scan & Compare 🌿
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/scan" className="card">
          <h2 className="text-xl font-semibold">📷 Produkt scannen</h2>
          <p className="text-sm text-gray-600">
            Barcode scannen und sofort bewerten lassen
          </p>
        </Link>

        <Link to="/favorites" className="card">
          <h2 className="text-xl font-semibold">⭐ Favoriten ansehen</h2>
          <p className="text-sm text-gray-600">
            Deine nachhaltigen Lieblingsprodukte
          </p>
        </Link>
      </div>
    </main>
  );
}
export default Home;
