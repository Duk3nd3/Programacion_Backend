// Express
const express = require('express');

// Terceros
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');

// Imports
const routerCart = require('./src/routes/cart.router.js');
const routerProducts = require('./src/routes/products.router.js');
const routerViews = require('./src/routes/views.router.js');
const uploader = require('./src/utils/multer.utils.js');

// Instanciamos express
const app = express();

// Definimos el puerto en ejecucion
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});

// handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'handlebars');

// socket.io
const socketServer = new Server(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mid de tercero
app.use(cookieParser());

// http://localhost:8080 /
app.use('/', routerViews);

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
