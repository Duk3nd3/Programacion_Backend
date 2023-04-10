const fs = require('fs');

class ProductManager {
	constructor() {
		this.products = [];
		this.path = './src/DAO/products.json';
	}

	__appendProduct = async () => {
		const toJSON = JSON.stringify(this.products, null, 2);
		await fs.promises.writeFile(this.path, toJSON);
	};

	// METODO addProduct +++++

	addProduct = async (
		title,
		description,
		price,
		status,
		category,
		thumbnail,
		code,
		stock
	) => {
		const productsFS = await this.getProducts();

		this.products = productsFS;

		const product = {
			title,
			description,
			price,
			status,
			category,
			thumbnail,
			code,
			stock,
		};

		// Validacion de codigo
		const validateCode = this.products.find(
			(productCode) => productCode.code === product.code
		);
		if (validateCode) {
			return {
				status: 'Error',
				message: 'Product could not be added because the code is repeated',
			};
		}

		// ID Autoincremental
		if (this.products.length === 0) {
			product.id = 1;
		} else {
			product.id = this.products[this.products.length - 1].id + 1;
		}

		// Verifica que el objeto tenga todos sus valores

		if (Object.values(product).every((value) => value)) {
			product.status === 'false'
				? (product.status = false)
				: (product.status = true);

			product.price = Number(product.price);
			product.stock = Number(product.stock);
			product.thumbnail = [product.thumbnail];

			this.products.push(product);
			this.__appendProduct();
			return {
				status: 'Succes',
				message: 'The product was successfully registered',
				producto: product,
			};
		}
		return { status: 'Error', message: 'All fields are required' };
	};

	// METODO getProducts +++++

	getProducts = async () => {
		try {
			const getFileProducts = await fs.promises.readFile(this.path, 'utf-8');
			if (getFileProducts.length === 0) return [];
			return JSON.parse(getFileProducts);
		} catch (err) {
			return { status: 'Error', error: err };
		}
	};

	// METODO getProductById +++++

	getProductById = async (id) => {
		try {
			const getFileProducts = await fs.promises.readFile(this.path, 'utf-8');
			const parseProducst = JSON.parse(getFileProducts);

			if (!parseProducst[id - 1]) return 'Error! No product exists';

			return parseProducst[id - 1];
		} catch (err) {
			return { status: 'Error', error: err };
		}
	};

	// METODO updateProduct +++++

	updateProduct = async (pid, data) => {
		const getFileProducts = await fs.promises.readFile(this.path, 'utf-8');
		const parseProducts = JSON.parse(getFileProducts);

		if (isNaN(Number(pid))) {
			return { status: 'Error', message: 'Not a valid id' };
		}

		// Buscamos el producto por su ID
		const productToUpdate = parseProducts.find((product) => product.id == pid);
		// Si no se encuentra el producto, arrojamos un error
		if (!productToUpdate) {
			return { status: 'Error', message: 'No id found' };
		}

		// Actualizamos el producto con los datos recibidos del cliente
		const updatedProduct = { ...productToUpdate, ...data };
		// Actualizamos el array con el producto actualizado
		const updatedProducts = parseProducts.map((product) =>
			product.id == pid ? updatedProduct : product
		);

		// Escribimos el archivo con los productos actualizados
		await fs.promises.writeFile(
			this.path,
			JSON.stringify(updatedProducts, null, 2)
		);

		return updatedProduct;
	};

	// METODO deleteProduct +++++

	deleteProduct = async (pid) => {
		try {
			const getFileProducts = await fs.promises.readFile(this.path, 'utf-8');
			const parseProducts = JSON.parse(getFileProducts);

			if (isNaN(Number(pid)))
				return { status: 'Error', message: 'Not a valid id' };

			const findId = parseProducts.findIndex((product) => product.id == pid);
			if (findId === -1) return { status: 'Error', message: 'No id found' };

			const productFilter = parseProducts.filter(
				(product) => product.id !== pid
			);

			this.products = productFilter;
			this.__appendProduct();
			return {
				status: 'Success',
				message: `Product with id ${pid} was deleted`,
			};
		} catch (err) {
			return {
				status: 'Error',
				message: `Product with id ${pid} was NOT deleted`,
			};
		}
	};
}

module.exports = ProductManager;
