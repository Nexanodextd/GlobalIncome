const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },


        paymentMethod: {
            type: String,
            enum: ["USDT", "BTC", "ETH", "BCH", "Bank"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },

        // Crypto details
        walletAddress: {
            type: String,
            default: null
        },

        // Bank details
        accountName: {
            type: String,
            default: null
        },

        accountNumber: {
            type: String,
            default: null
        },

        bankName: {
            type: String,
            default: null
        },

        createdAt:{
         type: String, // Store as a formatted string
        default: function () {
            let today = new Date();
            let day = String(today.getDate()).padStart(2, "0");
            let month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            let year = today.getFullYear();
            return `${day}-${month}-${year}`
        }
    },

        reference: {
            type: String,
            unique: true,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Withdrawal", transactionSchema);