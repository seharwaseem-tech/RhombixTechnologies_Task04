/* ================= FOOD DATA ================= */

const foods = [
    { id: 1, name: "Burger", price: 350, image: "images/burger.png" },
    { id: 2, name: "Pizza", price: 1200, image: "images/pizza.png" },
    { id: 3, name: "Fries", price: 250, image: "images/fries.png" },
    { id: 4, name: "Pasta", price: 800, image: "images/pasta.png" }
];


/* ================= MENU PAGE ================= */

const menuContainer = document.getElementById("menuContainer");

function displayFoods(foodList) {
    if (!menuContainer) return;

    menuContainer.innerHTML = "";

    foodList.forEach(food => {
        menuContainer.innerHTML += `
            <div class="card">
                <img src="${food.image}" alt="${food.name}">
                <h3>${food.name}</h3>
                <p>Price: Rs ${food.price}</p>
                <button onclick="addToCart(${food.id})">Add to Cart</button>
            </div>
        `;
    });
}

if (menuContainer) {

    function getProductsForHome() {
        return JSON.parse(localStorage.getItem("adminProducts")) || foods;
    }

    displayFoods(getProductsForHome());
}


/* ================= SEARCH FUNCTION ================= */

function searchFood() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const value = searchInput.value.toLowerCase();

    const filtered = foods.filter(food =>
        food.name.toLowerCase().includes(value)
    );

    displayFoods(filtered);
}


/* ================= ADD TO CART ================= */

function addToCart(id) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const selectedFood = foods.find(food => food.id === id);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: selectedFood.id,
            name: selectedFood.name,
            price: selectedFood.price,
            image: selectedFood.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Item added to cart!");
}


/* ================= LOGIN SYSTEM ================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
            alert("Please fill all fields!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const validUser = users.find(user =>
            user.email === email && user.password === password
        );

        if (validUser) {
            alert("Login Successful!");
            localStorage.setItem("loggedInUser", JSON.stringify(validUser));
            window.location.href = "index.html";
        } else {
            alert("Invalid Email or Password!");
        }
    });
}


/* ================= CREATE TEST USER ================= */

function createTestUser() {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.email === "test@gmail.com");

    if (!exists) {
        users.push({
            email: "test@gmail.com",
            password: "123456"
        });

        localStorage.setItem("users", JSON.stringify(users));
    }
}

createTestUser();


/* ================= CART PAGE ================= */

const cartContainer = document.getElementById("cartContainer");
const cartTotalElement = document.getElementById("cartTotal");

if (cartContainer && cartTotalElement) {

    function loadCart() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
            cartTotalElement.innerText = 0;
            return;
        }

        let total = 0;

        cart.forEach(item => {

            total += item.price * item.quantity;

            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-details">
                    <h4>${item.name}</h4>
                    <p>Price: Rs ${item.price}</p>
                </div>
                <div class="cart-actions">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Remove</button>
                </div>
            `;

            cartContainer.appendChild(div);
        });

        cartTotalElement.innerText = total;

        attachEvents();
    }

    function attachEvents() {

        document.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(btn.dataset.id, 1));
        });

        document.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(btn.dataset.id, -1));
        });

        document.querySelectorAll(".remove-btn").forEach(btn => {
            btn.addEventListener("click", () => removeItem(btn.dataset.id));
        });
    }

    function changeQuantity(id, delta) {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const item = cart.find(i => i.id == id);
        if (!item) return;

        item.quantity += delta;

        if (item.quantity < 1) {
            cart = cart.filter(i => i.id != id);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    function removeItem(id) {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart = cart.filter(i => i.id != id);

        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    }

    window.placeOrder = function () {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        alert("Order placed successfully! 🎉");
        localStorage.removeItem("cart");
        loadCart();
    }

    loadCart();
}



/* ================= ADMIN LOGIC ================= */

const adminProductList = document.getElementById("adminProductList");
const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const adminOrders = document.getElementById("adminOrders");

if (adminProductList) {

    function getAdminProducts() {
        return JSON.parse(localStorage.getItem("adminProducts")) || foods;
    }

    function saveAdminProducts(data) {
        localStorage.setItem("adminProducts", JSON.stringify(data));
    }

    function displayAdminProducts() {
        const products = getAdminProducts();
        adminProductList.innerHTML = "";

        totalProducts.innerText = products.length;

        products.forEach(product => {
            adminProductList.innerHTML += `
                <div class="admin-product">
                    <div>
                        <img src="${product.image}" width="60">
                        <strong>${product.name}</strong> - Rs ${product.price}
                    </div>
                    <div class="admin-actions">
                        <button class="edit-btn" onclick="adminEditProduct(${product.id})">Edit</button>
                        <button class="delete-btn" onclick="adminDeleteProduct(${product.id})">Delete</button>
                    </div>
                </div>
            `;
        });
    }

    window.adminAddProduct = function () {

        const name = document.getElementById("adminName").value.trim();
        const price = document.getElementById("adminPrice").value.trim();
        const image = document.getElementById("adminImage").value.trim();

        if (!name || !price || !image) {
            alert("Please fill all fields!");
            return;
        }

        const products = getAdminProducts();

        const newProduct = {
            id: Date.now(),
            name,
            price: Number(price),
            image
        };

        products.push(newProduct);
        saveAdminProducts(products);
        displayAdminProducts();

        document.getElementById("adminName").value = "";
        document.getElementById("adminPrice").value = "";
        document.getElementById("adminImage").value = "";
    };

    window.adminDeleteProduct = function (id) {
        let products = getAdminProducts();
        products = products.filter(p => p.id !== id);
        saveAdminProducts(products);
        displayAdminProducts();
    };

    window.adminEditProduct = function (id) {
        let products = getAdminProducts();
        const product = products.find(p => p.id === id);

        const newName = prompt("Enter new name:", product.name);
        const newPrice = prompt("Enter new price:", product.price);

        if (newName && newPrice) {
            product.name = newName;
            product.price = Number(newPrice);
            saveAdminProducts(products);
            displayAdminProducts();
        }
    };

    function displayOrders() {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        totalOrders.innerText = orders.length;
    }

    displayAdminProducts();
    displayOrders();
}