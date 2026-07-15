const jwt = require("jsonwebtoken");

const generateToken = function(user){
     return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1hr" }
  );
}
module.exports = generateToken;