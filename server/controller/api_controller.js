
const UserModel = require('../models/users_model');
const Wallet = require('../models/wallet');
const KYC = require('../models/kyc');
const InvestPlansModel = require('../models/investmentplans');
const generateReferralCode = require("../utils/generateReferralCode");
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const walletAddress_model = require('../models/walletAddress_model');
const investment = require('../models/investment_model')
const prices = require("../utils/websocket");
const users_model = require('../models/users_model');


const checkuserName = async (username) => {

    const userName = await UserModel.findOne({ Username: username })
    return userName;

}
const checkEmail = async (email) => {
    const userEmail = await UserModel.findOne({ Email: email });
    return userEmail;
}
exports.Register = async (req, res) => {
    const { Name, Username, Email, Phone, Gender, Country, Password, Account_Type } = req.body;
    const referralcode = generateReferralCode();
    try {
        const existingUser = await checkuserName(Username);
        if (existingUser) {
            return res.json({ sucess: false, message: "Username already exsists", status: 400 });
        }

        const existingEmail = await checkEmail(Email);
        if (existingEmail) {
            return res.json({ seccess: false, message: "Email Already exists", status: 402 })
        }

        const hashed = await bcrypt.hash(Password, 10);
        const user = await UserModel.create({ Name, Username, Email, Phone, Gender, Country, Password: hashed, Account_Type, referralCode: referralcode });
        if (user) {

            // creating wallet
            const wallet = await Wallet.create({
                user: user._id,
                currency: "USD",
                balance: 0,
                profit: 0,
                bonus: 0,
                lockedBalance: 0
            });

            // creating DEFAULT KYC
            const kyc = await KYC.create({
                user: user._id,
                status: "pending"
            })

            res.json({
                data: { user, wallet, kyc },
                success: true,
                status: 200
            })
        }


    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message })
    }

}


exports.login = async (req, res) => {

    const { identifier, password } = req.body;
    if (identifier == null && password == null) {
        res.json({ status: 400, message: "Input field empty" })
    } else {
        try {
            const user = await UserModel.findOne({ $or: [{ Username: identifier }, { Email: identifier }] });
            if (!user) {
                console.log("User not Found")
                res.json({
                    success: false,
                    status: 400,
                    message: "User not found"
                });
            }
            const match = await bcrypt.compare(password, user.Password);
            if (!match) {
                console.log("Incorrect password")
                res.json({ success: false, status: 400, message: "Incorrect password" });
            } else {
                res.cookie("jwt_token", generateToken(user), { httpOnly: true, maxAge: 36000000 })
                res.json({ token: generateToken(user), user, status: 200 })
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

exports.investments = async (req, res) => {
    const { investName, amount, duration } = req.body;
    const userid = req.user.id;
    const wallet = await Wallet.findOne({ user: userid });
    if (!wallet) {
        return res.status(400).json({
            success: false,
            message: "wallet not found"
        });
    }
    if (wallet.balance < amount) {
        console.log("Insufficient Balance")
        return res.json({
            success: false,
            message: "Insufficient Balance"
        });
    }
    await investment.create({ user: userid, amount: amount, duration: duration, packageName: investName })
        .then(data => {
            res.status(200).json({
                success: true,
                message: "Investment Successfull",
                data: data
            });
        }).catch(err => {
            res.json({ error: err.message });
        })
    wallet.balance -= amount;
    await wallet.save();
}
//Admin section

exports.investmentplans = async (req, res) => {
    const { investmentName, minInvestment, maxInvestment, returnRate, duration, potentialReturn } = req.body
    if (investmentName === '' || minInvestment === '' || maxInvestment === '' || returnRate === '' || duration === '' || potentialReturn === '') {
        res.status(500).json({ message: "Please fill all the fields" })
    } else {
        try {
            const investResult = await InvestPlansModel.create({ investment_name: investmentName, min_investment: minInvestment, max_investment: maxInvestment, return_rate: returnRate, duration: duration, potential_return: potentialReturn })
            if (investResult) {

                res.status(200).json({
                    message: "Success",
                    data: investResult
                })
            }
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
    console.log(req.body)
}



exports.getInvestPlans = async (req, res) => {
    await InvestPlansModel.find()
        .then(result => {
            res.status(200).json({ status: "success", data: result })
        }).catch(err => {
            console.log(err.message)
            res.status(500).json({ error: err.message })
        })
}

exports.updateUserBalance = async (req, res) => {
    const { userid, newbalance } = req.body;
    try {
        const User = await Wallet.findOne({ user: userid });
        const currentBalance = Number(newbalance) + User.balance;
        const updateBalance = await Wallet.findOneAndUpdate({ user: userid }, { balance: currentBalance }, { new: true })
        res.status(200).json({ status: "success updated", data: updateBalance })

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ error: err.message })
    }
}

exports.uploadWalletAddress = async (req, res) => {
    const { walletAddress, coin } = req.body;
    if (walletAddress == '' || coin == '') {
        res.status(500).json({ error: 'please fill in the fields' })
    } else {
        try {

            const wallet = await walletAddress_model.create({ walletAddress: walletAddress, coin: coin });
            res.status(200).json({ status: "successfull", data: wallet })
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    console.log(req.body)
    res.json({ data: req.body })
}
exports.get_admin_wallet_address = async (req, res) => {
    const coin = req.params.coin;
    await walletAddress_model.findOne({ coin: coin })
        .then(rs => {
            res.status(200).json({ data: rs.walletAddress });
            console.log(rs.walletAddress);
        }).catch(err => {
            res.status(500).json({ error: err.message });
        })


}
exports.getPrices = (req, res) => {
    const coin = req.params.selectedCoin.toUpperCase();
    if (!prices[coin]) {
        return res.status(404).json({
            success: false,
            message: "Price not available"
        });
    }
    console.log("Price: " + prices[coin].price + "\n" + "coin: " + coin)
    res.json({
        success: true,
        coin: coin,
        price: prices[coin].price
    });
}

exports.getWalletBalance = async (req, res) => {
    try {
        const userid = req.user.id;
        const getbalance = await Wallet.findOne({ user: userid });
        res.json({
            success: true,
            data:getbalance

        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

exports.editProfile = async(req,res)=>{
         const userid = req.user.id;
         const {dob,address} = req.body;
         try{
                 const update_user = await users_model.updateOne({_id:userid},{dob:dob,address:address})
                 res.status(200).json({
                      success:true,
                      message:"Record successfully updated",
                      data:update_user
                 })
         }catch(err){
              res.status(400).json({
                     success:false,
                     message:err.message
              })
         }
}

