const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');

const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);
        res.render('home', { products });
      } catch (error) {
        console.error("Error en la ruta principal:", error);
        res.status(500).send('Error interno del servidor: ' + error.message);
      }
});

router.get('/realTimeProducts', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.render('realTimeProducts', {products});
  } catch (error) {
    console.error("Error en la realTimeProducts:", error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
  
});

module.exports = router;