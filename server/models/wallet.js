// models/Wallet.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },

    currency:{
        type:String,
        default:"USD"
    },

    balance:{
        type:Number,
        default:0,
        min:0
    },

    profit:{
        type:Number,
        default:0
    },

    bonus:{
        type:Number,
        default:0
    },

    lockedBalance:{
        type:Number,
        default:0
    },

    updatedAt:{
        type:Date,
        default:Date.now
    }

});

walletSchema.index({ user:1, currency:1 });

module.exports = mongoose.model("Wallet", walletSchema);