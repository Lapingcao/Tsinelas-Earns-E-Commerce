// =======================
// LOAD STOCK FROM LOCALSTORAGE
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const savedStock = JSON.parse(localStorage.getItem("products-stock"));

    if (savedStock) {
        savedStock.forEach(saved => {
            const prod = products.find(p => p.id === saved.id);
            if (prod) prod.stock = saved.stock;
        });
    }
});

// =======================
// MOBILE MENU
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const navLinks = document.querySelectorAll('#mobile-menu a');

    const toggleMenu = () => {
        const isExpanded = menu.classList.toggle('hidden');
        menuIcon.classList.toggle('hidden', !isExpanded);
        closeIcon.classList.toggle('hidden', isExpanded);
        button.setAttribute('aria-expanded', !isExpanded);
    };

    button?.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!menu.classList.contains('hidden')) {
                toggleMenu();
            }
        });
    });
});

// =======================
// SMOOTH PAGE TRANSITION
// =======================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');

    const internalLinks = document.querySelectorAll(
        'a[href^="index.html"], a[href^="clogs.html"], a[href^="flipflops.html"], a[href^="slides.html"], a[href^="product-detail.html"]'
    );
    const transitionDelay = 400;

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (e.target.closest('button')) return;

            const newPage = this.getAttribute('href');
            e.preventDefault();

            document.body.classList.remove('page-loaded');
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = newPage;
            }, transitionDelay);
        });
    });
});

// =======================
// ADD TO CART + STOCK SUBTRACT
// =======================
function addToCart(event, productName, quantity = 1) {
    const btn = event.target.closest('button');
    const product = products.find(p => p.name === productName);
    if (!product) {
        alert("Product not found!");
        return;
    }

    const stock = JSON.parse(localStorage.getItem("stock")) || {};
    const availableStock = stock[product.id] ?? product.stock;

    // Read selected size
    const selectedSize = document.getElementById("product-size")?.value || "Default";

    // Check if already in cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id && item.size === selectedSize);

    if (existing) {
        if (existing.quantity + quantity > availableStock) {
            alert("OUT OF STOCK");
            return;
        }
        existing.quantity += quantity;
    } else {
        if (quantity > availableStock) {
            alert("OUT OF STOCK");
            return;
        }
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.imagePlaceholder,
            size: selectedSize
        });
    }

    // Decrease stock
    stock[product.id] = availableStock - quantity;
    localStorage.setItem("stock", JSON.stringify(stock));
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    const cartCountDisplay = document.getElementById("cart-count");
    if (cartCountDisplay) {
        cartCountDisplay.textContent = cart.length;
        cartCountDisplay.classList.add('animate-bounce');
        setTimeout(() => cartCountDisplay.classList.remove('animate-bounce'), 600);
    }

    // Update stock display on page
    const stockDisplay = document.getElementById("product-stock");
    if (stockDisplay) stockDisplay.textContent = stock[product.id];

    alert(`Added ${quantity}x "${productName}" (Size ${selectedSize}) to your cart!`);

    if (btn) {
        btn.classList.add('transform', 'transition', 'duration-150', 'scale-95');
        setTimeout(() => btn.classList.remove('scale-95'), 150);
    }

    // Optional: disable button if no stock left
    if (stock[product.id] <= 0 && btn) {
        btn.textContent = "OUT OF STOCK";
        btn.disabled = true;
    }
}

