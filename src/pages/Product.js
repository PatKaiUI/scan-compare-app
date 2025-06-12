import { useParams } from "react-router-dom";
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

function Product() {
  const { barcode } = useParams();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", barcode],
    queryFn: () => fetchProduct(barcode),
  });

  const { data: alternatives, isLoading: alternativesLoading } = useQuery({
    queryKey: ["alternatives", product?.categories_tags?.[0]],
    queryFn: () => fetchAlternativeProducts(product?.categories_tags?.[0]),
    enabled: !!product?.categories_tags?.[0],
  });

  const sustainabilityData = product ? getSustainabilityData(product) : null;

  if (productLoading) {
    return (
      <PageContainer>
        <LoadingSpinner size="lg" />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Produkt nicht gefunden
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Das Produkt mit dem Barcode {barcode} konnte nicht gefunden werden.
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Zurück zum Scanner
          </Button>
        </div>
      </PageContainer>
    );
  }

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
      {alternativesLoading ? (
        <LoadingSpinner size="md" />
      ) : alternatives && alternatives.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Nachhaltigere Alternativen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {alternatives.map((alt) => (
              <AlternativeProductCard key={alt.code} product={alt} />
            ))}
          </div>
        </div>
      ) : null}
    </PageContainer>
  );
}

export default Product;
