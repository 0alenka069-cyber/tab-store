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

export function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

export function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}
