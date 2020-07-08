const db =require('../models');
function isloggedin(){
    if(req.isauthenticated())
    return next();
    res.redirect('/customer/login')
}

  module.exports= function router(app){
    app.get('/booking',isloggedin,(req,res,next)=>{
        db.Room.findOne({
            attributes:['room_type','room_price','description'],
            where:{
                id:req.params.id
            }

        }).then((data1)=>{
            db.Booking.Update({
                start_date:req.body.start_date,
                end_date:req.body.end_date,
                roomId:data1.dataValues.id,
                customerId:data1.req.user.id
            }).then((data2)=>{
                db.Room.update({
                    customerId:data2.req.user.id,
                    available:false

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
    app.get('/room/guest/:id',isloggedin,(req,res,next)=>{
        db.Room.findOne({
            where:{
                customerId:req.user.id
            }
        }).then((data)=>{
            db.Bookings.destroy({
                attributes:['customerId','roomId'],
                where:{
                    end_date:req.user.end_date

                }
            }).then((data1)=>{
                db.Room.update({
                    isavailable:true,
                    where:{
                        customerId:data1.dataValues.customerId

                    }
                })
            }).catch((err)=>{
                console.error(err);
                next(err)
            })
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })


}