// =======================
// CART COUNT UI INIT
// =======================
function updateCartCountUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.length;
    const cartCountDisplay = document.getElementById('cart-count');
    if (cartCountDisplay) cartCountDisplay.textContent = count;
}
document.addEventListener('DOMContentLoaded', updateCartCountUI);
// =======================
// Mock product data
// =======================
const products = [
  // ==================== CLOGS ====================
  { 
    id: 1, 
    name: "Comforza Clogs", 
    category: "Clogs", 
    price: 899.99, 
    color: "Black", 
    rating: 4.8,
    stock: 25,
    imagePlaceholder: "Images/Clogs/CC.png", 
    description: "Lightweight and breathable clogs designed for all–day comfort. Perfect for work, home, or casual walks."
  }, 
  { 
    id: 2, 
    name: "Cloud Cushion Clogs", 
    category: "Clogs", 
    price: 599.50, 
    color: "Black", 
    rating: 4.5,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/CCC.png",
    description: "Soft, cloud–like cushioning that reduces foot fatigue and gives you a pleasant walking experience."
  }, 
  { 
    id: 3, 
    name: "Java Clogs", 
    category: "Clogs", 
    price: 499.99, 
    color: "Black", 
    rating: 4.9,
    stock: 25,
    imagePlaceholder: "Images/Clogs/JC.png",
    description: "Durable clogs with a sleek design. Ideal for both indoor lounge and outdoor casual use."
  }, 
  { 
    id: 4, 
    name: "MaxS Clogs", 
    category: "Clogs", 
    price: 759.00, 
    color: "Cream", 
    rating: 4.7,
    stock: 25,
    imagePlaceholder: "Images/Clogs/MSC.png",
    description: "Premium cushioning paired with a clean, minimalist look — comfort meets modern style."
  }, 
  { 
    id: 5, 
    name: "Ultra X Clogs", 
    category: "Clogs", 
    price: 1249.99, 
    color: "Black", 
    rating: 4.2,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/UXC.png",
    description: "Tough yet lightweight clogs with slip-resistant soles for secure, everyday comfort."
  }, 
  { 
    id: 6, 
    name: "K1NG Clogs", 
    category: "Clogs", 
    price: 799.99, 
    color: "Black", 
    rating: 4.5,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/KC.png",
    description: "Stylish clogs built with supportive foam to keep your step comfortable all day long."
  }, 
  { 
    id: 7, 
    name: "Monster X Clogs", 
    category: "Clogs", 
    price: 1249.99, 
    color: "Black", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/MXC.png",
    description: "Aggressive, sporty design with extra heel support — built for long and active days."
  }, 
  { 
    id: 8, 
    name: "Orig1nal Clogs", 
    category: "Clogs", 
    price: 649.99, 
    color: "Brown", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/OGC.png",
    description: "A classic clog style with soft padding and lasting durability for everyday wear."
  }, 
  { 
    id: 9, 
    name: "School Clogs", 
    category: "Clogs", 
    price: 499.99, 
    color: "Black", 
    rating: 4.7,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/SC.png",
    description: "Simple, lightweight, and slip-resistant. Ideal for school, errands, and casual outings."
  }, 
  { 
    id: 10, 
    name: "Vibranium X Clogs", 
    category: "Clogs", 
    price: 2499.99, 
    color: "Brown", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Clogs/VC.png",
    description: "Premium-grade clogs built with reinforced soles for maximum durability and comfort."
  }, 
  
  // ==================== SLIDES ====================
  { 
    id: 11, 
    name: "Aura Recovery Slides", 
    category: "Slides", 
    price: 699.99, 
    color: "Black", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/ARS.png",
    description: "Designed for recovery and relaxation. Responsive foam supports tired feet after long days."
  }, 
  { 
    id: 12, 
    name: "Luxury Memory Slides", 
    category: "Slides", 
    price: 499.99, 
    color: "Black", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/LMS.png",
    description: "Memory foam cushioning molds to your feet, giving you a soft, personalized fit."
  }, 
  { 
    id: 13, 
    name: "MaxS Slides", 
    category: "Slides", 
    price: 1349.99, 
    color: "Brown", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/MSS.png",
    description: "Modern slides with soft padding and a clean style for everyday casual comfort."
  }, 
  { 
    id: 14, 
    name: "SlideSure Slides", 
    category: "Slides", 
    price: 1099.99, 
    color: "Cream", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Slides/SSS.png",
    description: "Durable sole and strong grip design — built for quick outings or relaxed indoor use."
  }, 
  { 
    id: 15, 
    name: "Ultra X Slides", 
    category: "Slides", 
    price: 999.99, 
    color: "Brown", 
    rating: 4.2,
    stock: 25, 
    imagePlaceholder: "Images/Slides/UXS.png",
    description: "Shock-absorbing soles and flexible straps provide easy comfort for daily movement."
  }, 
  { 
    id: 16, 
    name: "Dragon Slides", 
    category: "Slides", 
    price: 899.99, 
    color: "White", 
    rating: 4.7,
    stock: 25, 
    imagePlaceholder: "Images/Slides/DS.png",
    description: "Bold, stylish slides with responsive cushioning for active, everyday use."
  }, 
  { 
    id: 17, 
    name: "Aqua Slides", 
    category: "Slides", 
    price: 749.99, 
    color: "Blue", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/ES.png",
    description: "Water-friendly slides built with fast-drying materials and great grip on wet surfaces."
  }, 
  { 
    id: 18, 
    name: "Fiery Slides", 
    category: "Slides", 
    price: 599.99, 
    color: "Red", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/FS.png",
    description: "Bright, energetic slides with lightweight cushioning for casual daily use."
  }, 
  { 
    id: 19, 
    name: "RNM Slides", 
    category: "Slides", 
    price: 1099.99, 
    color: "Green", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Slides/NS.png",
    description: "Soft padded design and dependable traction — perfect for errands and indoor relaxation."
  }, 
  { 
    id: 20, 
    name: "P!nkOut Slides", 
    category: "Slides", 
    price: 1599.99, 
    color: "Pink", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Slides/PS.png",
    description: "Bold pink slides made with premium foam, adding both comfort and personality to your fit."
  }, 
  
  // ==================== FLIP-FLOPS ====================
  { 
    id: 21, 
    name: "Cascade Flip-Flops", 
    category: "Flip-Flops", 
    price: 449.99, 
    color: "Green", 
    rating: 4.3,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/CFP.png",
    description: "Lightweight and durable flip-flops built for everyday adventures and casual outings."
  }, 
  { 
    id: 22, 
    name: "Homefort Flip-Flops", 
    category: "Flip-Flops", 
    price: 749.99, 
    color: "Black", 
    rating: 4.3,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/HFFP.png",
    description: "Supportive and comfortable flip-flops made with slip-resistant grip for daily use."
  }, 
  { 
    id: 23, 
    name: "Quick-Dry Flip-Flops", 
    category: "Flip-Flops", 
    price: 1099.99, 
    color: "White", 
    rating: 4.5,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/QDFP.png",
    description: "Fast-drying material ideal for pools, showers, and watery environments — always ready to go."
  }, 
  { 
    id: 24, 
    name: "Sunset Beach Flip-Flops", 
    category: "Flip-Flops", 
    price: 599.99, 
    color: "Green", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/SSBFP.png",
    description: "Beach-friendly flip-flops with soft soles that stay comfortable during long walks."
  }, 
  { 
    id: 25, 
    name: "Ultra X Flip-Flops", 
    category: "Flip-Flops", 
    price: 1449.99, 
    color: "Brown", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/UXFP.png",
    description: "Premium comfort and durable base construction make these perfect for daily indoor and outdoor wear."
  }, 
  { 
    id: 26, 
    name: "Elegant Flip-Flops", 
    category: "Flip-Flops", 
    price: 649.99, 
    color: "Black", 
    rating: 4.3,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/EFP.png",
    description: "Lightweight flip-flops with a sleek, simple look suitable for everyday casual outfits."
  }, 
  { 
    id: 27, 
    name: "Shacket Flip-Flops", 
    category: "Flip-Flops", 
    price: 599.99, 
    color: "Black", 
    rating: 4.6,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/OGFP.png",
    description: "Comfortable and durable everyday flip-flops with slip-resistant grip support."
  }, 
  { 
    id: 28, 
    name: "Pamalo Flip-Flops", 
    category: "Flip-Flops", 
    price: 1999.99, 
    color: "Black", 
    rating: 4.9,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/PFP.png",
    description: "Premium-grade flip-flops built for comfort, style, and long-lasting durability."
  }, 
  { 
    id: 29, 
    name: "Thicc X Flip-Flops", 
    category: "Flip-Flops", 
    price: 599.99, 
    color: "Black", 
    rating: 4.4,
    stock: 25, 
    imagePlaceholder: "Images/Flip-Flops/TFP.png",
    description: "Thick, cushioned soles give a soft, bouncy feel — great for long walks and all-day wear."
  }, 
  { 
    id: 30, 
    name: "Womb4t Flip-Flops", 
    category: "Flip-Flops", 
    price: 1449.99, 
    color: "Brown", 
    rating: 4.4, 
    stock: 25,
    imagePlaceholder: "Images/Flip-Flops/WFP.png",
    description: "Stylish flip-flops with a durable base and comfortable straps for daily casual use."
  }, 
];



