const path = require('path');
const multer = require('multer');
const AppError = require('../utils/AppError');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/profiles')),
  filename: (req, file, cb) => cb(null, `user-${req.user.user_id}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_MB || 2) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(new AppError('Only JPG, PNG and WEBP images are allowed', 400));
    cb(null, true);
  }
});
module.exports = upload;
