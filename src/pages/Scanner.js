import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";

function Scanner() {
  const navigate = useNavigate();
  const [manualInput, setManualInput] = useState("");
  const [scanAttempts, setScanAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Cleanup vorheriger Scanner
    if (scannerRef.current) {
      scannerRef.current.clear();
    }

    // Entferne alle vorherigen Elemente
    const readerElement = document.getElementById("reader");
    if (readerElement) {
      readerElement.innerHTML = "";
    }

    // Optimierte Scanner-Konfiguration für Barcodes
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 15, // Reduziert für bessere Bildqualität
        qrbox: { width: 400, height: 200 }, // Breiter für Barcodes
        aspectRatio: 2.0, // Breites Format für Barcodes
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 1.5, // Wichtig fürSchärfe
        mirror: false,
        showScanButton: false,
        showStopButton: false,
        formatsToSupport: ["EAN_13", "EAN_8", "UPC_A", "UPC_E"],
        rememberLastUsedCamera: true,
        // Barcode-spezifische Optimierungen
        videoConstraints: {
          facingMode: "environment",
          width: { min: 1280, ideal: 1920, max: 2560 },
          height: { min: 720, ideal: 1080, max: 1440 },
        },
      },
      false
    );

    scannerRef.current = scanner;

    const onScanSuccess = (decodedText) => {
      console.log("Barcode erkannt:", decodedText);
      setIsScanning(false);
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      navigate(`/product/${decodedText}`);
    };

    const onScanError = (error) => {
      // Nur relevante Fehler loggen, nicht alle Frame
      if (
        error.includes("No MultiFormat Readers were able to detect the code")
      ) {
        // Erhöhe nur alle 30Trys
        // (ca. 2 Sekunden bei 15 FPS)
        setScanAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts % 30 === 0) {
            console.warn(`Scan-Versuch ${newAttempts}: Barcode nicht erkannt`);
          }
          return newAttempts;
        });
      } else if (
        !error.includes("No MultiFormat Readers were able to detect the code")
      ) {
        console.warn("Scanner Fehler:", error);
      }
    };

    scanner.render(onScanSuccess, onScanError);
    setIsScanning(true);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setIsScanning(false);
    };
  }, [navigate]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.length >= 8) {
      navigate(`/product/${manualInput}`);
    } else {
      alert("Bitte geben Sie einen gültigen Barcode ein");
    }
  };

  return (
    <PageContainer
      title="Barcode scannen"
      subtitle="Scannen Sie den Barcode eines Produkts oder geben Sie ihn manuell ein"
    >
      <div className="max-w-2xl mx-auto">
        {/* Scanner Container */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div
            id="reader"
            className="w-full"
            style={{ maxHeight: "500px" }}
          ></div>

          {/* Scan-Status */}
          {isScanning && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 text-sm">
                Scanner aktiv - Halten Sie den Barcode vor die Kamera
              </p>
            </div>
          )}

          {/* Scan-Tipps */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Tipps für bessere Barcode-Erkennung:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Halten Sie die Kamera ruhig und parallel zum Barcode</li>
              <li>• Stellen Sie sicher, dass der Barcode gut beleuchtet ist</li>
              <li>• Halten Sie einen Abstand von 10-20cm zum Barcode</li>
              <li>• Vermeiden Sie Reflexionen und Schatten</li>
            </ul>
          </div>
        </div>

        {/* Manuelle Eingabe */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Barcode manuell eingeben
          </h2>
          <form onSubmit={handleManualSubmit} className="flex gap-4">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Barcode manuell eingeben"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button type="submit" variant="primary">
              Scannen
            </Button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}

export default Scanner;
