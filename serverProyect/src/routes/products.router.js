const Router = require('express');
const ProductManager = require('../DAO/ProductManager');
const uploader = require('../utils/multer.utils.js');

const router = Router();
const productManager = new ProductManager();

// Metodo GET

router.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const valueReturned = await productManager.getProducts();
		if (valueReturned.error)
			return res
				.status(200)
				.send({ status: 'There are no products', valueReturned });
		const limitProducts = valueReturned.slice(0, limit);
		res.status(200).send({ status: 'Products', limitProducts });
	} catch (err) {
		res.status(400).send({ status: 'Router error', err });
	}
});

// Metodo GET by ID

router.get('/:pid', async (req, res) => {
	try {
		const product = await productManager.getProductById(req.params.pid);
		res.status(200).send({ product });
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: { err } });
	}
});

// Metodo POST

router.post('/', async (req, res) => {
	try {
		// Obtenemos el body
		const sendProduct = req.body;

		// Verificamos que ningun campo este vacio
		const emptyField = Object.values(sendProduct).find((value) => value === '');
		console.log(emptyField);
		if (emptyField)
			return res
				.status(400)
				.send({ status: 'Error', message: 'All fields are required' });

		const {
			title,
			description,
			price,
			status,
			category,
			thumbnail,
			code,
			stock,
		} = sendProduct;

		// Desestructuracion para el envio al metodo addProduct
		const returnedValue = await productManager.addProduct(
			title,
			description,
			price,
			status,
			category,
			thumbnail,
			code,
			stock
		);

		// Si addProduct devuelve un OBJ con la prop error, hay un error
		if (returnedValue.status === 'Error')
			return res.status(400).send({ returnedValue });
		res.status(200).send({ sendProduct });
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: { err } });
	}
});

// Metodo POST => FORM

router.post(
	'/form',
	uploader.single('thumbnail', async (req, res) => {
		try {
			const sendProduct = req.body;

			// Verificamos que ningun campo este vacio
			try {
				sendProduct.thumbnail = req.file.path;
			} catch (err) {
				sendProduct.thumbnail = 'Empty';
			}

			// Verificamos el estado de 'Status'
			if (Object.hasOwn(sendProduct, 'status')) {
				sendProduct['status'] = 'true';
			}
			sendProduct['status'] = 'false';

			// Desesctructuracion para el envio sobre el metodo addProduct
			const {
				title,
				description,
				price,
				status,
				category,
				thumbnail,
				code,
				stock,
			} = sendProduct;

			// Verificamos que ningun campo este vacio
			const emptyField = Object.values(sendProduct).find(
				(value) => value === ''
			);
			if (emptyField)
				return res
					.status(400)
					.send({ status: 'Error', message: 'All fields are required' });

			const returnedValue = await productManager.addProduct(
				title,
				description,
				price,
				status,
				category,
				thumbnail,
				code,
				stock
			);
			console.log(returnedValue);
			res.send(res.redirect('http://localhost:8080/api/products'));
		} catch (err) {
			return res.status(400).send({ status: 'Error', message: { err } });
		}
	})
);

// Metodo PUT

router.put('/:pid', async (req, res) => {
	try {
		const { pid } = req.params;
		const productUpdate = req.body;

		const updatedProduct = await productManager.updateProduct(
			pid,
			productUpdate
		);

		res.send({ status: 'Success', payload: updatedProduct });
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: err });
	}
});

// Metodo DELETE

router.delete('/:pid', async (req, res) => {
	try {
		const pid = parseInt(req.params.pid);

		const deletedProduct = await productManager.deleteProduct(pid);

		if (!deletedProduct) return res.status(400).send({ deletedProduct });
		res.status(200).send({ deletedProduct });
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: { err } });
	}
});

module.exports = router;
