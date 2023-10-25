import express from "express";
import productManager from "../classes/productManager.js";

const viewsRoutes = express.Router();

viewsRoutes.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.render("home", { products });
  } catch (error) {
    console.error("Error en la ruta principal:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

viewsRoutes.get("/realTimeProducts", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error en la realTimeProducts:", error);
    res.status(500).send("Error interno del servidor: " + error.message);
  }
});

export default viewsRoutes;