const createProductCard = (product) => {
    const formattedPrice = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(product.price);

    return `
        <div class="product-card bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div class="aspect-w-1 aspect-h-1 overflow-hidden">
                <img class="w-full h-auto object-cover"
                     src="${product.imagePlaceholder}"
                     alt="${product.name}">
            </div>

            <div class="p-6">
                <p class="text-sm font-semibold text-primary-indigo uppercase tracking-wider mb-1">${product.category}</p>
                <a href="product-detail.html?id=${product.id}">
                    <h3 class="text-xl font-bold text-gray-900 truncate hover:text-primary-indigo transition">${product.name}</h3>
                </a>

                <div class="flex justify-between items-center mt-3">
                    <p class="text-2xl font-extrabold text-gray-900">${formattedPrice}</p>
                    <p class="text-base text-gray-600">⭐⭐⭐⭐☆ (${product.rating})</p>
                </div>

                <a href="product-detail.html?id=${product.id}"
                class="mt-4 w-full flex items-center justify-center btn-primary
                bg-primary-indigo text-white font-semibold py-3 px-4 rounded-lg
                transition duration-300 transform hover:scale-105 active:scale-95">
                    View
                </a>
            </div>
        </div>
    `;
};


// =======================
let currentSort = "Featured";

const getSortedProducts = (list) => {
    let sorted = [...list];

    switch (currentSort) {
        case "Price: Low to High":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "Price: High to Low":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "Newest Arrivals":
            sorted.sort((a, b) => b.id - a.id);
            break;
    }

    return sorted;
};

