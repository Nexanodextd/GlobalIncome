const wallet = require('../models/wallet');
const transaction = require('../models/transaction');

exports.transaction = async(req,res)=>{

    console.log(req.body);
    console.log(req.file)
      const walletAddress = req.body.walletAddress;
      const amount = parseInt(req.body.paymentAmount);
      const userid = req.body.userid;
      const paymentMethod = req.body.paymentMethod;
      const depositType = req.body.depositType;
     const image = req.file.filename;
      await transaction.create({
        user:userid,
        type:depositType,
        amount:amount,
        method:paymentMethod,
        walletAddress:walletAddress,
        paymentReceipt:image
    }).then(result=>{
           res.json({message:"successfull",data:result})
    }).catch(err=>{
          res.json({message:err.message})
    })
   
}

exports.getDepositHistory = async(req,res)=>{

   const getid = req.user._id
   console.log(getid)


}

