const sequelize=require('sequelize')
const Sequelize=require('../util/user')
const user=Sequelize.define('user',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    name:{
       type:sequelize.STRING,
    },
    email:{
        type:sequelize.STRING,
        allowNull:false,
         unique:true
    },
    password:{
        type:sequelize.STRING,
        allowNull:false

    },
    ispremiumuser:{
        type:sequelize.BOOLEAN,
    },
    totalExpense:{
        type:sequelize.INTEGER,
        defaultValue:0,
       
    }
   
})
module.exports=user