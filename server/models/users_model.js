const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name: {
        type: String,
        require: true,
        trim: true
    },
    Username: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Phone: {
        type: Number,
        require: true
    },
    Gender: {
        type: String,
        require: true
    },
    Country: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    Account_Type: {
        type: String,
        enum: ["Basic", "Silver", "Gold", "VIP"],
        default: "Basic"
    },
    referralCode: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address:{
        type:String,
        required:false
    },
    dob:{
         type:String,
         required:false

    },
    displayPicture:{
         type:String,
         required:false
    },
    createAt: {
        type: String, // Store as a formatted string
        default: function () {
            let today = new Date();
            let day = String(today.getDate()).padStart(2, "0");
            let month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
            let year = today.getFullYear();
            return `${day}-${month}-${year}`
        }
    }
})


module.exports = mongoose.model("Users", userSchema);