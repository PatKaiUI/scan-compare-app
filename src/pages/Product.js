import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProduct,
  fetchAlternativeProducts,
  getSustainabilityData,
} from "../api/productAPI";

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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Produkt nicht gefunden
        </h2>
        <p className="text-xl text-gray-600">
          Das Produkt mit dem Barcode {barcode} konnte nicht gefunden werden.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">
            Produktinformationen
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12 italic">
            Nachhaltigkeitsdaten und Alternativen
          </p>

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
                    <div className="bg-green-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Nachhaltigkeits-Score
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-green-600">
                          {sustainabilityData.ecoscore.toUpperCase()}
                        </span>
                        <span className="text-gray-600">Eco-Score</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        CO2-Fußabdruck
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-blue-600">
                          {sustainabilityData.carbonFootprint.value}
                        </span>
                        <span className="text-gray-600">
                          {sustainabilityData.carbonFootprint.unit}
                        </span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Nährwert-Score
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-yellow-600">
                          {sustainabilityData.nutriscore.toUpperCase()}
                        </span>
                        <span className="text-gray-600">Nutri-Score</span>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Palmöl
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-purple-600">
                          {sustainabilityData.palmOil}
                        </span>
                      </div>
                    </div>
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
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
            </div>
          ) : alternatives && alternatives.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Nachhaltigere Alternativen
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alternatives.map((alt) => (
                  <div
                    key={alt.code}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={alt.image_url || "https://via.placeholder.com/150"}
                      alt={alt.product_name}
                      className="w-full h-48 object-contain mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {alt.product_name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-green-600">
                        {alt.ecoscore_grade?.toUpperCase()}
                      </span>
                      <span className="text-gray-600">Eco-Score</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Product;
