
async function addToCart(productId, title, price, mainImage, quantity = 1) {
    console.log(`Attempting to add product: ${productId}, Quantity: ${quantity}`);
    try {
        const productDetails = await fetchProductDetails(productId);
        if (!productDetails) return;

        const availableStock = productDetails.stock;
        console.log(`Available stock for product ${productId}: ${availableStock}`);

        if (!availableStock || availableStock < 1) {
            alert("This product is out of stock.");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        console.log("Initial cart state:", cart);

        const existingProduct = cart.find(item => item.productId === productId);

        if (existingProduct) {
            console.log(`Existing product quantity: ${existingProduct.quantity}`);
            if (existingProduct.quantity + quantity > availableStock) {
                alert(`Only ${availableStock} items are available. You already have ${existingProduct.quantity} in the cart.`);
                return;
            }
            existingProduct.quantity += quantity; // Increment quantity
            console.log(`Updated quantity for product ${productId}: ${existingProduct.quantity}`);
        } else {
            console.log(`Adding new product: ${productId} to cart`);
            cart.push({
                productId,
                title,
                price: parseFloat(price),
                mainImage: mainImage || "default_image.jpg",
                quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Updated cart state:", cart);

        updateCartCount();
        alert(`${title} added to the cart.`);
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}


async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://dc-1-fqlb.onrender.com/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const productDetails = await response.json();
        console.log("Fetched product details:", productDetails); // Debug log
        return productDetails;
    } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to fetch product details. Please try again.");
        return null;
    }
}





function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    const cartCountElem = document.getElementById('cartCount');
    if (cartCountElem) {
        cartCountElem.innerText = cartCount;
    }
}

function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart items:", cart); // Debugging: Ensure cart data is correct

    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        const total = item.price * item.quantity || 0;
        subtotal += total;

        cartContainer.innerHTML += `
            <div class="cart-item" id="cart-item-${item.productId}">
                <img src="${item.mainImage}" alt="${item.title}" style="width: 100px;">
                <div>
                    <h4>${item.title}</h4>
                    <p>Price: ₹${item.price}</p>
                    <div class="quantity-controls">
                        <button onclick="updateCartItem('${item.productId}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartItem('${item.productId}', 1)">+</button>
                    </div>
                    <p>Total: ₹${total.toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.productId}')">Remove</button>
                </div>
            </div>
        `;
    });

    const gst = subtotal * 0.05;
    const grandTotal = subtotal + gst;

    document.getElementById('subtotalAmount').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('gstAmount').innerText = `₹${gst.toFixed(2)}`;
    document.getElementById('grandTotalAmount').innerText = `₹${grandTotal.toFixed(2)}`;
}

   

document.addEventListener("DOMContentLoaded", () => {
    displayCartItems();
});

function updateCartItem(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        
        // Update quantity
        item.quantity += change;

        // Ensure quantity is at least 1
        if (item.quantity < 1) {
            item.quantity = 1;
            alert("Quantity cannot be less than 1. Use 'Remove' to delete the item.");
        }

        // Save updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Re-render cart items
        displayCartItems();
    }
}



function goToCheckout() {
    const userId = localStorage.getItem('userId'); // Check user login status

    if (!userId) {
        // Open login modal if user is not logged in
        alert("Please log in to proceed to checkout.");
        document.getElementById('login-modal').style.display = 'block'; // Display the login modal
        return;
    }

    // Retrieve the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Debugging: Log the cart and userId
    console.log("Cart:", cart);
    console.log("User ID:", userId);

    // Check if userId is set on cart items; fallback to all items if not implemented
    const userCart = cart.filter(item => item.userId === userId || !item.userId);

    // Debugging: Log the filtered userCart
    console.log("User Cart:", userCart);

    // Check if the user's cart is empty
    if (userCart.length === 0) {
        alert("Your cart is empty. Add items to your cart before proceeding to checkout.");
        return;
    }

    // Save user-specific cart details before navigating to checkout
    localStorage.setItem('userCart', JSON.stringify(userCart)); // Store user cart separately

    // Navigate to checkout page
    window.location.href = 'checkout.html';
}


console.log("User ID from localStorage:", userId);

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove product from cart
    cart = cart.filter(item => item.productId !== productId);

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Refresh cart display and update totals
    displayCartItems();
    updateCartCount();
}



function updateCartSummary() {
    let subtotal = 0;

    // Get the cart items from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Calculate the subtotal by summing up the total price for each product (price * quantity)
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
    });

    // Calculate GST (5% of subtotal)
    const gst = subtotal * 0.05;
    const grandTotal = subtotal + gst;

    // Update the DOM with the new cart summary
    document.getElementById('subtotalAmount').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('gstAmount').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('grandTotalAmount').textContent = `₹${grandTotal.toFixed(2)}`;
}
