// =============================
// PAYMENT.JS - Dynamic Vouchers + Shipping Fee
// =============================

// Global variables for discounts/vouchers
let discountValue = 0;
let discountText = "";
let voucherValue = 0;
let voucherText = "";
const shippingFee = 25; // fixed shipping fee

function updateCustomerSummary() {
  const name = document.getElementById("full-name").value || "-";
  const email = document.getElementById("email").value || "-";
  const address = document.getElementById("address").value || "-";
  const method = document.getElementById("payment-method").value || "-";

  document.getElementById("summary-name").textContent = name;
  document.getElementById("summary-email").textContent = email;
  document.getElementById("summary-address").textContent = address;
  document.getElementById("summary-method").textContent = method;
}


// Load cart from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Load selected product if available, otherwise load full cart
function getPaymentItems() {
  const selected = localStorage.getItem("selectedProduct");
  if (selected) return [JSON.parse(selected)]; // single product checkout
  return getCart(); // full cart checkout
}

// Dynamically populate voucher dropdown based on subtotal
function updateVoucherOptions() {
  const subtotal = getPaymentItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  const voucherSelect = document.getElementById("voucher-select");
  if (!voucherSelect) return;

  // Always have Free Shipping
  let options = [
    { value: "FREE_SHIPPING", text: "Free Shipping", valueAmount: 25 }
  ];

  // Add vouchers based on subtotal
  if (subtotal >= 800) options.push({ value: "VOUCHER50", text: "₱50 Off", valueAmount: 50 });
  if (subtotal >= 1000) options.push({ value: "VOUCHER100", text: "₱100 Off", valueAmount: 100 });
  if (subtotal >= 2000) options.push({ value: "VOUCHER200", text: "₱200 Off", valueAmount: 200 });

  // Rebuild the select options
  const previousValue = voucherSelect.value; // remember current selection
  voucherSelect.innerHTML = "";
  options.forEach(opt => {
    const optionEl = document.createElement("option");
    optionEl.value = opt.value;
    optionEl.textContent = opt.text;
    optionEl.dataset.amount = opt.valueAmount;
    voucherSelect.appendChild(optionEl);
  });

  // Restore previous selection if still valid, otherwise default to Free Shipping
  if (Array.from(voucherSelect.options).some(o => o.value === previousValue)) {
    voucherSelect.value = previousValue;
  } else {
    voucherSelect.value = "FREE_SHIPPING";
  }
}


// Apply selected voucher manually
function applySelectedVoucher() {
  const voucherSelect = document.getElementById("voucher-select");
  if (!voucherSelect) return;

  const selectedOption = voucherSelect.options[voucherSelect.selectedIndex];
  voucherValue = parseFloat(selectedOption.dataset.amount) || 0;
  voucherText = voucherValue > 0 ? `${selectedOption.text} applied!` : "Free Shipping applied!";
}

// Display items on payment page
function displayPaymentCart() {
  const container = document.getElementById("payment-cart-items");
  const totalDisplay = document.getElementById("payment-cart-total");
  const discountDisplay = document.getElementById("payment-cart-discount");
  const voucherDisplay = document.getElementById("payment-cart-voucher");

  const items = getPaymentItems();
  container.innerHTML = "";
  let subtotal = 0;

  if (items.length === 0) {
    container.innerHTML = `<div class="text-gray-600">🛒 Your cart is empty.</div>`;
    totalDisplay.textContent = "";
    discountDisplay.textContent = "";
    voucherDisplay.textContent = "";
    return;
  }

  items.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const card = document.createElement("div");
    card.className = "flex justify-between items-center";
    card.innerHTML = `
      <div class="flex justify-between space-x-4">
        <span>${item.name} (x${item.quantity})</span>
        <span class="text-gray-600">Size: ${item.size}</span>
      </div>
      <span>₱${(item.price * item.quantity).toFixed(2)}</span>
    `;
    container.appendChild(card);
  });

  // Display shipping fee
  const shippingRow = document.createElement("div");
  shippingRow.className = "flex justify-between items-center mt-2";
  shippingRow.innerHTML = `<span>Shipping Fee:</span> <span>₱${shippingFee.toFixed(2)}</span>`;
  container.appendChild(shippingRow);

  // Update voucher dropdown dynamically and apply
  updateVoucherOptions();
  applySelectedVoucher();

  const totalAfterDiscounts = Math.max(subtotal + shippingFee - discountValue - voucherValue, 0);
  totalDisplay.textContent = `Total: ₱${totalAfterDiscounts.toFixed(2)}`;
  discountDisplay.textContent = discountText;
  voucherDisplay.textContent = voucherText;
}

// Handle payment submission
document.getElementById("payment-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const itemsToPay = getPaymentItems();
  if (itemsToPay.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const confirmed = confirm("Are you sure you want to proceed with payment?");
  if (!confirmed) return;

  const selected = localStorage.getItem("selectedProduct");

  if (selected) {
    // Single product checkout → remove that item from cart
    const selectedObj = JSON.parse(selected);
    let fullCart = getCart();
    fullCart = fullCart.filter(item => item.name !== selectedObj.name);
    localStorage.setItem("cart", JSON.stringify(fullCart));
    localStorage.removeItem("selectedProduct");
  } else {
    // Full cart checkout → clear entire cart
    localStorage.removeItem("cart");
  }

  displayPaymentCart();
  alert(`✅ Payment successful!
Thank you for your purchase.`);
  window.location.href = "index.html"; // redirect home
});

["full-name", "email", "address"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updateCustomerSummary);
});

document.getElementById("payment-method")?.addEventListener("change", updateCustomerSummary);

updateCustomerSummary();

// Apply voucher when user changes dropdown
document.getElementById("voucher-select")?.addEventListener("change", displayPaymentCart);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  displayPaymentCart();
  updateCustomerSummary(); // <-- add this
});

