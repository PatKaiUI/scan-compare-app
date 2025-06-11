import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchProduct } from "../api/productAPI";
import { getSustainabilityScore } from "../utils/score";

function Product() {
  const { barcode } = useParams();
  const { data: product, isLoading } = useQuery(["product", barcode], () =>
    fetchProduct(barcode)
  );

  if (isLoading) return <p>Lade...</p>;
  if (!product) return <p>Kein Produkt gefunden</p>;

  const score = getSustainabilityScore(product);

  return (
    <div>
      <h1>{product.product_name}</h1>
      <img src={product.image_front_url} alt="Produkt" width={200} />
      <p>Marke: {product.brands}</p>
      <p>Score: {score}/100 🌿 </p>
      <p>Zutaten: {product.ingredients_text}</p>
    </div>
  );
}

export default Product;
