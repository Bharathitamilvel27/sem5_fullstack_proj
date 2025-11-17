const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// ✅ TEST ROUTE (for checking backend deployment + CORS)
router.get('/test', (req, res) => {
  res.json({ message: "Auth API working fine!" });
});

// -------------------- PROFILE UPLOAD SETUP -------------------- //

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// -------------------- AUTH ROUTES -------------------- //

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/me', auth, authController.getMe);

router.get('/profile/:userId', auth, authController.getProfile);
router.get('/profile/username/:username', auth, authController.getProfileByUsername);
router.get('/profile/username/:username/followers', auth, authController.getFollowersByUsername);
router.get('/profile/username/:username/following', auth, authController.getFollowingByUsername);

router.put('/profile', auth, authController.updateProfile);
router.post('/profile/picture', auth, profileUpload.single('profilePicture'), authController.uploadProfilePicture);

router.post('/follow/:userId', auth, authController.followUser);
router.get('/suggested-users', auth, authController.getSuggestedUsers);

module.exports = router;
