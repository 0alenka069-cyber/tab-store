import { getCart, clearCart } from "./cart.js";
import { renderCart, updateCartCounter, showToast} from "./ui.js";
function validateForm() {
  const fullname = document.getElementById("fullname")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();

  if (!fullname || !phone) {
    showToast("Заполните обязательные поля");
    return false;
  }
  
  const phoneRegex = /^[0-9+\-() ]{10,20}$/;
  if (!phoneRegex.test(phone)) {
    showToast("Неверный формат телефона");
    return false;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Корзина пуста");
    return false;
  }

  return true;
}
export async function checkout() {
  if (!validateForm()) return;

  const cart = getCart();
  if (!cart.length) {
    alert("Корзина пуста");
    return;
  }

  const orderData = {
    customer: {
      fullname: document.getElementById("fullname")?.value || "",
      city: document.getElementById("city")?.value || "",
      street: document.getElementById("street")?.value || "",
      house: document.getElementById("house")?.value || "",
      apartment: document.getElementById("apartment")?.value || "",
      phone: document.getElementById("phone")?.value || ""
    },
    items: cart,
    total: cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  };

  // TODO: отправка на сервер (пока mock)
  console.log("ORDER:", orderData);

  clearCart();
  renderCart();
  toggleCart(false);

  alert("Заказ оформлен!");
}

