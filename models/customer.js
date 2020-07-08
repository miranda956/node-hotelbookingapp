const bcrypt=require('bcrypt');
module.exports=(sequelize,DataTypes)=>{
const Customer=sequelize.define('Customer',{
    first_name:{
        type:DataTypes.STRING,
        allownull:false
    },
    last_name:{
        type:DataTypes.STRING,
        allownull:false
    },
    email:{
        type:DataTypes.STRING,
        allownull:false,
        validate:{
            isEmail:true
        }
    },
    contact:{
        type:DataTypes.INTEGER,
        allownull:false,
        validate:{
            len:[0,10]
        }
    },
password:{
    type:DataTypes.STRING,
    allownull:false,
    validate:{
        len:[8,15]
    }

},



},{
    instanceMethods:{
        generateHash(password){
            return bcrypt.hash(password,bcrypt.genSaltsync(8));
        },
        validpassword(password){
            return bcrypt.compare(password,this.password)
        }
        
    },
    freezeTableName:true
    

});

return Customer;
}