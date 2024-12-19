// nav bar sticky
window.onscroll = function () {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
};

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

// Get the <p> element inside the top-bar
const topBarParagraph = document.querySelector(".top-bar p");

// Update the content of the <p> element
topBarParagraph.textContent = "+91 8866383170 | ashokprasadv@gmail.com";

// Select the <img> element
const logoImage = document.getElementById("logoImage");

// Set the src attribute of the <img> element dynamically
logoImage.src = "archanalogo.webp";

// Optionally, set the alt attribute
logoImage.alt = "Archana Logo";

// PRODUCT ADDITION
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    let products = JSON.parse(localStorage.getItem('products')) || [];

    const renderProducts = () => {
        productsGrid.innerHTML = ''; // Clear the grid
        products.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });
    };

    const createProductCard = (product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <button class="delete-btn" data-index="${index}" aria-label="Delete product" style="display:none;">&times;</button>
            <a href="product.html">
                <img src="${product.image || 'placeholder.jpg'}" alt="${product.title || 'Product Image'}">
            </a>
            <div class="product-info">
                <h3>${product.title || 'Product Title'}</h3>
                <p class="price">₹${product.price || '0'}</p>
                <button class="view-details-btn" onclick="window.location.href="product.html?id=${index}">View Details</button>
            </div>
        `;

        attachDeleteEvent(productCard.querySelector('.delete-btn'), index);
        return productCard;
    };

    const attachDeleteEvent = (button, index) => {
        button.addEventListener('click', () => deleteProduct(index));
    };

    const deleteProduct = (index) => {
        products.splice(index, 1); // Remove product from array
        localStorage.setItem('products', JSON.stringify(products)); // Update Local Storage
        renderProducts(); // Re-render the product list
    };

    
});

// Call updateCartCount on page load
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});


// document.getElementById("year").textContent = new Date().getFullYear();