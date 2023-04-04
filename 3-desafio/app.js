const express = require('express');
// Importamos ProductManager [class]
const ProductManager = require('./ProductManager.js');

// INFO: Se podran [tambien] observar los resultados por consola del servidor

// Instanciamos express
const app = express();
// Instanciamos ProductManager
const productsManager = new ProductManager('products.json');

app.use(express.urlencoded({ extended: true }));

// Home
app.get('/', (request, response) => {
	response.status(200).send('<h1>BIENVENIDO</h1>');
});

// Hacemos uso de 'GET' para obtener los productos en su totalidad
// o a traves de una limitacion ['n' cantidad de productos con 'query.limit']
app.get('/api/products', async (request, response) => {
	const limit = request.query.limit;
	const products = await productsManager.getProducts();

	// Hacemos uso del metodo 'slice' con el fin de obtener el limite/cantidad
	// de productos deseados
	limit
		? response.send({ status: 'success', payload: products.slice(0, limit) })
		: response.send({ status: 'success', payload: products });
});

// Hacemos uso de 'GET' pero esta vez obtenemos un producto
// a traves de su ID [:pid]
app.get('/api/products/:pid', async (request, response) => {
	const id = parseInt(request.params.pid);
	const product = await productsManager.getProductById(id);
	// Manejo de error si el producto no es encontrado por su ID [pid]
	product
		? response.send({ status: 'success', payload: product })
		: response.status(500).send({
				status: 'Internal Server Error',
				message: 'Producto no encontrado',
		  });
});

// Definimos el puerto en ejecucion
const PORT = 8080;

// Al definir el puerto en una constante podemos hacer
// un console.log mas 'dinamico'
app.listen(PORT, () => {
	console.log(`Servidor iniciado en el puerto ${PORT}`);
});
