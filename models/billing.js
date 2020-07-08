module.exports=(sequelize,DataTypes)=>{

const Billing=sequelize.define('Billings',{
    payment_method:{
        type:DataTypes.STRING,
        allownull:false
    },
    amount:{
        type:DataTypes.INTEGER,
        allownull:false

    }

},
{
    freezeTableName:true
}
);
Billing.associate=function(models){
    Billing.belongsTo(models.Customer,{
        foreignkey:{
            allownull:false
        }
    })
    Billing.belongsTo(models.Room,{
        allownull:false
    })
}
return Billing;
}