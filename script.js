// =====================================
// ARD ENTERPRISES
// MAIN JAVASCRIPT
// =====================================


// =====================================
// WHATSAPP ORDER
// =====================================

function orderWhatsApp(productName, price) {

    const phoneNumber = "919857746076";

    const message =
        "Hello ARD Enterprises,%0A%0A" +
        "I want to order:%0A" +
        "Product: " + productName + "%0A" +
        "Price: ₹" + price + "%0A" +
        "Quantity: 1";

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        message;

    window.open(whatsappURL, "_blank");
}


// =====================================
// PRODUCT DATA
// =====================================

let products =
    JSON.parse(localStorage.getItem("ardProducts")) || [];


// =====================================
// STOCK HISTORY
// =====================================

let stockHistory =
    JSON.parse(
        localStorage.getItem("ardStockHistory")
    ) || [];


// =====================================
// EDITING PRODUCT ID
// =====================================

let editingProductId = null;


// =====================================
// STOCK MODE
// =====================================

let stockMode = "in";


// =====================================
// OPEN ADD PRODUCT FORM
// =====================================

function showAddProduct() {

    const modal =
        document.getElementById("productModal");

    if (!modal) return;

    editingProductId = null;

    const form =
        document.getElementById("productForm");

    if (form) {
        form.reset();
    }

    const title =
        document.querySelector(".modal-header h2");

    if (title) {
        title.textContent = "Add New Product";
    }

    const saveButton =
        document.querySelector(".save-product-btn");

    if (saveButton) {
        saveButton.textContent = "Save Product";
    }

    modal.classList.add("show");
}


// =====================================
// CLOSE PRODUCT FORM
// =====================================

