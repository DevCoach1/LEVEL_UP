// Function to fetch JSON data
'use strict';

const jsonData = "./products.JSON";

async function fetchProducts(jsonData) {
    try {
        const response = await fetch(jsonData);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

// Usage example
fetchProducts(jsonData)
    .then(data => {
        var products = data;
        console.log('Fetched data:', products);

        const categories = [...new Set(products.map(product => product.categories))];

        function generateProductHTML(product, index) {
            const { name, image, description, price } = product;
            return `
                <div class="product_item">
                    <div class="image_box">
                        <img class="image" src="${image}" alt="${name}">
                    </div>
                    <div class="writings">
                        <p class="p_name">${name}</p>
                        <p class="p_category">${description}</p>
                        <p class="price">$ ${price}.00</p>
                    </div>
                    <button class="add-to-cart" data-index="${index}">Add to cart</button>
                </div>`;
        }

        // RENDER THE PRODUCT ITEMS TO THE DOM
        const root = document.querySelector('.product_center_without_cart');
        root.innerHTML = categories.map(category => {
            const productCategory = products.filter(product => product.categories === category);
            return productCategory.map((product, index) => generateProductHTML(product, index)).join('');
        }).join('');

        // Adding an Item to the cart
        var cart = [];

        function addToCart(index) {
            cart.push({ ...products[index] });
            displayCart();
        }

        // Creating an event handler for the add-to-cart button
        const button = document.querySelectorAll('.add-to-cart');
        button.forEach(button => {
            button.addEventListener('click', onClick);
        });

        function onClick(e) {
            const index = parseInt(e.target.getAttribute('data-index'));
            addToCart(index);
        }

        // deleting items from the cart
        function deleteItem(index) {
            cart.splice(index, 1);
            displayCart();
        }

        // FUNCTION TO DISPLAY CART ITEMS
        function displayCart() {
            let total = 0;
            const cartCenter = document.querySelector('.cart_center');
            const totalElement = document.querySelector('.total_amount');
            const cartCounter = document.querySelector('.count');
            cartCounter.textContent = cart.length;

            if (cart.length === 0) {
                cartCenter.textContent = "Your Cart is Empty";
                totalElement.textContent = "$0.00";
            } else {
                cartCenter.innerHTML = cart.map((item, index) => {
                    const { name, image, description, price } = item;
                    total += price;
                    return `
                        <div class="cart_center">
                            <div class="pro_img_container">
                                <img class="cart_img" src="${image}" alt="${name}">
                            </div>
                            <div class="descriptions">
                                <p class="cart_p_name">${name}</p>
                                <p class="cart_p_category">${description}</p>
                            </div>
                            <div>$ ${price}.00</div>
                            <div class="trash" data-index="${index}"><i class="fa-solid fa-trash"></i></div>
                        </div>`;
                }).join('');

                totalElement.textContent = `$ ${total.toFixed(2)}`;
            }
        }

        // ADDING EVENT HANDLER TO CART ICON
        const cartIconbutton = document.querySelector('.shopping_cart');
        cartIconbutton.addEventListener('click', onClickCartIcon);

        function onClickCartIcon() {
            const productContainer = document.querySelector('.product_center_without_cart');
            const cartContainer = document.querySelector('.remove');
            productContainer.classList.remove('product_center_without_cart');
            productContainer.classList.add('product_center_with_cart');
            cartContainer.classList.remove('remove');
            cartContainer.classList.add('add');
        }
    })
    .catch(error => {
        // Handle errors
        console.error('Failed to fetch data:', error);
    });
