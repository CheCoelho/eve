const express = require('express');
const router = express.Router();

//middleware
const requireAuth = require('../middleware/authMiddleware')


const authController = require('../controllers/authController')

router.get('/register', authController.register_get);

router.post('/register', authController.register_post);

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

// router.get('/profile', authController.profile_get);

// router.get('/update_profile', authController.update_get)

router.patch('/update_profile', authController.update_patch);

router.delete('/delete_user', authController.user_delete);




module.exports = router;