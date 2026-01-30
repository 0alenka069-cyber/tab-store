import { products } from "./products.js";
import { getCart, addToCart, changeQuantity, clearCart } from "./cart.js";

export function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" loading="lazy" alt="${product.name}">
        <h3>${product.name}</h3>
      </a>
      <p>${product.price} ₽</p>
    `;

    const btn = document.createElement("button");
    btn.className = "product-btn";
    btn.textContent = "В корзину";
    btn.addEventListener("click", () => {
      addToCart(product);
      renderCart();
      updateCartCounter();
    });

    card.appendChild(btn);
    container.appendChild(card);
  });
}
export function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

export function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  const cart = getCart();
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        ${item.price} ₽ × ${item.quantity}
      </div>
      <div class="qty-controls">
        <button data-index="${index}" data-delta="-1">−</button>
        <span>${item.quantity}</span>
        <button data-index="${index}" data-delta="1">+</button>
      </div>
      <div>${itemTotal} ₽</div>
    `;

    cartItems.appendChild(div);
  });

  document.querySelectorAll(".qty-controls button").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      const delta = +e.target.dataset.delta;
      changeQuantity(index, delta);
      renderCart();
      updateCartCounter();
    });
  });

  const totalElement = document.getElementById("total");
  if (totalElement) {
    totalElement.innerText = "Итого: " + total + " ₽";
  }
}

export function updateCartCounter() {
  const counter = document.getElementById("cartCounter");
  if (!counter) return;

  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  counter.innerText = totalQty;
  counter.style.display = totalQty > 0 ? "inline-block" : "none";
}

export function loadProductPage() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  if (!id) return;

  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("productName").innerText = product.name;
  document.getElementById("productPrice").innerText = product.price + " ₽";
  document.getElementById("productImage").src = product.image;

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product);
    renderCart();
    updateCartCounter();
  });
}

export function toggleCart() {
  const cart = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");

  if (!cart || !overlay) return;

  cart.classList.toggle("open");
  overlay.classList.toggle("active");
  document.body.classList.toggle("cart-open");
}


export function initLogoSpin() {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  let spinning = false;

  logo.addEventListener("mouseenter", () => {
    if (spinning) return;
    spinning = true;
    logo.classList.add("spin");
  });

  logo.addEventListener("animationend", () => {
    logo.classList.remove("spin");
    spinning = false;
  });
}
