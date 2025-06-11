import axios from "axios";

export const fetchProduct = async (barcode) => {
  const res = await axios.get(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  return res.data.product;
};
