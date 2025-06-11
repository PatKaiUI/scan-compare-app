import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Scanner() {
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader.decodeFromVideoDevice(null, "video", (result, err) => {
      if (result) {
        navigate(`/product/${result.getText()}`);
        codeReader.reset();
      }
    });
    return () => codeReader.reset();
  }, [navigate]);

  return <video id="video" style={{ width: "100%" }} />;
}

export default Scanner;
