const express = require('express');
const router = express.Router();
const apiController = require('../controller/api_controller');

router.post('/registration',apiController.Register);
router.post('/login',apiController.login);
module.exports = router;