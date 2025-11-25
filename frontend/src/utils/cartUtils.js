export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};
export const updateCart = (state) => {
  // calculate.items price
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Shipping Price
  state.shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);

  // Calculate Tax Price
  const taxPrice = 0.15 * itemsPrice;
  state.taxPrice = addDecimals(taxPrice);

  // calculate total price
  state.totalPrice = addDecimals(
    itemsPrice + Number(state.shippingPrice) + Number(state.taxPrice)
  );
  localStorage.setItem("cart", JSON.stringify(state));
  return state;
};
