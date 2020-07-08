const db =require('../models');
const saveToUploads=require('../config/multer');

function router(app){
    // finding all rooms 
    app.get('/rooms',(req,res,next)=>{
        db.Room.findAll({})
        .then((results)=>{
            res.render('rooms',{rooms:results})
        }).catch((err)=>{
        console.error(err);
        next(err);
        })
    });

// adding a room --admin
app.post('/room',saveToUploads,(req,res,next)=>{
    db.Room.create({
        room_type:req.body.room_type,
        room_price:req.body.room_price,
        description:req.body.description
    }).then((results)=>{
        res.render('rooms',{
           rooms:results 
        }).catch((err)=>{
            console.error(err);
            next(err);
        })
    })

});
// rooms -- unbooked 
app.get('/rooms/book',(req,res,next)=>{
    db.Rooms.findAll({
        where:{
            isavailable:true
        }
    }).then((result)=>{
        res.render('bookroom',{
            bookroom:result
        })
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
})
// searching aroom -- using keywords
app.get('/search/keyword',(req,res,next)=>{
    db.Room.findAll({
        where:{
            $or:{
                room_type:{
                    $like:"%"+req.params.keyword+"%"
                },
                room_price:{
                    $like:"%"+req.params.keyword+"%"
                },
                description:{
                    $like:"%"+req.params.keyword+"%"
                }
            }
        }
    }).then((dbrooms)=>{
        res.render('search',{results:dbrooms})
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
})


// deleting room admin
app.delete('/room/delete/:id',(req,res,next)=>{
    db.Room.destroy({
        where:{
            id:req.params.id
        }
    }).then(()=>{
        res.redirect('/rooms')
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
});

app.get('/rooms/:id',(req,res,next)=>{
    db.Room.findOne({
        where:{
            id:req.params.id
        }
    }).then((results)=>{
        res.render('room',{
            room:results
        })
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
});
// updating room data-- admin
app.patch('/room/update/:id',(req,res,next)=>{
    db.Room.update({
        room_type:req.body.room_type,
        room_price:req.body.room_price,
        description:req.body.description,
        where:{
            id:req.params.id
        }

    }).then(()=>{
        res.redirect('/rooms')
    }).catch((err)=>{
        console.error(err);
        next(err);
    })
})

app.get('/file/:name', function (req, res, next) {
    var options = {
      root: path.join(__dirname, '/uploads'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    }
  
    var fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err)
      } else {
        console.log('Sent:', fileName)
      }
    })
  })

}
module.exports= router;