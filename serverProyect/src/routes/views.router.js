const { Router } = require('express');

// Instanciamos Router
const router = Router();

// Mock food
let food = [
	{
		name: 'Hamburguesa',
		price: '150',
	},
	{
		name: 'French fries',
		price: '250',
	},
	{
		name: 'Fried chicken',
		price: '350',
	},
	{
		name: 'Big salad',
		price: '450',
	},
	{
		name: 'Ice cream',
		price: '550',
	},
];

// Mock users
const users = [
	{
		name: 'Juan',
		lastname: 'Perez',
		age: '25',
		email: 'juanperez@gmail.com',
		phone: '555-1234',
		role: 'user',
	},
	{
		name: 'Maria',
		lastname: 'Garcia',
		age: '30',
		email: 'mariagarcia@gmail.com',
		phone: '555-5678',
		role: 'admin',
	},
	{
		name: 'Pedro',
		lastname: 'Lopez',
		age: '20',
		email: 'pedrolopez@gmail.com',
		phone: '555-2367',
		role: 'user',
	},
	{
		name: 'Ana',
		lastname: 'Ramirez',
		age: '35',
		email: 'anaramirez@gmail.com',
		phone: '555-9012',
		role: 'admin',
	},
	{
		name: 'Luis',
		lastname: 'Fernandez',
		age: '40',
		email: 'luisfernandez@gmail.com',
		phone: '555-3869',
		role: 'user',
	},
];

// Renderizamos index [handlebars]
router.get('/', (req, res) => {
	let user = users[Math.floor(Math.random() * users.length)];

	let testUser = {
		title: 'E-Commerce',
		user,
		isAdmin: user.role === 'admin',
		food,
		style: 'index.css',
	};

	res.render('index', testUser);
});

router.get('/register', (req, res) => {
	res.render('registerForm', {
		style: 'index.css',
	});
});

router.post('/register', (req, res) => {
	const user = req.body;

	res.send({
		user,
		status: 'Success',
		message: 'Registro exitoso',
	});
});

module.exports = router;