function closeAddProduct() {

    const modal =
        document.getElementById("productModal");

    if (modal) {
        modal.classList.remove("show");
    }

    editingProductId = null;
}


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayProducts() {

    const tableBody =
        document.getElementById("productTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (products.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="text-align:center; padding:30px;">
                    No products added yet.
                </td>
            </tr>
        `;

        return;
    }


    products.forEach(function(product) {

        let status = "Available";
        let statusClass = "available";


        if (product.stock === 0) {

            status = "Out of Stock";
            statusClass = "out";

        } else if (product.stock <= 10) {

            status = "Low Stock";
            statusClass = "low";

        }


        tableBody.innerHTML += `

            <tr>

                <td>

                    ${
                        product.image
                        ? `
                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                style="
                                    width:50px;
                                    height:50px;
                                    object-fit:cover;
                                    border-radius:6px;
                                    margin-right:10px;
                                    vertical-align:middle;
                                "
                            >
                          `
                        : ""
                    }

                    <strong>
                        ${product.name}
                    </strong>

                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ₹${product.price}
                </td>

                <td>
                    ${product.stock}
                </td>

                <td>

                    <span class="status ${statusClass}">
                        ${status}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editProduct(${product.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteProduct(${product.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// =====================================
// EDIT PRODUCT
// =====================================

function editProduct(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product) {

        alert("Product not found.");

        return;
    }


    document.getElementById("productName").value =
        product.name;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productPrice").value =
        product.price;

    document.getElementById("productStock").value =
        product.stock;

    document.getElementById("productCode").value =
        product.code || "";

    document.getElementById("productDescription").value =
        product.description || "";


    editingProductId = productId;


    const title =
        document.querySelector(".modal-header h2");

    if (title) {

        title.textContent = "Edit Product";

    }


    const saveButton =
        document.querySelector(".save-product-btn");

    if (saveButton) {

        saveButton.textContent = "Save Changes";

    }


    const modal =
        document.getElementById("productModal");

    if (modal) {

        modal.classList.add("show");

    }

}


// =====================================
// READ PRODUCT IMAGE
// =====================================

function readProductImage(file) {

    return new Promise(function(resolve) {

        if (!file) {

            resolve(null);

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function(event) {

            resolve(event.target.result);

        };


        reader.readAsDataURL(file);

    });

}


// =====================================
// SAVE / UPDATE PRODUCT
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const productForm =
            document.getElementById("productForm");


        displayProducts();

        displayStockHistory();
displayCustomerOrders();
updateOrderSummary();
updateSalesReport();
if (!productForm) return;


        productForm.addEventListener(
            "submit",
            async function(event) {

                event.preventDefault();


                const productName =
                    document.getElementById(
                        "productName"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "productCategory"
                    ).value;


                const price =
                    document.getElementById(
                        "productPrice"
                    ).value;


                const stock =
                    document.getElementById(
                        "productStock"
                    ).value;


                const productCode =
                    document.getElementById(
                        "productCode"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "productDescription"
                    ).value.trim();


                const imageInput =
                    document.getElementById(
                        "productImage"
                    );


                const imageFile =
                    imageInput
                    ? imageInput.files[0]
                    : null;


                // =================================
                // IMAGE
                // =================================

                let imageData = null;


                if (imageFile) {

                    imageData =
                        await readProductImage(
                            imageFile
                        );

                }


                // =================================
                // UPDATE EXISTING PRODUCT
                // =================================

                if (editingProductId !== null) {

                    const index =
                        products.findIndex(
                            function(item) {

                                return item.id ===
                                    editingProductId;

                            }
                        );


                    if (index !== -1) {

                        products[index] = {

                            ...products[index],

                            name: productName,

                            category: category,

                            price: Number(price),

                            stock: Number(stock),

                            code: productCode,

                            description: description,

                            // अगर नई image चुनी है
                            // तभी पुरानी image replace होगी
                            image:
                                imageData ||
                                products[index].image ||
                                null

                        };

                    }


                    alert(
                        "Product updated successfully!"
                    );

                }


                // =================================
                // ADD NEW PRODUCT
                // =================================

                else {

                    products.push({

                        id: Date.now(),

                        name: productName,

                        category: category,

                        price: Number(price),

                        stock: Number(stock),

                        code: productCode,

                        description: description,

                        image: imageData

                    });


                    alert(
                        "Product successfully added!"
                    );

                }


                // =================================
                // SAVE PRODUCTS
                // =================================

                localStorage.setItem(
                    "ardProducts",
                    JSON.stringify(products)
                );


                productForm.reset();

                editingProductId = null;

                closeAddProduct();


                displayProducts();

            }
        );

    }
);


// =====================================
// DELETE PRODUCT
// =====================================

function deleteProduct(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product) {

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete " +
            product.name +
            "?"
        );


    if (!confirmDelete) {

        return;

    }


    products =
        products.filter(function(item) {

            return item.id !== productId;

        });


    localStorage.setItem(
        "ardProducts",
        JSON.stringify(products)
    );


    displayProducts();


    alert(
        "Product deleted successfully!"
    );

}


// =====================================
// STOCK MANAGEMENT
// =====================================

function openStockIn() {

    stockMode = "in";

    document.getElementById(
        "stockModalTitle"
    ).textContent = "Stock In";

    loadStockProducts();

    document.getElementById(
        "stockModal"
    ).classList.add("show");

}


function openStockOut() {

    stockMode = "out";

    document.getElementById(
        "stockModalTitle"
    ).textContent = "Stock Out";

    loadStockProducts();

    document.getElementById(
        "stockModal"
    ).classList.add("show");

}


// =====================================
// CLOSE STOCK MODAL
// =====================================

function closeStockModal() {

    const modal =
        document.getElementById(
            "stockModal"
        );

    if (modal) {

        modal.classList.remove("show");

    }


    const form =
        document.getElementById(
            "stockForm"
        );

    if (form) {

        form.reset();

    }

}


// =====================================
// LOAD PRODUCTS IN STOCK DROPDOWN
// =====================================

function loadStockProducts() {

    const select =
        document.getElementById(
            "stockProduct"
        );


    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Product
        </option>
    `;


    products.forEach(function(product) {

        select.innerHTML += `

            <option value="${product.id}">

                ${product.name}
                — Current Stock: ${product.stock}

            </option>

        `;

    });

}


// =====================================
// STOCK FORM
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const stockForm =
            document.getElementById(
                "stockForm"
            );


        if (!stockForm) return;


        stockForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const productId =
                    Number(
                        document.getElementById(
                            "stockProduct"
                        ).value
                    );


                const quantity =
                    Number(
                        document.getElementById(
                            "stockQuantity"
                        ).value
                    );


                const remarks =
                    document.getElementById(
                        "stockRemarks"
                    ).value.trim();


                if (
                    !productId ||
                    quantity <= 0
                ) {

                    alert(
                        "Please select product and enter quantity."
                    );

                    return;

                }


                const product =
                    products.find(function(item) {

                        return item.id ===
                            productId;

                    });


                if (!product) {

                    alert(
                        "Product not found."
                    );

                    return;

                }


                // =================================
                // STOCK IN
                // =================================

                if (stockMode === "in") {

                    product.stock += quantity;


                    alert(
                        quantity +
                        " units added to " +
                        product.name
                    );

                }


                // =================================
                // STOCK OUT
                // =================================

                else {

                    if (
                        quantity >
                        product.stock
                    ) {

                        alert(
                            "Stock Out quantity cannot be greater than current stock."
                        );

                        return;

                    }


                    product.stock -= quantity;


                    alert(
                        quantity +
                        " units removed from " +
                        product.name
                    );

                }


                // =================================
                // SAVE PRODUCTS
                // =================================

                localStorage.setItem(
                    "ardProducts",
                    JSON.stringify(products)
                );


                // =================================
                // STOCK HISTORY
                // =================================

                stockHistory.unshift({

                    id: Date.now(),

                    date:
                        new Date()
                        .toLocaleString("en-IN"),

                    productName:
                        product.name,

                    type:
                        stockMode === "in"
                        ? "Stock In"
                        : "Stock Out",

                    quantity:
                        stockMode === "in"
                        ? quantity
                        : -quantity,

                    stockAfter:
                        product.stock,

                    remarks:
                        remarks || "-"

                });


                localStorage.setItem(
                    "ardStockHistory",
                    JSON.stringify(
                        stockHistory
                    )
                );


                displayStockHistory();


                closeStockModal();


                displayProducts();

            }
        );

    }
);


// =====================================
// DISPLAY STOCK HISTORY
// =====================================

function displayStockHistory() {

    const historyBody =
        document.getElementById(
            "stockHistoryBody"
        );


    if (!historyBody) {

        return;

    }


    historyBody.innerHTML = "";


    if (stockHistory.length === 0) {

        historyBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No stock transactions yet.

                </td>

            </tr>

        `;

        return;

    }


    stockHistory.forEach(
        function(record) {

            const quantityText =
                record.quantity > 0
                ? "+" + record.quantity
                : record.quantity;


            const typeClass =
                record.type === "Stock In"
                ? "history-in"
                : "history-out";


            historyBody.innerHTML += `

                <tr>

                    <td>
                        ${record.date}
                    </td>

                    <td>

                        <strong>
                            ${record.productName}
                        </strong>

                    </td>

                    <td>

                        <span
                            class="
                                history-type
                                ${typeClass}
                            "
                        >

                            ${record.type}

                        </span>

                    </td>

                    <td>
                        ${quantityText}
                    </td>

                    <td>
                        ${record.stockAfter}
                    </td>

                    <td>
                        ${record.remarks}
                    </td>

                </tr>

            `;

        }
    );

}// =====================================
// CUSTOMER PRODUCT CATALOGUE
// =====================================

function displayCustomerProducts() {

    const grid =
        document.getElementById(
            "customerProductGrid"
        );

    if (!grid) return;


    const customerProducts =
        JSON.parse(
            localStorage.getItem("ardProducts")
        ) || [];


    grid.innerHTML = "";


    if (customerProducts.length === 0) {

        grid.innerHTML = `
            <p>
                Products coming soon.
            </p>
        `;

        return;
    }


    customerProducts.forEach(function(product) {

        let imageHTML = "";


        if (product.image) {

            imageHTML = `
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            `;

        } else {

            imageHTML = `
                <div
                    class="customer-product-image-empty"
                >
                    ⚡
                </div>
            `;

        }


        let stockText = "";
        let buttonText = "Order on WhatsApp";


        if (product.stock <= 0) {

            stockText =
                "Out of Stock";

            buttonText =
                "Out of Stock";

        } else if (product.stock <= 10) {

            stockText =
                "Only " +
                product.stock +
                " left";

        } else {

            stockText =
                "In Stock";

        }


        grid.innerHTML += `

            <div
                class="customer-product-card"
            >

                ${imageHTML}

                <div
                    class="customer-product-info"
                >

                    <h3>
                        ${product.name}
                    </h3>

                    <div
                        class="customer-product-category"
                    >
                        ${product.category}
                    </div>

                    <div
                        class="customer-product-price"
                    >
                        ₹${product.price}
                    </div>

                    <div
                        class="customer-product-stock"
                    >
                        ${stockText}
                    </div>
<div class="quantity-control">

    <button
        onclick="changeQuantity(${product.id}, -1)">
        −
    </button>

    <span id="quantity-${product.id}">
        1
    </span>

    <button
        onclick="changeQuantity(${product.id}, 1)">
        +
    </button>

</div>
                    <button
                        class="customer-product-btn"
                        ${
                            product.stock <= 0
                            ? "disabled"
                            : ""
                        }
                       onclick="openOrderModal(${product.id})"
                    >
                        ${buttonText}
                    </button>
<button
    class="customer-cart-btn"
    ${
        product.stock <= 0
        ? "disabled"
        : ""
    }
    onclick="addToCart(${product.id})"
>
    🛒 Add to Cart
</button>
                </div>

            </div>

        `;

    });

}


// =====================================
// LOAD CUSTOMER PRODUCTS
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayCustomerProducts();

    }
);// =====================================
// CUSTOMER QUANTITY
// =====================================

