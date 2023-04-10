// Imports
const express = require('express');

const routerCart = require('./src/routes/cart.router.js');
const routerProducts = require('./src/routes/products.router.js');

// Instanciamos express
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static('./src/public'));

// Router de carritos
app.use('/api/carts', routerCart);

// Router de products
app.use('/api/products', routerProducts);

// Definimos el puerto en ejecucion
const PORT = 8080;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
