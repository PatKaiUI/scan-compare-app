import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Scan & Compare 🌿
          </h1>
          <p className="text-xl text-gray-600 mb-12 italic">
            Entdecke nachhaltige Alternativen für deine täglichen Einkäufe
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Produkt scannen
              </h2>
              <p className="text-gray-600 mb-6">
                Scanne den Barcode eines Produkts, um dessen Nachhaltigkeitswert
                zu erfahren.
              </p>
              <Link
                to="/scan"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300"
              >
                Scanner starten
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Nachhaltigkeit
              </h2>
              <p className="text-gray-600 mb-6">
                Erfahre mehr über den CO2-Fußabdruck und finde
                umweltfreundlichere Alternativen.
              </p>
              <Link
                to="/scan"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
              >
                Mehr erfahren
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Warum Scan & Compare?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4">
                <div className="text-green-500 text-4xl mb-4">🌱</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Nachhaltigkeit
                </h3>
                <p className="text-gray-600">
                  Entdecke umweltfreundliche Produktalternativen
                </p>
              </div>
              <div className="p-4">
                <div className="text-blue-500 text-4xl mb-4">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Transparenz
                </h3>
                <p className="text-gray-600">
                  Erfahre mehr über den CO2-Fußabdruck deiner Produkte
                </p>
              </div>
              <div className="p-4">
                <div className="text-purple-500 text-4xl mb-4">🔄</div>
                <h3 className="font-semibold text-gray-800 mb-2">Vergleich</h3>
                <p className="text-gray-600">
                  Finde bessere Alternativen für deine Einkäufe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
