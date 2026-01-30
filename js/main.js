import { renderProducts, renderCart, updateCartCounter, loadProductPage, toggleCart, initLogoSpin } from "./ui.js";
import { clearCart } from "./cart.js";
import { checkout } from "./checkout.js";

document.addEventListener("DOMContentLoaded", () => {

  renderProducts();
  renderCart();
  updateCartCounter();
  loadProductPage();
  initLogoSpin();

  document.getElementById("cartToggle")?.addEventListener("click", toggleCart);

  document.getElementById("clearCartBtn")?.addEventListener("click", () => {
    clearCart();
    renderCart();
    updateCartCounter();
  });

  document.getElementById("checkoutBtn")?.addEventListener("click", checkout);

  document.getElementById("cartOverlay")?.addEventListener("click", toggleCart);

  document.getElementById("closeCartBtn")?.addEventListener("click", toggleCart);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      toggleCart();
    }
  });

});
