const sequelize=require('sequelize')
const Sequelize=require('../util/user')
const expense=Sequelize.define('expense',{
    id:{
        type:sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true
    },
    amount:{
        type:sequelize.INTEGER,
       
    },
    description:{
        type:sequelize.STRING,
       
    },
    category:{
        type:sequelize.STRING,
       
    }

})
module.exports=expense