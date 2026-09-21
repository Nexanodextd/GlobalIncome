
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./server/config/db');

const cors = require('cors')
require ('dotenv').config();;
const app = express();
const port = 8000;
connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//calling Static Files
app.use(express.static('public'));
app.set('view engine','ejs');

//require('./server/utils/websocket')(io);


app.use ('/',require('./server/routes/routePages'));
app.use('/api',require('./server/routes/api_routes'));
app.use('/trans_api',require('./server/routes/trans_routes'));
app.use('/trade_api',require('./server/routes/trade_routes'));


/*app.use((req,res,next)=>{
    
    locals={
        title:"404"
    }
    res.render('userPages/404',locals)
    //res.render('pages/app-404',{locals})
})*/

app.listen(port,()=>{
     console.log(` Application Listening to http://localhost:${port}`);
})