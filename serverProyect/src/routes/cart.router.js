const { Router } = require('express');
const CartManager = require('../DAO/CartManager.js');

const router = Router();
const carts = new CartManager();

// METODO GET CART

router.get('/:cid', async (req, res) => {
	const { cid } = req.params;

	try {
		const returnedValue = await carts.getCartById(cid);

		!returnedValue
			? res.status(400).send({ status: 'Error', message: 'No Cart' })
			: res.status(200).send({ status: 'Cart', payload: returnedValue });
	} catch (err) {
		res.status(400).send({ status: 'Router error', message: err });
	}
});

// METODO POST CART

router.post('/', async (req, res) => {
	try {
		// Obtenemos el body
		const cart = req.body;

		// Verificamos que ningun campo este vacio
		const emptyField = Object.values(cart).find((value) => value === '');
		if (emptyField)
			return res
				.status(400)
				.send({ status: 'Error', message: 'All fields are required' });

		// Si addProduct devuelve un OBJ con la prop error, hay un error
		if (cart.status === 'Error') return res.status(400).send({ returnedValue });
		await carts.addCart(cart);
		res.status(200).send({ cart });
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: err });
	}
});

// METODO POST CART => PRODUCTS

router.post('/:cid/product/:pid', async (req, res) => {
	try {
		// Obtenemos el body
		const { products } = req.body;

		// Obtenemos el cid del cart y pid del product
		const { cid, pid } = req.params;

		products['idProduct'] = Number(pid);

		const cart = await carts.getCartById(cid);

		if (!cart) {
			return res
				.status(400)
				.send({ status: 'Error', message: 'Cart not found' });
		}
		const productFound = cart.products.findIndex(
			(product) => product.idProduct == pid
		);

		// Verificamos si se proporcionó el parámetro de producto
		if (!products) {
			return res
				.status(400)
				.send({ status: 'Error', message: 'Missing product parameter' });
		}

		// Sino existe el cart, enviamos un error
		!cart &&
			res.status(400).send({ status: 'Error', message: 'Cart not found' });

		// Si !== -1 [findIndex], actualizamos 'quantity'
		if (productFound !== -1) {
			cart.products[productFound].quantity =
				Number(cart.products[productFound].quantity) +
				Number(products.quantity);
			await carts.updateCart(cid, cart);
			return res
				.status(200)
				.send({ status: 'Success', message: 'Product added' });
		}

		cart.products.push(products);
		await carts.updateCart(cid, cart);
		res.status(200).send({
			status: 'Success',
			message: 'Product added',
			cart: cart.products,
		});
	} catch (err) {
		return res.status(400).send({ status: 'Error', message: err.message });
	}
});

module.exports = router;
