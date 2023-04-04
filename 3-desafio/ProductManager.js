const fs = require('fs').promises;
const path = require('path');

module.exports = class ProductManager {
	constructor(filepath) {
		this.path = filepath;
		this.products = [];
	}

	// Cargar productos
	// Utilizamos directamente fs.readFile() con la opción { flag: 'a+' },
	// Abrira el archivo para lectura y escritura y, si el archivo no existe,
	// lo creara
	async loadProducts() {
		try {
			const data = await fs.readFile(this.path, {
				encoding: 'utf-8',
				flag: 'a+',
			});
			this.products = JSON.parse(data);
		} catch (error) {
			console.log(`El archivo de productos no existe. Se creará uno nuevo.`);
			await fs.writeFile(this.path, '[]', 'utf-8');
		}
	}

	// Guardar productos
	// async saveProducts() {
	// 	// Salvamos/Escribimos el archivo con el/los producto/s
	// 	// Convertimos esos valores a un json string
	// 	try {
	// 		await fs.writeFile(this.path, JSON.stringify(this.products, 'utf-8', 2));
	// 	} catch (error) {
	// 		console.error(`Error al guardar productos: ${error.message}`);
	// 		throw error;
	// 	}
	// }

	// Metodo para agregar productos
	async addProduct(product) {
		const requiredFields = [
			'title',
			'description',
			'price',
			'thumbnail',
			'code',
			'stock',
		];

		// Utilizamos un 'for of' para verificar campos vacios
		for (const field of requiredFields) {
			!product[field] &&
				console.log(`ERROR: El campo ${field} es obligatorio.`);
		}

		// Verificamos si el codigo del producto ya existe
		// Como no se indica el 'FIN del proceso' en el desafio
		// Solo manejamos el error a traves de un mensaje
		this.products.some((stock) => stock.code === product.code) &&
			console.log(`ERROR: El código ${product.code} ya está en uso.`);

		// Al pasar 'la validacion', ahora realizamos el 'push' del producto con su nuevo ID
		this.products.push({ id: this.products.length + 1, ...product });
		await this.saveProducts();
		return console.log(`SUCCESS: Producto agregado.`);
	}

	// Obtener productos
	// Optimizamos la obtencion de productos mejorando
	// el metodo loadProducts();
	async getProducts() {
		await this.loadProducts();
		return this.products;
	}

	// Obtener producto por su ID
	async getProductById(id) {
		await this.loadProducts();
		// Almacenamos el producto encontrado por su ID
		// A traves del metodo 'find', en la variable 'product'
		const product = this.products.find((productId) => productId.id === id);
		// Validamos product
		product === undefined
			? console.log(`ERROR: No pudimos obtener el producto con id ${id}.`)
			: console.log(`SUCCESS: Producto con id ${id} obtenido exitosamente.`);
		return product;
	}

	// Metodo para actualizar el producto por su ID
	// async updateProductById(id, updatedFields) {
	// 	await this.loadProducts();
	// 	const productIndex = this.products.findIndex(
	// 		(product) => product.id === id
	// 	);

	// 	// El metodo 'findIndex' devolvera -1
	// 	// Si la condicion de busqueda NO se cumple
	// 	if (productIndex === -1) {
	// 		return console.log(`ERROR: Producto con id ${id} no encontrado.`);
	// 	}

	// 	// spread '...updatedFields' contiene el dato nuevo
	// 	// spread '...this.products[productIndex]' contiene el producto con el campo a actualizar
	// 	// 'updatedProduct' almacenara el nuevo producto actualizado
	// 	const updatedProduct = { ...this.products[productIndex], ...updatedFields };
	// 	this.products[productIndex] = updatedProduct;
	// 	await this.saveProducts();
	// 	console.log(`SUCCESS: Producto con id ${id} actualizado.`);
	// 	return updatedProduct;
	// }

	// // Eliminar producto por su ID
	// // En este caso se forzo el ID a 1, pero puede ser cualquiera
	// // Si se generan varios productos
	// async deleteProductById(id) {
	// 	await this.loadProducts();
	// 	const productIndex = this.products.findIndex(
	// 		(product) => product.id === id
	// 	);

	// 	// Si no encontramos el producto por ID, devolvemos un error
	// 	// El metodo 'findIndex' devolvera -1 sino cumple la condicion
	// 	if (productIndex === -1) {
	// 		return console.log(`ERROR: Producto con id ${id} no encontrado.`);
	// 	}

	// 	// Caso contrario, eliminamos el producto [segun su ID]
	// 	this.products.splice(productIndex, 1);
	// 	await this.saveProducts();
	// 	return console.log(`SUCCESS: Producto con id ${id} eliminado.`);
	// }

	// Este metodo adicional vacia por completo nuestro json
	// async deleteAllProducts() {
	// 	await this.loadProducts();

	// 	if (this.products.length === 0) {
	// 		return console.log('No hay productos para eliminar.');
	// 	}

	// 	// 'Removemos' todo el arreglo utilizando el metodo 'splice'
	// 	this.products.splice(0, this.products.length);

	// 	await this.saveProducts();
	// 	return console.log('Todos los productos han sido eliminados.');
	// }
};

// La clase la instanciamos desde 'app.js' exportando este archivo a dicho path
