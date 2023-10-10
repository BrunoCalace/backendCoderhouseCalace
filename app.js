const express = require('express');
const bodyParser = require('body-parser');
const productRouter = require('./src/routes/products');
const cartRouter = require('./src/routes/carts');

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.use(express.static('public'));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});