import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let scanner = null;

    const startScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // Stop the stream after getting permission

        scanner = new Html5QrcodeScanner("reader", {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 10,
          aspectRatio: 1.0,
        });

        scanner.render(onScanSuccess, onScanError);
        setIsScanning(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        alert(
          "Bitte erlauben Sie den Zugriff auf die Kamera, um den Barcode zu scannen."
        );
      }
    };

    const onScanSuccess = (decodedText) => {
      if (scanner) {
        scanner.clear();
        setIsScanning(false);
      }
      navigate(`/product/${decodedText}`);
    };

    const onScanError = (error) => {
      console.warn(`Scan error: ${error}`);
    };

    startScanner();

    return () => {
      if (scanner) {
        scanner.clear().catch((error) => {
          console.error("Failed to clear scanner:", error);
        });
      }
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Barcode Scanner
          </h1>

          {!isScanning && (
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Positionieren Sie den Barcode in der Mitte des Scanners
              </p>
            </div>
          )}

          <div id="reader" className="w-full max-w-md mx-auto"></div>

          {isScanning && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Scanne läuft... Halten Sie den Barcode ruhig vor die Kamera
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
