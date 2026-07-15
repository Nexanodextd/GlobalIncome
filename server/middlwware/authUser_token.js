const jwt = require('jsonwebtoken');

const protect =(req,res,next)=>{
    const token = req.cookies.jwt_token;
    if(!token){
        // return res.status(401).json({message:"No token"})
         res.redirect('/login');
    }

    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();


    }catch(err){
        // res.status(401).json({message:"Invalid Token"});
        res.redirect('/login');
    }
}

module.exports = protect;