const fs = require('fs');

class CartManager {
	constructor() {
		this.carts = [];
		this.path = './src/DAO/carts.json';
	}

	// Metodo addCart

	addCart = async (newCart) => {
		try {
			const carts = await this.getCarts();

			this.carts = carts;

			//Id autoincremental
			if (this.carts.length === 0) {
				newCart.id = 1;
			} else {
				newCart.id = this.carts[this.carts.length - 1].id + 1;
			}

			if (Object.values(newCart).every((value) => value)) {
				this.carts.push(newCart);
				const toJSON = JSON.stringify(this.carts, null, 2);
				await fs.promises.writeFile(this.path, toJSON);
			}

			return [];
		} catch (err) {
			return { status: 'Error', message: err };
		}
	};

	// Metodo getCarts

	getCarts = async () => {
		try {
			const getFileCarts = await fs.promises.readFile(this.path, 'utf-8');
			if (getFileCarts.length === 0) return [];
			return JSON.parse(getFileCarts);
		} catch (err) {
			return { status: 'Error', message: err };
		}
	};

	// Metodo getCartById

	getCartById = async (id) => {
		try {
			const getFileCarts = await fs.promises.readFile(this.path, 'utf-8');
			const parseCarts = JSON.parse(getFileCarts);

			if (!parseCarts[id - 1]) return { error: 'Error! Cart does not exist' };

			return parseCarts[id - 1];
		} catch (err) {
			return { status: 'Error', message: err };
		}
	};

	// Metodo updateCart

	updateCart = async (cid, data) => {
		try {
			const getFileCarts = await fs.promises.readFile(this.path, 'utf-8');
			const parseCarts = JSON.parse(getFileCarts);

			if (isNaN(Number(cid)) || cid <= 0 || cid > parseCarts.length)
				return { status: 'Error', message: 'Invalid cart id' };

			const findId = parseCarts.findIndex((product) => product.id == cid);
			if (findId === -1) return { status: 'Error', message: 'No id found' };

			const targetReturned = Object.assign(parseCarts[findId], data);
			parseCarts[findId] = targetReturned;

			this.carts = parseCarts.map((cart) => {
				if (cart.id == cid) {
					cart = Object.assign(cart, data);
					return cart;
				}
				return cart;
			});

			const toJSON = JSON.stringify(this.carts, null, 2);
			await fs.promises.writeFile(this.path, toJSON);
			return targetReturned;
		} catch (err) {
			return { status: 'Error', message: err };
		}
	};
}

module.exports = CartManager;
