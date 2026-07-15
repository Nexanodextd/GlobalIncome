const express = require('express');
const router = express.Router();
 const controllpages = require('../controller/controlpages');
 const authController = require('../controller/auth_controller')
 const protected = require('../middlwware/authUser_token')

router.get('/',controllpages.home)
router.get('/about',controllpages.about)
router.get('/contact',controllpages.contact)
 router.get('/register',authController.register);
router.get('/login',authController.login);
router.get('/logout',authController.logout)
router.get('/dashboard',protected,controllpages.dashboard);
router.get('/deposit',protected,controllpages.deposit);
router.get('/payment',protected,controllpages.payment);
router.get('/depositHistory',protected,controllpages.depositHistory);
router.get('/investmentPlans',protected,controllpages.investmentPlans);



module.exports =router;