// ===== PRODUCTS =====

const products = [
    { name: "LA FLAME", price: 8799, image: "png/1.jpg" },
    { name: "SOSA", price: 8799, image: "png/2.jpg" },
    { name: "KING SLIME", price: 8799, image: "png/3.jpg" }
];

let cart = [];
let total = 0;

// Рендер товаров
function renderProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <img src="${product.image}">
                <h3>${product.name}</h3>
                <p>${product.price} ₽</p>
                <button onclick="addToCart('${product.name}', ${product.price})">
                    В корзину
                </button>
            </div>
        `;
    });
}

// Добавление в корзину
function addToCart(name, price) {
    cart.push({ name, price });
    total += price;
    renderCart();
}

// Отрисовка корзины
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    cart.forEach(item => {
        cartItems.innerHTML += `
            <div class="cart-item">
                ${item.name} — ${item.price} ₽
            </div>
        `;
    });

    document.getElementById("total").innerText = "Итого: " + total + " ₽";
}

// Оформление заказа
function checkout() {

    if(cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }

    const fullname = document.getElementById("fullname").value;
    const city = document.getElementById("city").value;
    const street = document.getElementById("street").value;
    const house = document.getElementById("house").value;
    const apartment = document.getElementById("apartment").value;
    const phone = document.getElementById("phone").value;

    if(!fullname || !city || !street || !house || !phone) {
        alert("Заполните все обязательные поля!");
        return;
    }

    let message = "🔥 Новый заказ TAB\n\n";

    message += "👤 Клиент:\n";
    message += `${fullname}\n`;
    message += `📞 ${phone}\n\n`;

    message += "📦 Адрес доставки:\n";
    message += `${city}, ${street}, д.${house}`;
    if(apartment) message += `, кв.${apartment}`;
    message += "\n\n";

    message += "🛍 Товары:\n";

    cart.forEach(item => {
        message += `• ${item.name} — ${item.price} ₽\n`;
    });

    message += `\n💰 Итого: ${total} ₽`;


        fetch("https://tab-backend-0vvu.onrender.com/send-order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Заказ отправлен 🔥");

            cart = [];
            total = 0;
            renderCart();

            document.querySelectorAll(".checkout-form input")
                .forEach(input => input.value = "");
        } else {
            alert("Ошибка отправки");
        }
    })
    .catch(error => {
        console.error(error);
        alert("Сервер недоступен");
    });

} // ← ВОТ ЭТОЙ СКОБКИ НЕ ХВАТАЛО


// ===== Открытие / закрытие корзины =====
function toggleCart() {
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("open");
}


// ===== Запуск после загрузки =====
document.addEventListener("DOMContentLoaded", renderProducts);
