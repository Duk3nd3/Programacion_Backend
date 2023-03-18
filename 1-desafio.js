class ProductManager {
	constructor() {
		this.products = [];
		this.uniqueId = 1;
	}

	//Metodo addProduct
	addProduct = (product) => {
		//Antes de agregar el producto, validamos que todos los campos obligatorios existan.
		if (
			!product.title ||
			!product.description ||
			!product.price ||
			!product.thumbnail ||
			!product.code ||
			!product.stock
		) {
			//Caso contrario, hay tabla
			return console.error('Todos los campos son requeridos.');
		}

		////Valida que el campo code sea único en los productos existentes
		this.products.some((stock) => stock.code === product.code)
			? console.error(
					`ERROR: El codigo ${product.code} ya se encuentra en uso.`
			  )
			: null;

		//Asignamos el proximo uniqueId [ID autoincremental] disponible al producto
		product.id = this.uniqueId++;
		this.products.push(product);
	};

	//Este metodo simplemente retorna los productos.
	getProducts() {
		return this.products;
	}

	//Este método recibe un ID y busca un producto en el arreglo que contenga ese ID. Si lo encuentra, devuelve el producto. Sino muestra un error por consola.
	getProductById(idProduct) {
		const searchProduct = this.products.find((stock) => stock.id === idProduct);
		const message = searchProduct
			? `Producto con id ${idProduct} encontrado.`
			: `Producto con id ${idProduct} no encontrado.`;
		return message;
	}
}

//Creamos una instancia de la clase en cuestion
const productManager = new ProductManager();

//A traves del metodo 'getProducts', la primera vez obtendremos un arreglo vacio
const products = productManager.getProducts();
console.log(products);

//Aca a traves del metodo 'addProduct' creamos un arreglo con las propiedades correspondientes
productManager.addProduct({
	title: 'Atari',
	description: 'Atari tambien conocido como Atari Corporation',
	price: 250,
	thumbnail: 'http://www.atari.com/logo.png',
	code: 'AT2600',
	stock: 41,
});

//Llamamos al metodo 'getProducts' con los productos recien agregados
const pushProducts = productManager.getProducts();
console.log(pushProducts);

//Forzamos el error en base al campo CODE por duplicidad
productManager.addProduct({
	title: 'Atari',
	description: 'Atari tambien conocido como Atari Corporation',
	price: 250,
	thumbnail: 'http://www.atari.com/logo.png',
	code: 'AT2600',
	stock: 41,
});

//Evaluamos si existe el producto bajo un ID entonces devolvera algo
const searchingProduct = productManager.getProductById(1);
console.log(searchingProduct);

//Evaluamos nuevamente si existe el producto bajo un ID [forzamos el error]
const searchingProductError = productManager.getProductById(4);
console.log(searchingProductError);
