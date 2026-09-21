const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletAddressSchema = new Schema({

    walletAddress:{
          type:String,
          required:true

    },

    coin:{
         type:String,
         required:true
    },
    qrcode:{
        type:String
    }

});


module.exports = mongoose.model("walletAddress", walletAddressSchema);