function changeQuantity(productId, change) {

    const quantityElement =
        document.getElementById("quantity-" + productId);

    if (!quantityElement) return;

    let quantity =
        Number(quantityElement.textContent);

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) return;

    quantity += change;

    if (quantity < 1) {
        quantity = 1;
    }

    if (quantity > product.stock) {
        quantity = product.stock;
    }

    quantityElement.textContent = quantity;
}// =====================================
// CART CHECKOUT
// =====================================

function checkoutCart() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    const orderModal =
        document.getElementById("orderModal");

    if (orderModal) {

        orderModal.style.display = "flex";

    }

    const orderProductName =
        document.getElementById(
            "orderProductName"
        );

    if (orderProductName) {

        orderProductName.textContent =
            cart.map(function(item) {

                return (
                    item.name +
                    " × " +
                    item.quantity
                );

            }).join(", ");

    }

    const quantityInput =
        document.getElementById(
            "customerQuantity"
        );

    if (quantityInput) {

        quantityInput.value = 1;

    }

}
// =====================================
// CUSTOMER CART
// =====================================

let cart = JSON.parse(
    localStorage.getItem("ardCart")
) || [];


function addToCart(productId) {

    const products =
        JSON.parse(
            localStorage.getItem("ardProducts")
        ) || [];

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) return;

    const quantityElement =
        document.getElementById(
            "quantity-" + productId
        );

    const quantity =
        quantityElement
            ? Number(quantityElement.textContent)
            : 1;

    const existingItem =
        cart.find(function(item) {
            return item.id === productId;
        });

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: quantity
        });

    }

    localStorage.setItem(
        "ardCart",
        JSON.stringify(cart)
    );

    alert(
        product.name +
        " added to cart."
    );
}

