const express = require('express');
const fs = require('fs');
const router = express.Router();
const ProductManager = require('../productManager');
const CartManager = require('../cartManager');

const productManager = new ProductManager();
const cartManager = new CartManager();

const carts = cartManager.loadCartsFromFile();

router.post('/', (req, res) => {
  try {
    const newCartId = cartManager.generateCartId();
    const newCart = {
      id: newCartId,
      products: [],
    };
    
    carts.push(newCart);
    
    cartManager.saveCartsToFile(carts);
  
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:cid', (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const quantity = 1;

      const cart = carts.find((cart) => cart.id === cartId);
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      const productToAdd = productManager.getProductById(productId);
  
      if (!productToAdd) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
  
      const existingProduct = cart.products.find((product) => product.productId === productId);
  
      if (existingProduct) {
        existingProduct.quantity ++;
      } else {
        cart.products.push({ productId, quantity });
      }

      cartManager.saveCartsToFile(carts);
      res.status(201).json(cart.products);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;