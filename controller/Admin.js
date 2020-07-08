const sequelize=require('sequelize')
const db =require('../models');
const passport=require('passport');
function isloggedin(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect('/admin/login')
}
function router(app) {

app.get('/admin',(req,res)=>{
    res.redirect('/admin/login')
})
app.get('/admin/login',(req,res)=>{
    res.render('adminlogin')
})
app.post('/admin/login',passport.authenticate('admin-login',{
    successRedirect:'/admin/menu',
    failureRedirect:'admin/login'

}));
app.get('/admin/logout',isloggedin,(req,res,next)=>{
    req.session.destroy((err)=>{
        next(err);
        res.redirect('/admin/login')
    })
})

    // regester --admin 
    app.post('/admin/regester',(req,res,next)=>{
        db.Manager.create({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            contact:req.body.contact,
            email:req.body.email,
            password:req.body.password
        }).then((result)=>{
            
            res.render('admin/regester',{admin:result})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })
    // view all rooms 
    app.get('/admin/room',isloggedin,(req,res,next)=>{
        db.Room.findAll({}).then((result)=>{
            res.render('rooms',{rooms:result})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    }) 
    // view all bookings
    app.get('admin/bookings',isloggedin,(req,res)=>{
        db.Bookings.findAll({
            include:[db.Rooms,db.Customer]
        }).then((result)=>{
            res.render('bookings',{bookings:result})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })
    //view --billings
    app.get('admin/billing',isloggedin,(req,res,next)=>{
        db.Billings.findAll({
            where:{
                customerId:req.user.id
            },
            include:[db.Customers,db.Rooms]
        }).then((result)=>{
            res.render('billings',{billings:result})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })
    // view -- customer bookings
    app.get('/customer/booking',isloggedin,(req,res,next)=>{
     let{bookdata,customerdata,roomdata}
     db.Customer.findOne({
         attributes:['first_name','last_name','email','contact'],
         where:{
             id:req.user.id
         }
     }).then((dbCustomer)=>{
         customerdata=dbCustomer;
         db.Room.findAll({
             attributes:['room_type','room_price','description'],
             
                 where:{
                     customerId:req.user.id
                     
                 }
   
         }).then((dbRoom)=>{
             roomdata=dbRoom;
             db.Bookings.findAll({
                 attributes:['start_date','end_date','RoomId'],
                 where:{
                     customerId:req.user.id
                 }
             }).then((dbBookings)=>{
                 bookdata=dbBookings;
                 res.render('customerinfo',{
      customer:customerdata,rooms:roomdata,bookings:bookdata               
                 })
             }).catch((err)=>{
                 console.error(err);
                 next(err)
             })
         }).catch((err)=>{
             console.error(err);
             next(err);
         })
         
         
     }).catch((err)=>{
         console.error(err);
         next(err);
     })
    })
    // view -- account 
    app.get('/admin/:id',isloggedin,(req,res,next)=>{
        db.Manager.findAll({
            where:{
                id:req.user.id
            }
        }).then((result)=>{
            res.render('admininfo',{admininfo:result})
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })
    // edit info
    app.patch('/admin/update/:id',isloggedin,(req,res,next)=>{
        db.Manager.update({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            contact:req.body.contact,
            password:req.body.password
        }).then(()=>{
            res.redirect('/admin')
        }).catch((err)=>{
            console.error(err);
            next(err);
        });
    });
    // delete account
    app.delete('/admin/delete/:id',isloggedin,(req,res,next)=>{
        db.Manager.destroy({
            where:{
                id:req.user.id
            }
        }).then(()=>{
            res.redirect('/admin/login')
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })

}
module.exports=router;