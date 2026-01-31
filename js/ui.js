import { getCart, changeQuantity, removeFromCart, clearCart } from "./cart.js";

const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const cartCounter = document.getElementById("cartCounter");
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

export function toggleCart(force) {
  const open = force !== undefined ? force : !cartPanel.classList.contains("open");

  cartPanel.classList.toggle("open", open);
  cartOverlay.classList.toggle("active", open);
  document.body.classList.toggle("cart-open", open);
}

export function updateCartCounter() {
  const totalQty = getCart().reduce((sum, i) => sum + i.quantity, 0);
  cartCounter.textContent = totalQty;
  cartCounter.style.display = totalQty > 0 ? "block" : "none";
}
export function renderCart() {
  if (!cartItems || !totalEl) return;

  const cart = getCart();
  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML = "<p>Корзина пуста</p>";
    totalEl.textContent = "Итого: 0 ₽";
    updateCartCounter();
    return;
  }

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="qty-controls">
        <button data-id="${item.id}" data-delta="-1">−</button>
        <span>${item.quantity}</span>
        <button data-id="${item.id}" data-delta="1">+</button>
      </div>
      <button data-remove="${item.id}">✖</button>
    `;
    cartItems.appendChild(div);
  });

  totalEl.textContent = `Итого: ${total} ₽`;
  updateCartCounter();
}
export function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("show");

  void toast.offsetWidth; // перезапуск анимации

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* Делегирование событий */
if (cartItems) {
  cartItems.addEventListener("click", e => {
    const btn = e.target;

    if (btn.dataset.delta) {
      changeQuantity(+btn.dataset.id, +btn.dataset.delta);
      renderCart();
    }

    if (btn.dataset.remove) {
      removeFromCart(+btn.dataset.remove);
      renderCart();
    }
  });
} // ← ВОТ ЭТОЙ СКОБКИ НЕ ХВАТАЛО

document.getElementById("clearCartBtn")?.addEventListener("click", () => {
  clearCart();
  renderCart();
});






