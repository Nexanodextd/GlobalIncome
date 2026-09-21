const express = require('express');
const router = express.Router();
const apiController = require('../controller/api_controller');
const protected = require('../middlwware/authUser_token')

//USERS SECTION
router.post('/registration',apiController.Register);
router.post('/login',apiController.login);
router.get('/getUserBalance',protected,apiController.getWalletBalance);
 //Admin Section
router.post('/investmentplans',apiController.investmentplans);
router.post('/updateUserBlance',apiController.updateUserBalance);
router.post('/uploadWalletAddress',apiController.uploadWalletAddress);
router.post('/investments',protected,apiController.investments);
router.post('/editProfile',protected,apiController.editProfile);
router.get('/getInvestmentPlan',apiController.getInvestPlans);
router.get('/getAdmin_walletAddress/:coin',apiController.get_admin_wallet_address);
router.get('/crypto-price/:selectedCoin',apiController.getPrices);

module.exports = router;