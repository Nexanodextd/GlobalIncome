const userModel = require('../models/users_model');
const Wallet  = require('../models/wallet');
const Kyc = require('../models/kyc');
const trans = require('../models/transaction');
const investmentHistory = require('../models/investment_model');
exports.home = async(req,res)=>{
      const locals={
           title:"Home - Globalincomeinvest"
      }
       res.render('Pages/index', locals)
}

exports.about = async(req,res)=>{
       const locals={
           title:"About- Globalincomeinvest"
      }
       res.render('Pages/about-us', locals)
}

exports.contact = async(req,res)=>{

         const locals={
           title:"Contact- Globalincomeinvest"
      }
       res.render('Pages/contact', locals)
}

// USERS DASHBORD

exports.dashboard = async(req,res)=>{
  
     
         const locals={
           title:"Dashboard- Globalincomeinvest"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
             const wallet = await Wallet.findOne({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
             const investments = await investmentHistory.find({user:ID});
             
              const totalInvestment_amount = investments.reduce((total,investment)=> total+investment.amount,0);
              totalAmount = totalInvestment_amount.toLocaleString();
              const balance = wallet.balance.toLocaleString({maximumFractionDigits:2});
        res.render('user/index',
          {
               locals,
               user,
               wallet,
               kyc,
               totalAmount,
               balance
          });
}

exports.deposit = async(req,res)=>{
     
         const locals={
           title:"Deposit"
            }

             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
             const wallet = await Wallet.findOne({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/deposit',
          {
               locals,
               user,
               kyc,
               wallet
          });
}
exports.payment = async(req,res)=>{
      const locals={
           title:"payment"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
             //const wallet = await Wallet.findOne({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/payment',
          {
               locals,   
               user,
               kyc
          });
}
exports.depositHistory = async(req,res)=>{
      const locals={
           title:"Deposit History"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
             const transHistory = await trans.find({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/deposit_history',
          {
               locals,   
               user,
               kyc,
               transHistory
          });
}

exports.investmentPlans = async(req,res)=>{
       const locals={
           title:"Investment Plans"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
            // const transHistory = await trans.find({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/investment-plans',
          {
               locals,   
               user,
               kyc,
              
          });
}
exports.investmentHistory = async(req,res)=>{
       const locals={
           title:"Investment History"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
             const investHistory = await investmentHistory.find({user:ID});
        res.render('user/investment-history',
          {
               locals,   
               user,
               investHistory
              
          });
}
exports.portforlio = async(req,res)=>{

      const locals={
           title:"Portfolio"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
            // const transHistory = await trans.find({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/portfolio',
          {
               locals,   
               user,
               kyc,
              
          });
}
exports.profile = async(req,res)=>{

      const locals={
           title:"Profile"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
              
            // const transHistory = await trans.find({user:ID});
             const kyc = await Kyc.findOne({user:ID});
             
        res.render('user/profile',
          {
               locals,   
               user,
               kyc,
              
          });
}

exports.withdrawal = async(req,res)=>{

      const locals={
           title:"Withdrawal"
            }
             const ID = req.user.id;
             const user = await userModel.findOne({_id:ID});
              
        res.render('user/withdrawal',
          {
               locals,   
               user,
              
              
          });
}

