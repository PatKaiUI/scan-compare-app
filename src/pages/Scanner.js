import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Scanner() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Verfügbare Kameras auflisten
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (videoInputDevices.length === 0) {
          setError("Keine Kamera gefunden");
          return;
        }

        // Erste verfügbare Kamera verwenden
        const selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          "video",
          (result, err) => {
            if (result) {
              navigate(`/product/${result.getText()}`);
              codeReader.reset();
            }
            if (err && !(err instanceof Error)) {
              setError("Fehler beim Scannen");
            }
          }
        );
      })
      .catch((err) => {
        setError("Fehler beim Zugriff auf die Kamera");
        console.error(err);
      });

    return () => codeReader.reset();
  }, [navigate]);

  return (
    <div className="p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <video id="video" style={{ width: "100%" }} />
    </div>
  );
}

export default Scanner;
