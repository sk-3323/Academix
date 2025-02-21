export const formatPrice = (price: number) => {
  if (price == null) price = 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
};
