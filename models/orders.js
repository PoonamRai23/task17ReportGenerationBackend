const Sequelize = require('sequelize');
const sequelize = require('../util/user');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: Sequelize.STRING,// will get this when payment is succesfull//razorpay se milega
    orderid: Sequelize.STRING,//this is orderid we get from razpay &when we click on buypremium
    status: Sequelize.STRING //currently pending
})

module.exports = Order;