const bcrypt=require('bcrypt');
module.exports=(sequelize,DataTypes)=>{
    const Manager=sequelize.define("Manager",{
        first_name:{
            type:DataTypes.STRING,
            allowNull:false,
            valiadtions:{
                len:[5,15]
            }
        },
        last_name:{
            type:DataTypes.STRING,
            allowNull:false,
            valiadtions:{
                len:[5,15]
            }

        },
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            valiadtions:{
                isEmail:true
            }
        },
        contact:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validations:{
                len:[0,10]
            }

        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        isAdmin:{
            type:DataTypes.BOOLEAN,
            defaultValue:true

        },

    },{
        getterMethods:{
            isAdmin:()=>{
                return this.getDataValue("isAdmin")
            }
        },
        
            instanceMethods:{
                generateHash(password){
                    return bcrypt.hash(password,bcrypt.gensaltsync(8));
                },
                validpassword(password){
                    return bcrypt.compare(password,this.password)
                }
            },
            freezeTableName:true
        
    });
    return Manager;
}