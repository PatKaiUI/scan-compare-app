import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Scanner() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        setIsScanning(true);
        setError(null);

        // Verfügbare Kameras auflisten
        const videoInputDevices = await codeReader.listVideoInputDevices();

        if (videoInputDevices.length === 0) {
          setError(
            "Keine Kamera gefunden. Bitte stellen Sie sicher, dass eine Kamera angeschlossen ist."
          );
          return;
        }

        // Erste verfügbare Kamera verwenden
        const selectedDeviceId = videoInputDevices[0].deviceId;

        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          (result, err) => {
            if (result) {
              // Erfolgreicher Scan
              codeReader.reset();
              navigate(`/product/${result.getText()}`);
            }
            if (err && !(err instanceof Error)) {
              setError("Fehler beim Scannen. Bitte versuchen Sie es erneut.");
            }
          }
        );
      } catch (err) {
        setError(
          "Fehler beim Zugriff auf die Kamera. Bitte überprüfen Sie die Berechtigungen."
        );
        console.error(err);
      }
    };

    startScanning();

    return () => {
      codeReader.reset();
      setIsScanning(false);
    };
  }, [navigate]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Produkt scannen</h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                id="video"
                className="w-full rounded-lg border-2 border-gray-300"
                style={{ maxHeight: "400px" }}
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                    Scanne...
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Halten Sie den Barcode in die Mitte des Kamera-Bildes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scanner;
