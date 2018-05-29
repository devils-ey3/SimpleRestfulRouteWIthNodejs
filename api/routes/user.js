const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const checkauth = require('../middleware/authChecker');

router.post('/signup',usersController.user_signup );

router.post('/login',usersController.user_login );

router.delete('/:userID', checkauth ,usersController.user_remove );

module.exports = router;