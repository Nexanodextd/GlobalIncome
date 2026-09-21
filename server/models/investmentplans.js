const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const investmentPlansSchema = new Schema({
       investment_name:{
         type:String,
         required:true
       },
       min_investment:{
         type:Number,
         required:true,
         default:0
       },
       max_investment:{
        type:Number,
        required:true,
        defualt:0
       },
       return_rate:{
           type:Number,
          required:true,
           defualt:0
       },
       duration:{
         type:String,
         required:true
       },
       potential_return:{
         type:Number,
        defualt:0
       }

})

module.exports = mongoose.model("InvestmentPlans", investmentPlansSchema);
