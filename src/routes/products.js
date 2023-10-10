const express = require('express');
const multer = require('multer');
const router = express.Router();
const ProductManager = require('../productManager');

const productManager = new ProductManager();
const upload = multer();

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json({ products });
  } catch (error) {
    console.error("Error en la ruta principal:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
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

router.post('/', upload.none(), (req, res) => {
    try {

      const { title, description, price, code, stock, category, thumbnails } = req.body;

      productManager.addProduct(title, description, parseFloat(price), code, parseInt(stock), category, thumbnails);
      productManager.saveProducts();

      res.status(201).json({ message: 'Producto creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:pid', upload.none(), (req, res) => {
    try {
      const pid = parseInt(req.params.pid);
      const updatedProduct = req.body;

      const existingProduct = productManager.getProductById(pid);

      if (!existingProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      for (const key in updatedProduct) {
        if (updatedProduct[key] !== undefined) {
          if (key === 'price' || key === 'stock') {
            existingProduct[key] = parseFloat(updatedProduct[key]);
          } else {
            existingProduct[key] = updatedProduct[key];
          }
        }
      }

      productManager.updateProduct(pid, existingProduct);
      productManager.saveProducts();
  
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      if (error.message === "Producto no encontrado") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
});

router.delete('/:pid', async (req, res) => {
    try {
      const pid = parseInt(req.params.pid);
  
      productManager.deleteProduct(pid);
      productManager.saveProducts();
  
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      if (error.message === "Producto no encontrado") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
});

module.exports = router;