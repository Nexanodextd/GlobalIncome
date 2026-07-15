// models/KYC.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const kycSchema = new Schema({

    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },

    idType:{
        type:String,
        enum:[
            "None Yet",
            "passport",
            "national_id",
            "drivers_license"
        ],
        default:"None Yet",
        required:true
    },

    idNumber:{
        type:String
    },

    idFrontImage:{
        type:String
    },

    idBackImage:{
        type:String
    },

    selfieImage:{
        type:String
    },

    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ],
        default:"pending"
    },

    reviewedBy:{
        type:Schema.Types.ObjectId,
        ref:"Users"
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports = mongoose.model("KYC", kycSchema);