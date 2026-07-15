const multer = require('multer');
const path = require('path');


// 1. Configure where to save the folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // This is the folder where the image will be saved
        cb(null, 'public/uploads/') 
    },
    filename: function (req, file, cb) {
        // Save file with current timestamp + original extension (e.g., 123123.jpg)
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

// Filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: fileFilter
});

 module.exports = upload;