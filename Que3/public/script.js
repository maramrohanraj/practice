let from = 1;
let to = 4;

// Function to load more products
function loadMoreProducts() {
    $.ajax({
        url: `/getProducts/${from}/${to}`, // Use backticks for template literals
        type: 'GET',
        success: function (products) {
            if (products.length === 0) {
                $('#load-more').hide();  // Hide the Load More button if no more products
                return;
            }

            products.forEach(product => {
                $('#product-container').append(`
                    <div class="product-item">
                        <h3>${product.name}</h3>
                        <img src="/images/${product.img}" alt="${product.name}">
                        <p>Price: $${product.price}</p>
                    </div>
                `);
            });

            // Update the range for the next batch
            from += 4;
            to += 4;
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}