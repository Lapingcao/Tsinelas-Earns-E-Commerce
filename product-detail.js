// product-detail.js

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"), 10);

// Safe helper to get element by id
const $ = id => document.getElementById(id);

// Load products array from script.js
if (typeof products !== "undefined" && productId) {
  const product = products.find(p => p.id === productId);

  if (product) {
    // Load stock from localStorage if exists, otherwise use product.stock
    const storedStock = JSON.parse(localStorage.getItem("stock")) || {};
    const currentStock = storedStock[product.id] ?? product.stock;

    $("product-name").textContent = product.name;
    $("product-category").textContent = product.category;
    $("product-description").textContent = product.description;
    $("product-img").src = product.imagePlaceholder;
    $("product-price").textContent = product.price.toFixed(2);
    $("product-rating").textContent = `(${product.rating})`;
    $("product-stock").textContent = currentStock;

    // Disable Add To Cart if stock is 0
    const addBtn = $("add-to-cart");
    if (currentStock <= 0 && addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = "Out of Stock";
    }
  }
}

// SINGLE add-to-cart handler
const addToCartBtn = $("add-to-cart");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const quantity = parseInt($("product-quantity")?.value, 10) || 1;
    let selectedSize = $("product-size")?.value || "Default";
    const productName = $("product-name")?.textContent?.trim();
    const product = (typeof products !== "undefined") 
      ? products.find(p => p.name === productName || p.id === productId) 
      : null;

    if (!product) {
      alert("Product not found. Please refresh the page.");
      return;
    }

    // Load current stock from localStorage
    const storedStock = JSON.parse(localStorage.getItem("stock")) || {};
    let currentStock = storedStock[product.id] ?? product.stock;

    // Check stock before adding
    if (currentStock <= 0) {
      alert("Sorry, this product is out of stock!");
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Out of Stock";
      return;
    }

    if (quantity > currentStock) {
      alert(`Only ${currentStock} item(s) left in stock!`);
      return;
    }

    // Call global addToCart
    addToCart(event, product.name, quantity);

    // Subtract stock
    currentStock -= quantity;
    $("product-stock").textContent = currentStock;

    // Save updated stock
    storedStock[product.id] = currentStock;
    localStorage.setItem("stock", JSON.stringify(storedStock));

    // Disable button if stock hits 0
    if (currentStock <= 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Out of Stock";
    }
  });
}
