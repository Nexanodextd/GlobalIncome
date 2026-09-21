const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depositSchema = new Schema({
       user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    paymentAmount:{
          type:Numnber,
          require:true

    },
    paymentMethod:{
           type:String,
           require:true
    },
    proveImage:{
         type:String,
         require:true
    },
    paymentStatus:{
        type:String,
        require:true
    },
     createdAt: {
        type: String,
        default: () =>
            new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
    }
},{timestamps:true})

module.exports = mongoose.model('depositPayment',depositSchema);  