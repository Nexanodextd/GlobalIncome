
const UserModel = require('../models/users_model');
const Wallet = require('../models/wallet');
const KYC = require('../models/kyc');
const generateReferralCode = require("../utils/generateReferralCode");
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');


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
        const user = await UserModel.create({ Name, Username, Email, Phone, Gender, Country, Password: hashed, Account_Type,referralCode:referralcode });
        if (user) {
            
            // creating wallet
              const wallet = await Wallet.create({
                user:user._id,
                currency:"USD",
                balance:0,
                profit:0,
                bonus:0,
               lockedBalance:0
        });

        // creating DEFAULT KYC
        const kyc = await KYC.create({
            user:user._id,
            status:"pending"
        })
            
            res.json({
                data:{user,wallet,kyc},
                success: true,
                status:200
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
