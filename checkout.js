// =============================
// CART FUNCTIONS
// =============================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getStock() {
  return JSON.parse(localStorage.getItem("stock")) || {};
}

function saveStock(stock) {
  localStorage.setItem("stock", JSON.stringify(stock));
}

function updateCartCount() {
  const cart = getCart();
  const countDisplay = document.getElementById("cart-count");
  const count = cart.length; // 1 per product in cart
  if (countDisplay) countDisplay.textContent = count;
}

// =============================
// DISPLAY CART ON CHECKOUT PAGE
// =============================
function displayCart() {
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  const cart = getCart();
  const stock = getStock();

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="bg-white shadow-md rounded-lg p-8 text-center text-gray-600">
        🛒 Your cart is empty.
      </div>`;
    totalDisplay.textContent = "";
    return;
  }

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const card = document.createElement("div");
    card.className = "flex flex-col sm:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-4 sm:p-6 cursor-pointer hover:shadow-2xl transition";

    // Click to go to payment for this single item
    card.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "button") return;

      localStorage.setItem("selectedProduct", JSON.stringify(item));
      window.location.href = "payment.html";
    });

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="w-32 h-32 object-cover rounded-lg">
      <div class="flex-1 sm:ml-6 mt-4 sm:mt-0">
        <h3 class="text-xl font-bold text-gray-900">${item.name}</h3>
        <p class="text-gray-600 mt-1">Size: ${item.size}</p>
        <p class="text-gray-600 mt-1">₱${item.price.toFixed(2)} × ${item.quantity}</p>
        <p class="mt-2 font-semibold text-gray-800">Subtotal: ₱${subtotal.toFixed(2)}</p>
        <button onclick="removeItem(${index})"
                class="mt-3 text-red-500 bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300 transition font-medium">
          Remove
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  totalDisplay.textContent = `Total: ₱${total.toFixed(2)}`;
}

// =============================
// REMOVE ITEM
// =============================
function removeItem(index) {
  const cart = getCart();
  if (!cart[index]) return;

  const confirmed = confirm(`Are you sure you want to remove "${cart[index].name}" from your cart?`);
  if (!confirmed) return;

  const item = cart[index];
  const stock = getStock();

  // Update stock when removing from cart
  stock[item.id] = (stock[item.id] ?? products.find(p => p.id === item.id)?.stock) + item.quantity;
  saveStock(stock);

  cart.splice(index, 1);
  saveCart(cart);

  displayCart();
  updateCartCount();
}

// =============================
// CLEAR CART
// =============================
document.getElementById("clear-cart").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is already empty!");
    return;
  }

  const confirmed = confirm("Are you sure you want to clear your entire cart?");
  if (!confirmed) return;

  // Restore stock for all items in cart
  const stock = getStock();
  cart.forEach(item => {
    stock[item.id] = (stock[item.id] ?? products.find(p => p.id === item.id)?.stock) + item.quantity;
  });
  saveStock(stock);

  localStorage.removeItem("cart");
  displayCart();
  updateCartCount();
  alert("Cart cleared!");
});

// =============================
// PROCEED TO PAYMENT
// =============================
document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  localStorage.removeItem("selectedProduct"); // clear single item selection
  window.location.href = "payment.html";
});

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateCartCount();
});
