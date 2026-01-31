import { getCart, clearCart } from "./cart.js";
import { renderCart, updateCartCounter, showToast, toggleCart } from "./ui.js";

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
    showToast("Корзина пуста");
    return;
  }

  const orderData = {
    customer: {
      fullname: document.getElementById("fullname")?.value.trim() || "",
      city: document.getElementById("city")?.value.trim() || "",
      street: document.getElementById("street")?.value.trim() || "",
      house: document.getElementById("house")?.value.trim() || "",
      apartment: document.getElementById("apartment")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || ""
    },
    items: cart,
    total: cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  };

 try {
  const response = await fetch("https://tab-backend-0vvu.onrender.com/send-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("Ошибка сервера");
  }

  
  console.log("Показываю тост");
  showToast("Тест 🚀");
  clearCart();
  renderCart();
  toggleCart(false);

} catch (error) {
  console.error(error);
  showToast("Ошибка отправки заказа ❌");
}

}






