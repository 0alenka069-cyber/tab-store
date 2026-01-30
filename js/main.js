import { products } from "./products.js";
import { addToCart } from "./cart.js";
import { renderCart, toggleCart, updateCartCounter } from "./ui.js";
import { checkout } from "./checkout.js";

document.addEventListener("DOMContentLoaded", () => {

  /* КНОПКА КОРЗИНЫ */
  document.getElementById("cartToggle")?.addEventListener("click", () => {
    renderCart();
    toggleCart(true);
  });

  document.getElementById("cartOverlay")?.addEventListener("click", () => {
    toggleCart(false);
  });

  document.getElementById("closeCartBtn")?.addEventListener("click", () => {
    toggleCart(false);
  });

  document.getElementById("checkoutBtn")?.addEventListener("click", checkout);

  /* ГЛАВНАЯ СТРАНИЦА */
  const productsContainer = document.getElementById("products");

  if (productsContainer) {
    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <a href="product.html?id=${product.id}">
          <img src="${product.image}"
               alt="${product.name}"
               loading="lazy"
               decoding="async">
          <h3>${product.name}</h3>
          <p>${product.price} ₽</p>
        </a>
        <button class="product-btn">В корзину</button>
      `;

      card.querySelector(".product-btn").addEventListener("click", () => {
        addToCart(product);
        updateCartCounter();
      });

      productsContainer.appendChild(card);
    });
  }

  /* СТРАНИЦА ТОВАРА */
  const addBtn = document.getElementById("addToCartBtn");
  const productImage = document.getElementById("productImage");

  if (addBtn && productImage) {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const product = products.find(p => p.id === id);

    if (product) {
      productImage.src = product.image;
      document.getElementById("productName").textContent = product.name;
      document.getElementById("productPrice").textContent = `${product.price} ₽`;

      addBtn.addEventListener("click", () => {
        addToCart(product);
        updateCartCounter();
      });
    }
  }

  updateCartCounter();
});

