let allProducts = []; // Store full products list

// Debounce function to delay AJAX calls while typing [web:2][web:4]
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Load products from local JSON via AJAX/fetch
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        allProducts = await response.json();
        console.log('Products loaded:', allProducts.length);
    } catch (error) {
        document.getElementById('results').innerHTML = '<div class="no-results">No local JSON</div>';
        console.error('Error loading JSON:', error);
    }
}

// Search and display filtered products dynamically
function displayResults(query) {
    const resultsDiv = document.getElementById('results');
    if (!query.trim()) {
        resultsDiv.innerHTML = '';
        return;
    }

    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }

    resultsDiv.innerHTML = filtered.map(product =>
        `<div class="product">
            <span>${product.name}</span>
            <strong>$${product.price.toFixed(2)}</strong>
        </div>`
    ).join('');
}

// Debounced search handler
const debouncedSearch = debounce(displayResults, 300);

// Event listener for input (debounced)
document.getElementById('searchInput').addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Initialize on load
loadProducts();