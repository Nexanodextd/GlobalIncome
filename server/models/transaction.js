// models/Transaction.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },

    type:{
        type:String,
        enum:[
            "deposit",
            "withdrawal",
            "profit",
            "bonus",
            "trade",
            "transfer"
        ],
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    currency:{
        type:String,
        default:"USD"
    },

    status:{
        type:String,
        enum:[
            "pending",
            "completed",
            "failed",
            "rejected"
        ],
        default:"pending"
    },

    method:{
        type:String
        // BTC, ETH, USDT, Bank Transfer
    },

    txHash:{
        type:String
    },

    walletAddress:{
        type:String
    },

    description:{
        type:String
    },
    paymentReceipt:{
         type:String
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
    }

});

transactionSchema.index({ user:1 });
transactionSchema.index({ type:1 });
transactionSchema.index({ status:1 });

module.exports = mongoose.model("Transaction", transactionSchema);