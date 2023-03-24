const fs = require('fs').promises;
const path = require('path');

class ProductManager {
	constructor(filepath) {
		this.path = filepath;
		this.products = [];
	}

	// Cargar productos
	async loadProducts() {
		try {
			await fs.access(this.path);
		} catch (error) {
			console.log(`El archivo de productos no existe. Se creará uno nuevo.`);
			await fs.writeFile(this.path, '[]', 'utf-8');
		}
		try {
			const data = await fs.readFile(this.path, 'utf-8');
			this.products = JSON.parse(data);
		} catch (error) {
			console.error(`Error al cargar productos: ${error.message}`);
			throw error;
		}
	}

	// Guardar productos
	async saveProducts() {
		// Verificamos que no haya errores durante el guardado del producto
		try {
			await fs.writeFile(this.path, JSON.stringify(this.products, 'utf-8', 2));
		} catch (error) {
			console.error(`Error al guardar productos: ${error.message}`);
			throw error;
		}
	}

	// Agregar productos
	async addProduct(product) {
		const requiredFields = [
			'title',
			'description',
			'price',
			'thumbnail',
			'code',
			'stock',
		];

		// Ejecutamos un 'for of' para verificar campos vacios
		for (const field of requiredFields) {
			!product[field] &&
				console.log(`ERROR: El campo ${field} es obligatorio.`);
		}

		// Verificamos si el codigo del producto ya existe
		this.products.some((stock) => stock.code === product.code) &&
			console.log(`ERROR: El código ${product.code} ya está en uso.`);

		// Al pasar 'la validacion', ahora realizar el 'push' del producto con su nuevo ID
		this.products.push({ id: this.products.length + 1, ...product });
		await this.saveProducts();
		return console.log(`SUCCESS: Producto agregado.`);
	}

	// Obtener productos
	async getProducts() {
		await this.loadProducts();
		return this.products;
	}

	// Obtener producto por su ID
	async getProductById(id) {
		await this.loadProducts();
		const product = this.products.find((productId) => productId.id === id);
		console.log(product);
		product
			? console.log(`SUCCESS: Producto con id ${id} encontrado.`)
			: console.log(`ERROR: Producto con id ${id} no encontrado.`);
		return product;
	}

	// Actualizar producto por su ID
	async updateProductById(id, updatedFields) {
		await this.loadProducts();
		const productIndex = this.products.findIndex(
			(product) => product.id === id
		);

		if (productIndex === -1) {
			console.log(`ERROR: Producto con id ${id} no encontrado.`);
			return null;
		}

		const updatedProduct = { ...this.products[productIndex], ...updatedFields };
		this.products[productIndex] = updatedProduct;
		await this.saveProducts();
		console.log(`SUCCESS: Producto con id ${id} actualizado.`);
		return updatedProduct;
	}

	// Eliminar producto por su ID
	async deleteProductById(id) {
		await this.loadProducts();
		const productIndex = this.products.findIndex(
			(product) => product.id === id
		);

		// Si no encontramos el producto por ID, devolvemos un error
		if (productIndex === -1) {
			console.log(`ERROR: Producto con id ${id} no encontrado.`);
			return;
		}

		// Caso contrario, eliminamos el producto [segun su ID]
		this.products.splice(productIndex, 1);
		await this.saveProducts();
		console.log(`SUCCESS: Producto con id ${id} eliminado.`);
	}

	// Opcional [vaciar el json]
	async deleteAllProducts() {
		await this.loadProducts();

		if (this.products.length === 0) {
			console.log('No hay productos para eliminar.');
			return;
		}

		// 'Removemos' todo el arreglo utilizando el metodo Splice
		this.products.splice(0, this.products.length);

		await this.saveProducts();
		console.log('Todos los productos han sido eliminados.');
	}
}

// Creamos objeto a utilizar como referencia
const product = {
	title: 'Atari 2600',
	description: 'Este es un producto epico',
	price: 200,
	thumbnail: 'Imagen Atari 2600',
	code: 'AT2600',
	stock: 25,
};

// Instanciamos la clase
const main = async () => {
	try {
		const productManager = new ProductManager(
			// Usamos __dirname para ver la carpeta en donde esta ubicado nuestro archivo
			// Utilizamos el metodo Join para unir los elementos
			path.join(__dirname, 'products.json')
		);

		// Obtener todos los productos (debería devolver [])
		console.log(await productManager.getProducts());

		// Agregar un producto
		await productManager.addProduct(product);

		// Obtener todos los productos (debería devolver el producto agregado)
		console.log(await productManager.getProducts());

		// Obtener el producto por su ID
		const id = 1; // asumiendo que se generó el ID automáticamente como 1
		console.log(await productManager.getProductById(id));

		// Actualizar un producto por su ID
		const updatedProductFields = {
			price: 300,
		};
		await productManager.updateProductById(id, updatedProductFields);

		// Obtener todos los productos (debería devolver el producto actualizado)
		console.log(await productManager.getProducts());

		// Eliminar producto por su ID, si comentamos la linea
		// comenzara a crear productos asignando a ellos un ID autoincremental sin repetir
		await productManager.deleteProductById(id);

		// Para vaciar por completo el archivo 'products.json' utilizaremos
		// el metodo deleteAllProducts
		await productManager.deleteAllProducts(id);

		// Obtener todos los productos (caso contrario debería devolver [])
		console.log(await productManager.getProducts());
	} catch (error) {
		console.error(error);
	}
};

main();
