const multer = require('multer');

// Multer configuration to save images in the "uploads" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Filter function to only allow image files
const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

// Initialize Multer with settings
const upload = multer({ storage: storage });

module.exports = upload;