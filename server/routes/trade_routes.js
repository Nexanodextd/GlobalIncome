const express = require('express');
const router = express.Router();
const trade_controller = require('../controller/api_trade_controller');
const protected = require('../middlwware/authUser_token');

router.post('/buy',protected,trade_controller.buy)
router.post('/sell',protected,trade_controller.sell);
router.get('/portfolio',protected,trade_controller.portfolio);










module.exports = router;