// =====================================
// WHATSAPP ORDER WITH QUANTITY
// =====================================

function orderProductWhatsApp(productId) {

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) return;

    const quantityElement =
        document.getElementById("quantity-" + productId);

    const quantity =
        Number(quantityElement.textContent);

    const total =
        product.price * quantity;

    const phoneNumber = "919857746076";

    const message =
        "Hello ARD Enterprises,%0A%0A" +
        "I want to order:%0A" +
        "Product: " + product.name + "%0A" +
        "Quantity: " + quantity + "%0A" +
        "Price: ₹" + product.price + "%0A" +
        "Total: ₹" + total;

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        message;

    window.open(whatsappURL, "_blank");
}// =====================================
// CUSTOMER ORDER FORM
// =====================================

let selectedOrderProduct = null;


function openOrderModal(productId) {

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) return;

    if (product.stock <= 0) {
        alert("This product is currently out of stock.");
        return;
    }

    selectedOrderProduct = product;

    document.getElementById("orderProductName").textContent =
        product.name + " — ₹" + product.price;

    document.getElementById("customerQuantity").value = 1;

    
    document.getElementById("orderModal").classList.add("show");
}


// =====================================
// CLOSE ORDER FORM
// =====================================

function closeOrderModal() {

    const modal =
        document.getElementById("orderModal");

    if (modal) {
        modal.classList.remove("show");
    }

    selectedOrderProduct = null;
}

// =====================================
// SUBMIT CUSTOMER ORDER
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const orderForm =
            document.getElementById(
                "customerOrderForm"
            );

        if (!orderForm) return;


        orderForm.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const customerName =
                    document.getElementById(
                        "customerName"
                    ).value.trim();


                const customerMobile =
                    document.getElementById(
                        "customerMobile"
                    ).value.trim();


                const quantity =
                    Number(
                        document.getElementById(
                            "customerQuantity"
                        ).value
                    );


                if (
                    !customerName ||
                    !customerMobile ||
                    quantity < 1
                ) {

                    alert(
                        "Please fill all details."
                    );

                    return;
                }


                // =====================================
                // CREATE ORDER ITEMS
                // =====================================

                let orderItems = [];


                // CART ORDER

                if (cart.length > 0) {

                    orderItems =
                        cart.map(function(item) {

                            return {

                                productName:
                                    item.name,

                                quantity:
                                    Number(
                                        item.quantity
                                    ),

                                price:
                                    Number(
                                        item.price
                                    ),

                                total:
                                    Number(
                                        item.price
                                    ) *
                                    Number(
                                        item.quantity
                                    )

                            };

                        });


                // SINGLE PRODUCT ORDER

                } else if (selectedOrderProduct) {

                    orderItems = [

                        {

                            productName:
                                selectedOrderProduct.name,

                            quantity:
                                quantity,

                            price:
                                Number(
                                    selectedOrderProduct.price
                                ),

                            total:
                                Number(
                                    selectedOrderProduct.price
                                ) *
                                quantity

                        }

                    ];

                }


                if (orderItems.length === 0) {

                    alert(
                        "No product selected."
                    );

                    return;
                }


                // =====================================
                // CALCULATE GRAND TOTAL
                // =====================================

                const total =
                    orderItems.reduce(
                        function(sum, item) {

                            return sum +
                                Number(item.total);

                        },
                        0
                    );


                // =====================================
                // LOAD CUSTOMER ORDERS
                // =====================================

                let customerOrders =
                    JSON.parse(
                        localStorage.getItem(
                            "ardOrders"
                        )
                    ) || [];


                // =====================================
                // CREATE ORDER
                // =====================================

                const orderId =
                    "ORD-" +
                    Date.now();


                const newOrder = {

                    id:
                        orderId,

                    date:
                        new Date().toLocaleString(
                            "en-IN"
                        ),

                    customerName:
                        customerName,

                    customerMobile:
                        customerMobile,

                    items:
                        orderItems,

                    productName:
                        orderItems[0].productName,

                    quantity:
                        orderItems[0].quantity,

                    price:
                        orderItems[0].price,

                    total:
                        total,

                    status:
                        "Pending"

                };


                // =====================================
                // SAVE ORDER
                // =====================================

                customerOrders.unshift(
                    newOrder
                );


                localStorage.setItem(
                    "ardOrders",
                    JSON.stringify(
                        customerOrders
                    )
                );


                // =====================================
                // WHATSAPP MESSAGE
                // =====================================

                const phoneNumber =
                    "919857746076";


                let productMessage = "";


                orderItems.forEach(
                    function(item, index) {

                        productMessage +=
                            (index + 1) +
                            ". " +
                            item.productName +
                            " × " +
                            item.quantity +
                            " = ₹" +
                            item.total +
                            "%0A";

                    }
                );


                const message =
                    "Hello ARD Enterprises,%0A%0A" +

                    "I want to place an order:%0A%0A" +

                    "Customer: " +
                    customerName +
                    "%0A" +

                    "Mobile: " +
                    customerMobile +
                    "%0A%0A" +

                    "Products:%0A" +

                    productMessage +

                    "%0A" +

                    "Grand Total: ₹" +
                    total;


                const whatsappURL =
                    "https://wa.me/" +
                    phoneNumber +
                    "?text=" +
                    message;


                window.open(
                    whatsappURL,
                    "_blank"
                );


                // =====================================
                // CLEAR CART
                // =====================================

                cart = [];

                localStorage.setItem(
                    "ardCart",
                    JSON.stringify(cart)
                );


                // =====================================
                // CLOSE ORDER MODAL
                // =====================================

                closeOrderModal();


                orderForm.reset();


                if (
                    typeof displayCart ===
                    "function"
                ) {

                    displayCart();

                }

            }
        );

    }
);

