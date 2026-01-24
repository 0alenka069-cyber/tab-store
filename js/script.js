// ===== PRODUCTS =====

const products = [
    { name: "LA FLAME", price: 8799, image: "png/1.jpg" },
    { name: "SOSA", price: 8799, image: "png/2.jpg" },
    { name: "KING SLIME", price: 8799, image: "png/3.jpg" }
];


// ===== CART STATE =====

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);


// ===== TOAST =====

function showToast(text) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ===== ADD TO CART =====

function addToCart(name, price) {

    cart.push({ name, price });

    total = cart.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    showToast("🔥 Товар добавлен в корзину");
}


// ===== RENDER PRODUCTS (index.html) =====

function renderProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {
        container.innerHTML += `
            <div class="product">
                <a href="product.html?name=${encodeURIComponent(product.name)}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <p>${product.price} ₽</p>
                <button onclick="addToCart('${product.name}', ${product.price})">
                    В корзину
                </button>
            </div>
        `;
    });
}


// ===== RENDER CART =====

function renderCart() {

    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    cartItems.innerHTML = "";
    total = 0;

    cart.forEach(item => {
        total += item.price;

        cartItems.innerHTML += `
            <div class="cart-item">
                ${item.name} — ${item.price} ₽
            </div>
        `;
    });

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "Итого: " + total + " ₽";
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===== TOGGLE CART =====

function toggleCart() {
    const panel = document.getElementById("cartPanel");
    if (!panel) return;

    panel.classList.toggle("open");
}


// ===== PRODUCT PAGE AUTO LOAD =====

function loadProductPage() {

    const params = new URLSearchParams(window.location.search);
    const productName = params.get("name");

    if (!productName) return;

    const product = products.find(p => p.name === productName);
    if (!product) return;

    const nameEl = document.getElementById("productName");
    const priceEl = document.getElementById("productPrice");
    const imgEl = document.getElementById("productImage");
    const btn = document.getElementById("addToCartBtn");

    if (nameEl) nameEl.innerText = product.name;
    if (priceEl) priceEl.innerText = product.price + " ₽";
    if (imgEl) imgEl.src = product.image;

    if (btn) {
        btn.onclick = function () {
            addToCart(product.name, product.price);
        };
    }
}


// ===== CHECKOUT =====

function checkout() {

    if (cart.length === 0) {
        alert("Корзина пуста!");
        return;
    }

    const fullname = document.getElementById("fullname")?.value;
    const city = document.getElementById("city")?.value;
    const street = document.getElementById("street")?.value;
    const house = document.getElementById("house")?.value;
    const apartment = document.getElementById("apartment")?.value;
    const phone = document.getElementById("phone")?.value;

    if (!fullname || !city || !street || !house || !phone) {
        alert("Заполните все обязательные поля!");
        return;
    }

    let message = "🔥 Новый заказ TAB\n\n";

    message += "👤 Клиент:\n";
    message += `${fullname}\n`;
    message += `📞 ${phone}\n\n`;

    message += "📦 Адрес доставки:\n";
    message += `${city}, ${street}, д.${house}`;
    if (apartment) message += `, кв.${apartment}`;
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
            localStorage.setItem("cart", JSON.stringify(cart));

            renderCart();

            document.querySelectorAll(".checkout-form input")
                .forEach(input => input.value = "");
        } else {
            alert("Ошибка отправки");
        }
    })
    .catch(() => {
        alert("Сервер недоступен");
    });
}


// ===== INIT =====

document.addEventListener("DOMContentLoaded", function () {

    renderProducts();     // безопасно — внутри есть проверка
    renderCart();
    loadProductPage();
});


// ===== LOADER =====

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
    }, 600);
});
