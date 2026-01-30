// ===============================
// ===== PRODUCTS ===============
// ===============================

const products = [
    { name: "LA FLAME", price: 8799, image: "png/1.jpg" },
    { name: "SOSA", price: 8799, image: "png/2.jpg" },
    { name: "KING SLIME", price: 8799, image: "png/3.jpg" }
];


// ===============================
// ===== CART STATE =============
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cart = cart.map(item => ({
    ...item,
    quantity: item.quantity ? item.quantity : 1
}));

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// ===== TOAST ==================
// ===============================

function showToast(text) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = text;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


// ===============================
// ===== ADD TO CART ============
// ===============================

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    renderCart();
    updateCartCounter();
    showToast("🔥 Товар добавлен");
}


// ===============================
// ===== CHANGE QUANTITY ========
// ===============================

function changeQuantity(index, delta) {
    if (!cart[index]) return;

    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
    updateCartCounter();
}


// ===============================
// ===== CLEAR CART =============
// ===============================

function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateCartCounter();
    showToast("🗑 Корзина очищена");
}


// ===============================
// ===== RENDER PRODUCTS ========
// ===============================

function renderProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");
        card.className = "product";

        card.innerHTML = `
            <a href="product.html?name=${encodeURIComponent(product.name)}">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
            </a>
            <p>${product.price} ₽</p>
        `;

        const btn = document.createElement("button");
        btn.className = "product-btn";
        btn.textContent = "В корзину";
        btn.addEventListener("click", () => {
            addToCart(product.name, product.price);
        });

        card.appendChild(btn);
        container.appendChild(card);
    });
}


// ===============================
// ===== RENDER CART ============
// ===============================

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

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
                <button onclick="changeQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <div>${itemTotal} ₽</div>
        `;

        cartItems.appendChild(div);
    });

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.innerText = "Итого: " + total + " ₽";
    }
}


// ===============================
// ===== CART COUNTER ===========
// ===============================

function updateCartCounter() {
    const counter = document.getElementById("cartCounter");
    if (!counter) return;

    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    counter.innerText = totalQty;
    counter.style.display = totalQty > 0 ? "inline-block" : "none";
}


// ===============================
// ===== TOGGLE CART ============
// ===============================

function toggleCart() {
    const panel = document.getElementById("cartPanel");
    const overlay = document.getElementById("cartOverlay");

    if (!panel) return;

    panel.classList.toggle("open");

    if (overlay) {
        overlay.classList.toggle("active");
    }

    document.body.classList.toggle("cart-open");
}


// ===============================
// ===== PRODUCT PAGE ===========
// ===============================

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
        btn.className = "product-btn";
        btn.addEventListener("click", () => {
            addToCart(product.name, product.price);
        });
    }
}


// ===============================
// ===== CHECKOUT ===============
// ===============================

function checkout() {

    if (cart.length === 0) {
        alert("Корзина пуста!");
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
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    fetch("https://tab-backend-0vvu.onrender.com/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Заказ отправлен 🔥");
            clearCart();
        } else {
            alert("Ошибка отправки");
        }
    })
    .catch(() => {
        alert("Сервер недоступен");
    });
}


// ===============================
// ===== LOGO SPIN ==============
// ===============================

function initLogoSpin() {

    const logo = document.querySelector(".logo");
    if (!logo) return;

    let isSpinning = false;

    function startSpin() {
        if (isSpinning) return;

        isSpinning = true;
        logo.classList.add("spin");
    }

    logo.addEventListener("mouseenter", startSpin);
    logo.addEventListener("touchstart", startSpin);

    logo.addEventListener("animationend", () => {
        logo.classList.remove("spin");

        // небольшой трюк — принудительный reflow
        void logo.offsetWidth;

        isSpinning = false;
    });
}



// ===============================
// ===== INIT ====================
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById("cartOverlay");
    if (overlay) {
        overlay.addEventListener("click", toggleCart);
    }

    renderProducts();
    renderCart();
    updateCartCounter();
    loadProductPage();
    initLogoSpin();
});

