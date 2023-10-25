import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import cartRouter from './routes/cartRoutes.js';
import productRouter from './routes/productsRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import productManager from './classes/productManager.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);;

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on('addProduct', (producto) => {
    productManager.addProduct(producto);
  });
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

app.engine('handlebars', handlebars.engine());
app.set ('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRoutes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});