const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const { signup, login, logout, updateProfile, checkAuth } = require('../controllers/auth');
const { protectRoute } = require('../middlewares/auth');

// Multer config
const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);  
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
        cb(new Error("File type is not supported"), false);
        return;
      }
      cb(null, true);
    },
});

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update-profile", protectRoute, upload.single('image'), updateProfile);
router.get("/check", protectRoute, checkAuth);

module.exports = router;