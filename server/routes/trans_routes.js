const express = require('express');
const router = express.Router();
const trans_controller = require('../controller/transaction_controller');
const protected = require('../middlwware/authUser_token')
const upload = require('../utils/uploads');

router.post('/transaction',protected,upload.single('image'),trans_controller.transaction);
//router.get('/trasactionHistory',protected, trans_controller.getDepositHistory);

module.exports =router;