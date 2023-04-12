const multer = require('multer');
const path = require('path');

// Usamos una constante para la ruta de subida de archivos para que sea más fácil de leer
const UPLOADS_FOLDER = path.join('src', 'public', 'uploads');
// Agregamos límites al tamaño de archivo que puede ser cargado
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, UPLOADS_FOLDER);
	},
	filename: function (req, file, callback) {
		callback(null, `${Date.now()}-${file.originalname}`);
	},
});

const uploader = multer({
	storage: storage,
	limits: { fileSize: MAX_FILE_SIZE },
	fileFilter: function (req, file, callback) {
		// Añadimos un filtro de archivos para validar que solo se permitan ciertos tipos de archivo.
		const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
		if (allowedMimes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(new Error('Invalid file type.'));
		}
	},
});

module.exports = uploader;
