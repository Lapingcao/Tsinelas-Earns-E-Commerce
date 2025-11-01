// product-detail.js (REPLACEMENT)

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get("id"), 10);

// Safe helper to get element by id
const $ = id => document.getElementById(id);

// Populate product details if products array is available
if (typeof products !== "undefined" && productId) {
  const product = products.find(p => p.id === productId);

  if (product) {
    $("product-name").textContent = product.name;
    $("product-category").textContent = product.category;
    $("product-description").textContent = product.description;
    $("product-img").src = product.imagePlaceholder;
    $("product-price").textContent = product.price.toFixed(2);
    $("product-rating").textContent = `(${product.rating})`;
  }
}

// SINGLE add-to-cart handler (no duplicates)
const addToCartBtn = $("add-to-cart");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", (event) => {
    // Prevent the click from bubbling (prevents fade handler or other handlers from re-triggering)
    event.stopPropagation();
    event.preventDefault();

    // Read quantity and size safely
    const quantity = parseInt($("product-quantity")?.value, 10) || 1;
    let selectedSize = $("product-size")?.value;
    if (!selectedSize) selectedSize = "Default";

    // Get product name (from DOM) and find product object to ensure id & price match
    const productName = $("product-name")?.textContent?.trim();
    const product = (typeof products !== "undefined") ? products.find(p => p.name === productName || p.id === productId) : null;

    if (!product) {
      alert("Product not found. Please refresh the page.");
      return;
    }

    // Call the global addToCart function with event, productName, quantity
    // addToCart reads the DOM for size (we pass selectedSize by temporarily setting the select value if needed),
    // but to be explicit we will pass quantity and ensure addToCart uses the DOM or an override.
    // If your addToCart supports a size param, pass it; otherwise it will read DOM.
    // Here we call addToCart(event, product.name, quantity)
    addToCart(event, product.name, quantity);

    // Optional: feedback (you already have alert in addToCart)
    // If you prefer toast instead of alert, replace with showToast(...) if implemented.
  });
}
