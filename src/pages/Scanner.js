import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scanner initialisieren
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      },
      false
    );

    scannerRef.current = scanner;

    // Erfolgreicher Scan
    const onScanSuccess = (decodedText) => {
      console.log("Barcode gefunden:", decodedText);
      scanner.clear();
      navigate(`/product/${decodedText}`);
    };

    // Fehler beim Scannen
    const onScanError = (error) => {
      if (
        error.includes("No MultiFormat Readers were able to detect the code")
      ) {
        setError(
          "Barcode konnte nicht erkannt werden. Bitte versuchen Sie es erneut."
        );
      } else {
        setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
      }
    };

    // Scanner starten
    scanner.render(onScanSuccess, onScanError);
    setIsScanning(true);

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">
            Produkt scannen
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 italic">
            Scanne den Barcode und entdecke nachhaltige Alternativen
          </p>

          {/* Anleitung */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              So scannen Sie einen Barcode:
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>
                Halten Sie die Kamera ruhig und zentriert über den Barcode
              </li>
              <li>Stellen Sie sicher, dass der Barcode gut beleuchtet ist</li>
              <li>Halten Sie den Barcode parallel zur Kamera</li>
              <li>Warten Sie, bis der Scanner den Code erkennt</li>
            </ol>
          </div>

          {/* Scanner */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div id="reader" className="w-full"></div>

            {isScanning && (
              <div className="mt-4 text-center text-gray-600">
                Scanner ist aktiv. Bitte halten Sie den Barcode vor die Kamera.
              </div>
            )}
          </div>

          {/* Manuelle Eingabe */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Manuelle Eingabe
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Oder geben Sie den Barcode manuell ein:
            </p>
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Barcode eingeben"
                className="border-2 border-gray-200 rounded-lg px-4 py-2 w-full max-w-xs focus:border-green-500 focus:outline-none transition-colors duration-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/product/${e.target.value}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
