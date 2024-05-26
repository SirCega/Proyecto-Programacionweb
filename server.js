const express = require('express');
const fs = require('fs').promises; // Usar la versión de promesas de fs
const path = require('path');
const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'products.json');

app.use(express.json());
app.use(express.static(__dirname));


async function readProducts() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error('Error reading data');
    }
}


async function writeProducts(products) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
        throw new Error('Error saving data');
    }
}

app.get('/products', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/products', async (req, res) => {
    try {
        const products = await readProducts();
        const newProduct = { ...req.body, id: Date.now().toString() };
        products.push(newProduct);
        await writeProducts(products);
        res.send('Product saved');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(product => product.id === req.params.id);
        if (index === -1) {
            return res.status(404).send('Product not found');
        }
        products[index] = { ...products[index], ...req.body };
        await writeProducts(products);
        res.send('Product updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const newProducts = products.filter(product => product.id !== req.params.id);
        await writeProducts(newProducts);
        res.send('Product deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
