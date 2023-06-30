const multer = require("multer");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + "/src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

module.exports = multer({ storage });
