
module.exports=(sequelize,DataTypes)=>{
const Room= sequelize.define('Room',{
room_type:{
    type:DataTypes.STRING,
    allownull:false

},
room_price:{
    type:DataTypes.INTEGER,
    allownull:false
},
description:{
    type:DataTypes.TEXT,
    allownull:false
},
isavailable:{
    type:DataTypes.BOOLEAN,
    allownull:false
},
img:{
    type:DataTypes.STRING,
    allownull:false
}

},
{
    freezeTableName:true
});

Room.associate=function(models){
    Room.belongsTo(models.Customer,{
        foreignkey:{
            allownull:false
        }
    })

}

return Room;
}