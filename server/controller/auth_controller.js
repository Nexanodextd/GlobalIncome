exports.register = async(req,res)=>{
        const locals ={
              title:"Globalincomeinvest- Register"
        }
        res.render('auth/register')
}
exports.login = async(req,res)=>{
       res.render('auth/login')
}

exports.logout = async(req,res)=>{
    res.clearCookie("jwt_token");
    res.render('auth/login');
}