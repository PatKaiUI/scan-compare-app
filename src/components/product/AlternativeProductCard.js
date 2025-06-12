function AlternativeProductCard({ product }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
      <img
        src={product.image_url || "https://via.placeholder.com/150"}
        alt={product.product_name}
        className="w-full h-48 object-contain mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        {product.product_name}
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-green-600">
          {product.ecoscore_grade?.toUpperCase()}
        </span>
        <span className="text-gray-600">Eco-Score</span>
      </div>
    </div>
  );
}

export default AlternativeProductCard;
