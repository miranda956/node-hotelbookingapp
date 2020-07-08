// importing modules
const express =require('express');
const helmet =require('helmet');
const bodyparser=require("body-parser");
const flash=require("connect-flash");
const exhbs=require("express-handlebars");
const methodoverride=require("method-override");
const passport =require("passport");
const logger=require("morgan");
const session=require("express-session");
const db=require("./models");
const auth=require("./config/passport/Passport");

const app=express();
const port=process.env.PORT|| 4040;
app.use(bodyparser.urlencoded({extended:false}));
app.use(methodoverride("_method"));
app.use(session({
  secret:'123456',
  resave:true,
  saveUninitialized:true
}));
app.use(helmet.xssFilter());
app.use(helmet({
  frameguard:{
    action:'deny'
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.engine("handlebars",exhbs({defaultLayout:"main"}));
app.set("view engine","handlebars");
app.use(express.static("public"));



/*app.use("/",function(req,res){
  res.render('index')
});*/

db.sequelize.sync({force:false}).then(()=>{
  // accessing models sync 
  // force is set to false to avoid tables from being droped or overridden 
  app.listen(port,function(err){
    if(!err){
    console.log(`application listening on the port ${port}`)
    }else {
      console.log(JSON.stringify(err));
    }
    
  });
});
