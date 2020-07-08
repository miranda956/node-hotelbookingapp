
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bycrpt=require('bycrypt');

module.exports=(passport)=>{
    var Customer=db.Customers;
    var Admin=db.Manager;
    passport.serializeUser(function(user, done) {
        return done(null, { id: user.id, isAdmin: user.isAdmin });
      });
    
      passport.deserializeUser(function(id, done) {
        if (!id.isAdmin) {
          Customer.findById(id.id).then(function(user) {
            if (user) {
              done(null, user.get());
            }
          }).catch(function (err) {
            console.log(err);
          });
        }
        else if (id.isAdmin) {
          Admin.findById(id.id).then(function(user) {
            if (user) {
              done(null, user.get());
            }
          }).catch(function (err) {
            console.log(err);
          });
        }
      });
      // --customer sign in
passport.use('local-signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(email,password,done)=>{
    db.Customer.findOne({
        where:{
            email:email
        }
    }).then((dbCustomer)=>{
        if(!dbCustomer){
            return done (null,false)
        } else if(!dbCustomer.validpassword(password)){
            return done (null,false)
        }
        return done(null,dbCustomer)
    })

}));

// admin--signin

passport.use('local-signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},(email,password,done)=>{
    
    db.Manager.findOne({
        where:{
            email:email
        }
    }).then((dbManager)=>{
        if(!dbManager){
            return done(null,false,{
                message:'invalid email'
            })
        } else if(!dbManager.validpassword(password)){
            return done(null,false,{
                message:'invalid password'
            })
        } 
        return done(null,dbManager)
    })

}))

}