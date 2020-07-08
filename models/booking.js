module.exports=(sequelize,DataTypes)=>{
    const Booking=sequelize.define('Booking',{
        start_date:{
            type:DataTypes.DATE,
            allownull:false
        },
        end_date:{
           type:DataTypes.DATE,
           allownull:false 
        }


    },
    {
        freezeTableName:true
    }
    
    );
    Booking.associate=function(models){
        Booking.belongsTo(models.Customer,{
            allownull:false
        })
        Booking.belongsTo(models.Room,{
            allownull:false
        })
    }

return Booking;

}