const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const productRouter = require('./src/routes/products');
const cartRouter = require('./src/routes/carts');
const viewRoutes = require('./src/routes/viewRoutes');
const ProductManager = require('./src/productManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const hbs = exphbs.create({ 
  layoutsDir: path.join(__dirname, 'src', 'views'),
  defaultLayout: 'home' 
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewRoutes);

const productManager = new ProductManager();

io.on('connection', (socket) => {
  console.log('Cliente conectado al servidor de Socket.IO.');

  socket.on('nuevoProducto', async (producto) => {
    try {
      const nuevoProducto = await productManager.addProduct(producto);
  
      const limit = undefined;
      const products = await productManager.getProducts(limit);

      io.emit('productosActualizados', { products });
    } catch (error) {
      console.error("Error al crear un nuevo producto:", error);
    }
  });

  socket.on('eliminarProducto', async (productoId) => {
    try {
      await productManager.deleteProduct(productoId);
  
      const limit = undefined;
      const products = await productManager.getProducts(limit);
  
      io.emit('productosActualizados', { products });
    } catch (error) {
      console.error("Error al eliminar un producto:", error);
    }
  });

  socket.on('actualizarProductos', async () => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const products = await productManager.getProducts(limit);

      socket.emit('productosActualizados', { products });
    } catch (error) {
      console.error("Error al actualizar productos en tiempo real:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado del servidor de Socket.IO.');
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});