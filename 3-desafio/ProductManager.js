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
};

// La clase la instanciamos desde 'app.js' exportando este archivo a dicho path
