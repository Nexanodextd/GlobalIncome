// models/Trade.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tradeSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },

    asset:{
        type:String,
        required:true
        // BTC/USD, ETH/USD etc
    },

    tradeType:{
        type:String,
        enum:["buy","sell"],
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    leverage:{
        type:Number,
        default:1
    },

    entryPrice:{
        type:Number,
        required:true
    },

    exitPrice:{
        type:Number,
        default:0
    },

    profitLoss:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["open","closed"],
        default:"open"
    },

    openedAt:{
        type:Date,
        default:Date.now
    },

    closedAt:{
        type:Date
    }

});

module.exports = mongoose.model("Trade", tradeSchema);