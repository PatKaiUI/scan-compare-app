import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchAlternativeProducts,
  getSustainabilityData,
} from "../api/productAPI";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SustainabilityCard from "../components/product/SustainabilityCard";
import AlternativeProductCard from "../components/product/AlternativeProductCard";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/common/Button";
import { usePerformanceMeasure } from "../utils/performance";
import performanceMonitor from "../utils/performance";

function Product() {
  const { barcode } = useParams();
  const navigate = useNavigate();
  const measureRender = usePerformanceMeasure("Product");

  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => {
      const startTime = performance.now();
      return fetchProduct(barcode).then((result) => {
        performanceMonitor.measureApiCall("fetchProduct", startTime);
        return result;
      });
    },
    staleTime: 5 * 60 * 1000, // 5 Minuten
    retry: 1,
    onError: (error) => {
      console.error("Fehler beim Laden des Produkts:", error);
    },
  });

  const { data: alternatives, isLoading: isLoadingAlternatives } = useQuery({
    queryKey: ["alternatives", product?.categories_tags],
    queryFn: () => {
      const startTime = performance.now();
      return fetchAlternativeProducts(product?.categories_tags).then(
        (result) => {
          performanceMonitor.measureApiCall("fetchAlternatives", startTime);
          return result;
        }
      );
    },
    enabled: !!product?.categories_tags,
    staleTime: 5 * 60 * 1000, // 5 Minuten
    retry: 1,
  });

  useEffect(() => {
    const cleanup = measureRender();
    return () => {
      if (cleanup) cleanup();
    };
  }, [product, alternatives, measureRender]);

  if (isLoadingProduct) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" />
      </PageContainer>
    );
  }

  if (productError) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Produkt nicht gefunden
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Das Produkt mit dem Barcode {barcode} konnte nicht gefunden werden.
          </p>
          <Button variant="primary" onClick={() => navigate("/scan")}>
            Zurück zum Scanner
          </Button>
        </div>
      </PageContainer>
    );
  }

  const sustainabilityData = getSustainabilityData(product);

  return (
    <PageContainer
      title="Produktinformationen"
      subtitle="Nachhaltigkeitsdaten und Alternativen"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Produktbild */}
          <div className="w-full md:w-1/3">
            <img
              src={product.image_url || "https://via.placeholder.com/300"}
              alt={product.product_name}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          {/* Produktinformationen */}
          <div className="w-full md:w-2/3">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {product.product_name}
            </h2>

            {/* Nachhaltigkeitsinformationen */}
            {sustainabilityData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <SustainabilityCard
                  title="Nachhaltigkeits-Score"
                  value={sustainabilityData.ecoscore.toUpperCase()}
                  color="green"
                />
                <SustainabilityCard
                  title="CO2-Fußabdruck"
                  value={sustainabilityData.carbonFootprint.value}
                  unit={sustainabilityData.carbonFootprint.unit}
                  color="blue"
                />
                <SustainabilityCard
                  title="Nährwert-Score"
                  value={sustainabilityData.nutriscore.toUpperCase()}
                  color="yellow"
                />
                <SustainabilityCard
                  title="Palmöl"
                  value={sustainabilityData.palmOil}
                  color="purple"
                />
              </div>
            )}

            {/* Labels und Zertifizierungen */}
            {sustainabilityData?.labels.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Labels & Zertifizierungen
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sustainabilityData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {label.replace("en:", "")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Produkte */}
      {isLoadingAlternatives ? (
        <LoadingSpinner size="md" />
      ) : alternatives && alternatives.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nachhaltigere Alternativen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alternatives.map((alt) => (
              <AlternativeProductCard
                key={alt.code}
                product={alt}
                onClick={() => navigate(`/product/${alt.code}`)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}

export default Product;
