const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.loadProducts();
    this.productIdCounter = this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProducts() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (error) {
      console.error('Error al guardar los productos en el archivo:', error);
    }
  }
  
  addProduct(title, description, price, thumbnail, code, stock) {
      
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }
  
    const codeExists = this.products.some((product) => product.code === code);
    if (codeExists) {
      console.error("El código de producto ya existe.");
      return;
    }
  
    const product = {
      id: this.productIdCounter++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
  
    this.products.push(product);
    this.saveProducts();
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
        console.error("Producto no encontrado.");
        return;
    }
    updatedProduct.id = id;
    this.products[index] = updatedProduct;
    this.saveProducts();
  }    

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
        console.error("Producto no encontrado.");
        return;
    }

    this.products.splice(index, 1);
    this.saveProducts();
  }

  async getProducts(limit) {
    try {
      if (limit) {
        return this.products.slice(0, limit);
      } else {
        return this.products;
      }
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  async getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }
}


  
const productManager = new ProductManager( 'products.json' );
app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    res.json({ product });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});


