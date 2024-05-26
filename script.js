document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("product-form");
    const productIdField = document.getElementById("product-id");
    const productsContainer = document.getElementById("products-container");

    // Cargar productos al iniciar
    fetchProducts();

    // Manejar el envío del formulario
    productForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const productId = productIdField.value;
        const newProduct = {
            presupuesto: document.getElementById("presupuesto").value,
            unidad: document.getElementById("unidad").value,
            producto: document.getElementById("producto").value,
            cantidad: document.getElementById("cantidad").value,
            valorUnitario: document.getElementById("valor-unitario").value,
            fechaAdquisicion: document.getElementById("fecha-adquisicion").value,
            proveedor: document.getElementById("proveedor").value,
        };

        if (productId) {
            // Si hay un ID, actualizar el producto existente
            updateProduct(productId, newProduct);
        } else {
            // Si no hay ID, crear un nuevo producto
            createProduct(newProduct);
        }
    });

    // Función para crear un nuevo producto
    function createProduct(product) {
        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchProducts();
            productForm.reset();
            productIdField.value = "";
        });
    }

    // Función para actualizar un producto
    function updateProduct(id, product) {
        fetch(`/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchProducts();
            productForm.reset();
            productIdField.value = "";
        });
    }

    // Función para eliminar un producto
    function deleteProduct(id) {
        fetch(`/products/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            fetchProducts();
        });
    }

    // Función para cargar los productos
    function fetchProducts() {
        fetch('/products')
        .then(response => response.json())
        .then(products => {
            productsContainer.innerHTML = "";
            products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <p><strong>Presupuesto:</strong> ${product.presupuesto}</p>
                    <p><strong>Unidad:</strong> ${product.unidad}</p>
                    <p><strong>Producto:</strong> ${product.producto}</p>
                    <p><strong>Cantidad:</strong> ${product.cantidad}</p>
                    <p><strong>Valor Unitario:</strong> ${product.valorUnitario}</p>
                    <p><strong>Valor Total:</strong> ${product.cantidad * product.valorUnitario}</p>
                    <p><strong>Fecha de Adquisición:</strong> ${product.fechaAdquisicion}</p>
                    <p><strong>Proveedor:</strong> ${product.proveedor}</p>
                    <button class="edit-button" data-id="${product.id}">Editar</button>
                    <button class="delete-button" data-id="${product.id}">Eliminar</button>
                `;
                productsContainer.appendChild(productCard);
            });

            // Añadir event listeners a los botones de editar y eliminar
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', () => {
                    editProduct(button.dataset.id);
                });
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', () => {
                    deleteProduct(button.dataset.id);
                });
            });
        });
    }

    // Función para cargar datos en el formulario para edición
    window.editProduct = function(id) {
        fetch(`/products`)
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === id);
            if (product) {
                productIdField.value = product.id;
                document.getElementById("presupuesto").value = product.presupuesto;
                document.getElementById("unidad").value = product.unidad;
                document.getElementById("producto").value = product.producto;
                document.getElementById("cantidad").value = product.cantidad;
                document.getElementById("valor-unitario").value = product.valorUnitario;
                document.getElementById("fecha-adquisicion").value = product.fechaAdquisicion;
                document.getElementById("proveedor").value = product.proveedor;
            }
        });
    }

    // Cambiar color de los subtítulos mientras se llena el espacio
    const inputFields = document.querySelectorAll('input');
    inputFields.forEach(input => {
        input.addEventListener('input', () => {
            const label = input.previousElementSibling;
            if (input.value.trim() !== '') {
                label.style.color = '#FF0000'; // Cambia a color verde si el campo tiene contenido
            } else {    
                label.style.color = '#555'; // Cambia al color original si el campo está vacío
            }
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const inputFields = document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]');
    
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
            document.body.classList.add('custom-cursor'); // Agregar la clase para cambiar el cursor a la imagen personalizada
        });

        input.addEventListener('blur', () => {
            document.body.classList.remove('custom-cursor'); // Quitar la clase para volver al cursor predeterminado
        });
    });
});