// =====================================
// CUSTOMER ORDERS
// =====================================

let customerOrders =
    JSON.parse(
        localStorage.getItem("ardOrders")
    ) || [];

// =====================================
// DISPLAY ORDERS
// =====================================

function displayCustomerOrders() {

    const tableBody =
        document.getElementById(
            "ordersTableBody"
        );

    if (!tableBody) return;


    tableBody.innerHTML = "";


    if (customerOrders.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No customer orders yet.
                </td>
            </tr>
        `;

        return;
    }


    customerOrders.forEach(function(order) {

        let statusClass =
            "order-pending";


        if (order.status === "Confirmed") {

            statusClass =
                "order-confirmed";

        }

        else if (order.status === "Completed") {

            statusClass =
                "order-completed";

        }

        else if (order.status === "Cancelled") {

            statusClass =
                "order-cancelled";

        }


        // =====================================
        // PRODUCTS DISPLAY
        // =====================================

        let productsHTML = "";


        if (
            order.items &&
            Array.isArray(order.items)
        ) {

            order.items.forEach(
                function(item) {

                    productsHTML += `
                        <div
                            style="
                                margin-bottom:6px;
                            "
                        >
                            <strong>
                                ${item.productName}
                            </strong>

                            × ${item.quantity}

                            <br>

                            <small>
                                ₹${item.price}
                                × ${item.quantity}
                                = ₹${item.total}
                            </small>
                        </div>
                    `;

                }
            );

        }

        else {

            // Old single-product order

            productsHTML = `
                <div>
                    <strong>
                        ${order.productName}
                    </strong>

                    × ${order.quantity}

                    <br>

                    <small>
                        ₹${order.price}
                        × ${order.quantity}
                        = ₹${order.total}
                    </small>
                </div>
            `;

        }


        // =====================================
        // CREATE TABLE ROW
        // =====================================

        tableBody.innerHTML += `

            <tr>

                <td>
                    <strong>
                        ${order.id}
                    </strong>
                </td>


                <td>
                    ${order.date}
                </td>


                <td>
                    ${order.customerName}
                </td>


                <td>
                    ${order.customerMobile}
                </td>


                <td>
                    ${productsHTML}
                </td>


                <td>
                    <strong>
                        ₹${order.total}
                    </strong>
                </td>


                <td>

                    <select
                        class="order-status-select"
                        onchange="
                            updateOrderStatus(
                                '${order.id}',
                                this.value
                            )
                        "
                    >

                        <option
                            value="Pending"
                            ${
                                order.status ===
                                "Pending"
                                ? "selected"
                                : ""
                            }
                        >
                            Pending
                        </option>


                        <option
                            value="Confirmed"
                            ${
                                order.status ===
                                "Confirmed"
                                ? "selected"
                                : ""
                            }
                        >
                            Confirmed
                        </option>


                        <option
                            value="Completed"
                            ${
                                order.status ===
                                "Completed"
                                ? "selected"
                                : ""
                            }
                        >
                            Completed
                        </option>


                        <option
                            value="Cancelled"
                            ${
                                order.status ===
                                "Cancelled"
                                ? "selected"
                                : ""
                            }
                        >
                            Cancelled
                        </option>

                    </select>


                    <br><br>


                    <button
                        class="order-action-btn"
                        onclick="
                            viewOrder('${order.id}')
                        "
                    >
                        👁 View
                    </button>


                    <button
                        class="order-action-btn"
                        onclick="
                            messageCustomer(
                                '${order.customerMobile}',
                                '${order.id}'
                            )
                        "
                    >
                        📱 WhatsApp
                    </button>


                    <button
                        class="order-action-btn"
                        onclick="
                            callCustomer(
                                '${order.customerMobile}'
                            )
                        "
                    >
                        📞 Call
                    </button>

                </td>

            </tr>

        `;

    });

}

// =====================================
// UPDATE ORDER STATUS
// =====================================

function updateOrderStatus(orderId, newStatus) {

    const order =
        customerOrders.find(function(item) {

            return item.id === orderId;

        });


    if (!order) {

        return;

    }


    order.status = newStatus;


    localStorage.setItem(
        "ardOrders",
        JSON.stringify(customerOrders)
    );

displayCustomerOrders();

updateOrderSummary();
updateSalesReport();
alert(
    "Order status updated to " +
    newStatus
);
}// =====================================
// ORDER WHATSAPP DETAILS
// =====================================

function messageCustomer(mobile, orderId) {

    let number =
        mobile.replace(/\D/g, "");

    if (number.length === 10) {
        number = "91" + number;
    }

    const order =
        customerOrders.find(function(item) {

            return item.id === orderId;

        });

    if (!order) {

        alert("Order not found.");

        return;

    }

    const message =
        "Hello " +
        order.customerName +
        ",%0A%0A" +

        "This is ARD Enterprises regarding your order.%0A%0A" +

        "Order ID: " +
        order.id +
        "%0A" +

        "Product: " +
        order.productName +
        "%0A" +

        "Quantity: " +
        order.quantity +
        "%0A" +

        "Price: ₹" +
        order.price +
        "%0A" +

        "Total: ₹" +
        order.total +
        "%0A" +

        "Status: " +
        order.status +
        "%0A%0A" +

        "Thank you for choosing ARD Enterprises.";

    const url =
        "https://wa.me/" +
        number +
        "?text=" +
        message;

    window.open(url, "_blank");
}// =====================================
// VIEW ORDER DETAILS
// =====================================

function viewOrder(orderId) {

    const order =
        customerOrders.find(function(item) {

            return item.id === orderId;

        });


    if (!order) {

        alert("Order not found.");

        return;

    }


    alert(

        "ORDER DETAILS\n\n" +

        "Order ID: " +
        order.id +

        "\nDate: " +
        order.date +

        "\n\nCustomer: " +
        order.customerName +

        "\nMobile: " +
        order.customerMobile +

        "\n\nProduct: " +
        order.productName +

        "\nQuantity: " +
        order.quantity +

        "\nPrice: ₹" +
        order.price +

        "\nTotal: ₹" +
        order.total +

        "\nStatus: " +
        order.status

    );

}// =====================================
// ORDER DASHBOARD SUMMARY
// =====================================

function updateOrderSummary() {

    const totalOrders =
        customerOrders.length;

    const pendingOrders =
        customerOrders.filter(function(order) {
            return order.status === "Pending";
        }).length;

    const completedOrders =
        customerOrders.filter(function(order) {
            return order.status === "Completed";
        }).length;

    const totalOrderValue =
        customerOrders.reduce(function(total, order) {
            return total + Number(order.total || 0);
        }, 0);

    const totalOrdersElement =
        document.getElementById("totalOrders");

    const pendingOrdersElement =
        document.getElementById("pendingOrders");

    const completedOrdersElement =
        document.getElementById("completedOrders");

    const totalOrderValueElement =
        document.getElementById("totalOrderValue");

    if (totalOrdersElement) {
        totalOrdersElement.textContent =
            totalOrders;
    }

    if (pendingOrdersElement) {
        pendingOrdersElement.textContent =
            pendingOrders;
    }

    if (completedOrdersElement) {
        completedOrdersElement.textContent =
            completedOrders;
    }

    if (totalOrderValueElement) {
        totalOrderValueElement.textContent =
            "₹" + totalOrderValue;
    }
}// =====================================
// SALES & REPORTS
// =====================================

function updateSalesReport() {

    const completedOrders =
        customerOrders.filter(function(order) {

            return order.status === "Completed";

        });


    // ================================
    // COMPLETED ORDER COUNT
    // ================================

    const completedCount =
        completedOrders.length;


    // ================================
    // ITEMS SOLD
    // ================================

    const itemsSold =
        completedOrders.reduce(
            function(total, order) {

                return total +
                    Number(order.quantity || 0);

            },
            0
        );


    // ================================
    // TOTAL SALES
    // ================================

    const totalSales =
        completedOrders.reduce(
            function(total, order) {

                return total +
                    Number(order.total || 0);

            },
            0
        );


    // ================================
// TODAY'S SALES
// ================================

const now = new Date();

const todayDate = now.getDate();
const todayMonth = now.getMonth();
const todayYear = now.getFullYear();


const todaySales =
    completedOrders.reduce(
        function(total, order) {

            const parts =
                order.date.split(",");

            const datePart =
                parts[0].trim();

            const dateNumbers =
                datePart.split("/");

            const orderDay =
                Number(dateNumbers[0]);

            const orderMonth =
                Number(dateNumbers[1]) - 1;

            const orderYear =
                Number(dateNumbers[2]);


            if (
                orderDay === todayDate &&
                orderMonth === todayMonth &&
                orderYear === todayYear
            ) {

                return total +
                    Number(order.total || 0);

            }

            return total;

        },
        0
    );


// ================================
// THIS MONTH SALES
// ================================

const monthSales =
    completedOrders.reduce(
        function(total, order) {

            const parts =
                order.date.split(",");

            const datePart =
                parts[0].trim();

            const dateNumbers =
                datePart.split("/");

            const orderMonth =
                Number(dateNumbers[1]) - 1;

            const orderYear =
                Number(dateNumbers[2]);


            if (
                orderMonth === todayMonth &&
                orderYear === todayYear
            ) {

                return total +
                    Number(order.total || 0);

            }

            return total;

        },
        0
    );

    // ================================
    // DISPLAY
    // ================================

    const todaySalesElement =
        document.getElementById(
            "todaySales"
        );

    const monthSalesElement =
        document.getElementById(
            "monthSales"
        );

    const completedOrdersElement =
        document.getElementById(
            "salesCompletedOrders"
        );

    const itemsSoldElement =
        document.getElementById(
            "itemsSold"
        );


    if (todaySalesElement) {

        todaySalesElement.textContent =
            "₹" + todaySales;

    }


    if (monthSalesElement) {

        monthSalesElement.textContent =
            "₹" + monthSales;

    }


    if (completedOrdersElement) {

        completedOrdersElement.textContent =
            completedCount;

    }


    if (itemsSoldElement) {

        itemsSoldElement.textContent =
            itemsSold;

    }

}// =====================================
// DATA BACKUP
// =====================================

function downloadBackup(data, filename) {

    const jsonData =
        JSON.stringify(data, null, 2);

    const blob =
        new Blob(
            [jsonData],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


// =====================================
// BACKUP PRODUCTS
// =====================================

function backupProducts() {

    downloadBackup(
        products,
        "ARD-Products-Backup.json"
    );

    alert(
        "Products backup downloaded successfully!"
    );
}


// =====================================
// BACKUP ORDERS
// =====================================

function backupOrders() {

    downloadBackup(
        customerOrders,
        "ARD-Orders-Backup.json"
    );

    alert(
        "Orders backup downloaded successfully!"
    );
}


// =====================================
// BACKUP STOCK HISTORY
// =====================================

function backupStockHistory() {

    downloadBackup(
        stockHistory,
        "ARD-Stock-History-Backup.json"
    );

    alert(
        "Stock history backup downloaded successfully!"
    );
}

// =====================================
// FULL BACKUP
// =====================================

function fullBackup() {

    const fullBackupData = {

        backupDate:
            new Date().toLocaleString("en-IN"),

        products:
            products,

        orders:
            customerOrders,

        stockHistory:
            stockHistory

    };


    downloadBackup(
        fullBackupData,
        "ARD-Enterprises-Full-Backup.json"
    );


    alert(
        "Full ARD Enterprises backup downloaded successfully!"
    );
}// =====================================
// EXPORT EXCEL
// =====================================

function exportExcel() {

    if (typeof XLSX === "undefined") {

        alert(
            "Excel library could not be loaded. Please check your internet connection."
        );

        return;
    }


    const workbook =
        XLSX.utils.book_new();


    // ================================
    // PRODUCTS
    // ================================

    const productData =
        products.map(function(product) {

            return {

                "Product Name":
                    product.name,

                "Category":
                    product.category,

                "Price":
                    product.price,

                "Stock":
                    product.stock,

                "Product Code":
                    product.code || "",

                "Description":
                    product.description || ""

            };

        });


    const productSheet =
        XLSX.utils.json_to_sheet(
            productData
        );


    XLSX.utils.book_append_sheet(
        workbook,
        productSheet,
        "Products"
    );


    // ================================
    // ORDERS
    // ================================

    const orderData =
        customerOrders.map(function(order) {

            return {

                "Order ID":
                    order.id,

                "Date":
                    order.date,

                "Customer":
                    order.customerName,

                "Mobile":
                    order.customerMobile,

                "Product":
                    order.productName,

                "Quantity":
                    order.quantity,

                "Price":
                    order.price,

                "Total":
                    order.total,

                "Status":
                    order.status

            };

        });


    const orderSheet =
        XLSX.utils.json_to_sheet(
            orderData
        );


    XLSX.utils.book_append_sheet(
        workbook,
        orderSheet,
        "Orders"
    );


    // ================================
    // STOCK HISTORY
    // ================================

    const stockData =
        stockHistory.map(function(record) {

            return {

                "Date":
                    record.date,

                "Product":
                    record.productName,

                "Type":
                    record.type,

                "Quantity":
                    record.quantity,

                "Stock After":
                    record.stockAfter,

                "Remarks":
                    record.remarks

            };

        });


    const stockSheet =
        XLSX.utils.json_to_sheet(
            stockData
        );


    XLSX.utils.book_append_sheet(
        workbook,
        stockSheet,
        "Stock History"
    );


    // ================================
    // DOWNLOAD
    // ================================

    XLSX.writeFile(
        workbook,
        "ARD-Enterprises-Report.xlsx"
    );


    alert(
        "Excel report downloaded successfully!"
    );

}// =====================================
// EXPORT PDF
// =====================================

function exportPDF() {

    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "PDF library load nahi hui. Internet connection check karein."
        );

        return;
    }


    const { jsPDF } = window.jspdf;

    const doc =
        new jsPDF();


    // ================================
    // TITLE
    // ================================

    doc.setFontSize(20);

    doc.text(
        "ARD ENTERPRISES",
        20,
        20
    );


    doc.setFontSize(11);

    doc.text(
        "Sales & Business Report",
        20,
        28
    );


    doc.text(
        "Report Date: " +
        new Date().toLocaleDateString("en-IN"),
        20,
        36
    );


    // ================================
    // SALES SUMMARY
    // ================================

    const completedOrders =
        customerOrders.filter(function(order) {

            return order.status === "Completed";

        });


    const totalSales =
        completedOrders.reduce(
            function(total, order) {

                return total +
                    Number(order.total || 0);

            },
            0
        );


    const itemsSold =
        completedOrders.reduce(
            function(total, order) {

                return total +
                    Number(order.quantity || 0);

            },
            0
        );


    doc.setFontSize(14);

    doc.text(
        "Sales Summary",
        20,
        50
    );


    doc.setFontSize(11);

    doc.text(
        "Total Orders: " +
        customerOrders.length,
        20,
        60
    );


    doc.text(
        "Completed Orders: " +
        completedOrders.length,
        20,
        68
    );


    doc.text(
        "Items Sold: " +
        itemsSold,
        20,
        76
    );


    doc.text(
        "Total Sales: Rs. " +
        totalSales,
        20,
        84
    );


    // ================================
    // PRODUCTS
    // ================================

    let y =
        100;


    doc.setFontSize(14);

    doc.text(
        "Products",
        20,
        y
    );


    y += 10;

    doc.setFontSize(10);


    products.forEach(function(product) {

        if (y > 270) {

            doc.addPage();

            y = 20;

        }


        doc.text(
            product.name +
            " | Category: " +
            product.category +
            " | Price: Rs. " +
            product.price +
            " | Stock: " +
            product.stock,
            20,
            y
        );


        y += 7;

    });


    // ================================
    // ORDERS
    // ================================

    y += 8;


    if (y > 260) {

        doc.addPage();

        y = 20;

    }


    doc.setFontSize(14);

    doc.text(
        "Customer Orders",
        20,
        y
    );


    y += 10;

    doc.setFontSize(9);


    customerOrders.forEach(function(order) {

        if (y > 270) {

            doc.addPage();

            y = 20;

        }


        doc.text(
            order.id +
            " | " +
            order.customerName +
            " | " +
            order.productName +
            " | Qty: " +
            order.quantity +
            " | Rs. " +
            order.total +
            " | " +
            order.status,
            20,
            y
        );


        y += 6;

    });


    // ================================
    // DOWNLOAD
    // ================================

    doc.save(
        "ARD-Enterprises-Report.pdf"
    );


    alert(
        "PDF report downloaded successfully!"
    );

}// =====================================
// ADMIN LOGIN
// =====================================

function adminLogin() {

    const username =
        document.getElementById("adminUsername").value.trim();

    const password =
        document.getElementById("adminPassword").value;

    const loginError =
        document.getElementById("loginError");


    // TEMPORARY DEVELOPMENT LOGIN
    const correctUsername = "admin";
    const correctPassword = "ARD@2026";


    if (
        username === correctUsername &&
        password === correctPassword
    ) {

        sessionStorage.setItem(
            "ardAdminLoggedIn",
            "true"
        );


        document.getElementById(
            "adminLogin"
        ).style.display = "none";


        document.getElementById(
            "adminPanel"
        ).style.display = "block";


        loginError.textContent = "";

    } else {

        loginError.textContent =
            "❌ Invalid username or password.";

    }

}


// =====================================
// CHECK ADMIN LOGIN
// =====================================

function checkAdminLogin() {

    const loggedIn =
        sessionStorage.getItem(
            "ardAdminLoggedIn"
        );


    if (loggedIn === "true") {

        document.getElementById(
            "adminLogin"
        ).style.display = "none";


        document.getElementById(
            "adminPanel"
        ).style.display = "block";

    } else {

        document.getElementById(
            "adminLogin"
        ).style.display = "flex";


        document.getElementById(
            "adminPanel"
        ).style.display = "none";

    }

}


// =====================================
// RUN LOGIN CHECK
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        checkAdminLogin();

    }
);// =====================================
// ADMIN LOGOUT
// =====================================

function adminLogout() {

    sessionStorage.removeItem(
        "ardAdminLoggedIn"
    );

    document.getElementById(
        "adminPanel"
    ).style.display = "none";

    document.getElementById(
        "adminLogin"
    ).style.display = "flex";

    document.getElementById(
        "adminUsername"
    ).value = "";

    document.getElementById(
        "adminPassword"
    ).value = "";

}// =====================================
// CART DISPLAY
// =====================================

function openCart() {

    const cartModal =
        document.getElementById("cartModal");

    if (!cartModal) return;

    cartModal.style.display = "flex";

    displayCart();
}


function closeCart() {

    const cartModal =
        document.getElementById("cartModal");

    if (!cartModal) return;

    cartModal.style.display = "none";
}


function displayCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const cartTotal =
        document.getElementById("cartTotal");

    if (!cartItems) return;


    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        if (cartCount) {
            cartCount.textContent = "0";
        }

        if (cartTotal) {
            cartTotal.textContent = "₹0";
        }

        return;
    }


    cart.forEach(function(item, index) {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        total += itemTotal;
        count += Number(item.quantity);


        cartItems.innerHTML += `

            <div class="cart-item">

                <div>
                    <strong>
                        ${item.name}
                    </strong>

                    <p>
                        ₹${item.price}
                        ×
                        ${item.quantity}
                    </p>

                    <strong>
                        ₹${itemTotal}
                    </strong>
                </div>


                <button
                    onclick="removeFromCart(${index})">
                    ❌
                </button>

            </div>

        `;

    });


    if (cartCount) {
        cartCount.textContent = count;
    }


    if (cartTotal) {
        cartTotal.textContent =
            "₹" + total;
    }

}


// =====================================
// REMOVE FROM CART
// =====================================

function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem(
        "ardCart",
        JSON.stringify(cart)
    );

    displayCart();
}
displayCart();