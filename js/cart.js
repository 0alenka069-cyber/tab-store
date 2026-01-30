let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.map(item => ({
  ...item,
  quantity: item.quantity || 1
}));

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function getCart() {
  return cart;
}

export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
}

export function changeQuantity(index, delta) {
  if (!cart[index]) return;

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}