const renderProducts = () => {
    const gridContainer = document.getElementById('product-grid');

    if (gridContainer) {
        const filtered = typeof pageCategory !== "undefined"
            ? products.filter(p => p.category === pageCategory)
            : products;

        const sorted = getSortedProducts(filtered);
        gridContainer.innerHTML = sorted.map(createProductCard).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.querySelector("select");

    sortSelect?.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderProducts();
    });
});

document.addEventListener('DOMContentLoaded', renderProducts);

// =======================
// FEATURED CAROUSEL
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const carouselData = [
        {
            img: "Images/Clogs/UXC.png",
            title: "Ultra X Clogs",
            text: "Slip-resistant and lightweight everyday comfort."
        },
        {
            img: "Images/Slides/UXS.png",
            title: "Ultra X Slides",
            text: "Super soft shock-absorbing strap support."
        },
        {
            img: "Images/Flip-Flops/SSBFP.png",
            title: "Sunset Beach Flip-Flops",
            text: "Perfect for beach walks and casual summer wear."
        }
    ];

    const imgEl = document.getElementById("carousel-img");
    const titleEl = document.getElementById("carousel-title");
    const textEl = document.getElementById("carousel-text");

    let current = 0;

    function updateCarousel() {
        // fade-out
        imgEl.style.opacity = 0;
        titleEl.style.opacity = 0;
        textEl.style.opacity = 0;

        setTimeout(() => {
            const item = carouselData[current];

            imgEl.src = item.img;
            titleEl.textContent = item.title;
            textEl.textContent = item.text;

            // fade-in
            imgEl.style.opacity = 1;
            titleEl.style.opacity = 1;
            textEl.style.opacity = 1;

            current = (current + 1) % carouselData.length;
        }, 500);
    }

    setInterval(updateCarousel, 3000); // Change every 3 seconds
});

