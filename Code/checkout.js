// =============================
// CART FUNCTIONS
// =============================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const countDisplay = document.getElementById("cart-count");
  
  // Only show number of items added (1 per product)
  const count = cart.length;
  if (countDisplay) countDisplay.textContent = count;
}

// =============================
// DISPLAY CART ON CHECKOUT PAGE
// =============================
function displayCart() {
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  const cart = getCart();

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
    
    // Make the card clickable to go to payment page for this item
    card.addEventListener("click", (e) => {
      // Prevent triggering if the remove button is clicked
      if (e.target.tagName.toLowerCase() === "button") return;

      // Store the selected product in localStorage temporarily
      localStorage.setItem("selectedProduct", JSON.stringify(item));

      // Navigate to payment page
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
  const confirmed = confirm(`Are you sure you want to remove "${cart[index].name}" from your cart?`);
  if (!confirmed) return;

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

  // Remove any previously selected single product
  localStorage.removeItem("selectedProduct");

  // Navigate to payment page
  window.location.href = "payment.html";
});


// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
  updateCartCount();
});
