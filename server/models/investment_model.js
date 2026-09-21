const mongoose = require('mongoose');

const schema = mongoose.Schema;

const investmentSchema = new schema({
     user:{
        type:schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    amount:{
         type:Number,
         required:true
    },

    profit:{
          type:Number,
          default:0
    },
    duration:{
         type:String,
         required:true
    },
    packageName:{
         type:String,
         required:true
    }, createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('investment',investmentSchema);