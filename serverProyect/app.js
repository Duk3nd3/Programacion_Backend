// Express
const express = require('express');

// Imports
const routerCart = require('./src/routes/cart.router.js');
const routerProducts = require('./src/routes/products.router.js');
const uploader = require('./src/utils/multer.utils.js');

// Instanciamos express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:8080/static /form
app.use('/static', express.static(`${__dirname}/src/public`));

// http://localhost:8080 /api/carts
app.use('/api/carts', routerCart);

// http://localhost:8080 /api/products
app.use('/api/products', routerProducts);

// Form upload image
app.post('/single', uploader.single('thumbnail'), (req, res) => {
	res
		.status(200)
		.send({ status: 'Success', message: 'File uploaded successfully' });
});

// Si explota la app...
app.use((err, req, res, next) => {
	console.log('Kboom!: ', err);
	res.status(500).send('Todo mal :(');
});

// Definimos el puerto en ejecucion
const PORT = 8080;

app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
