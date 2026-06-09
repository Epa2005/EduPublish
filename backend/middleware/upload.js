const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const maxMB = parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50;
console.log(`Multer max file size configured: ${maxMB} MB`);
const upload = multer({
  storage,
  limits: { fileSize: maxMB * 1024 * 1024 },
});

module.exports = upload;
