
const db=require('../models');
const passport =require('passport');

function isloggedin(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect('/customer/login');
}
function router(app){
    app.get('/customer',(req,res)=>{
        res.redirect('/customer/login');
        
    })
    app.get('/customer/login',(req,res)=>{
        res.render('customerlogin')
    })
    app.post('/customer/login',passport.authenticate('local-signup',{
        successRedirect:'/room/book',
        failureRedirect:'/customer/login'
    }));
    // customer --logout
    app.get('/customer/logout',isloggedin,(req,res)=>{
        req.session.destroy((err)=>{
            next(err);
            res.redirect('customer/login')
        })
    })
    // posting customer data
    app.post('/customer/regester',(req,res,next)=>{
        db.Customer.create({
            first_name:req.body.first_name,
            last_name:req.body.lastname,
            email:req.body.email,
            contact:req.body.contact,
            password:req.body.password  
        }).then((results)=>{
            res.render('customer/regester',{customer:results})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })

    })
    // booking -- room

    // customer --info
    app.get('/customer/:id',isloggedin,(req,res,next)=>{
        db.Customer.findAll({
            where:{
                id:req.user.id
            }
        }).then((result1)=>{
            db.Booking.findAll({
                where:{
                    customerId:req.user.id
                },
                include:[db.Room]
            }).then((result2)=>{
                res.render('customer',{result1,result2,user:req.user})
            }).catch((err)=>{
                console.error(err);
                next(err);
            })

        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })
    // edit info 
    app.patch('/customer/:id',(req,res,next)=>{
        db.Customer.update({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            contact:req.body.contact,
            password:req.body.password
        }).then(()=>{
            res.redirect('customer-info')
        }).catch((err)=>{
            console.error(err);
        })
    })
// delete account
app.delete('/customer/:id',(req,res,next)=>{
    db.Customer.destroy({
        where:{
            id:req.user.id
        }
    }).then(()=>{
        res.redirect('/')
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
})



}
module.exports=router;