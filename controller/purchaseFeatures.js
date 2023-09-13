const User = require('../models/user');
const Expense = require('../models/expense');
const user = require('./user');



const getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll(
            {
                // attributes:['id','name',[sequelize.fn('sum',sequelize.col('expenses.price')),'total_cost']],
                // include:[
                //     {
                //         model:Expense,
                //         attributes:[]
                //     }

                // ],
                // group:['user.id'],
                order:[[('totalExpense'),'DESC']]
                
            }
        );
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
      
        // const userAggregatedExpenses = {};
        // expenses.forEach((expense) => {
        //     if (userAggregatedExpenses[expense.userId]) {
        //         userAggregatedExpenses[expense.userId] += expense.price;
        //     } else {
        //         userAggregatedExpenses[expense.userId] = expense.price;
        //     }
        // }) ;

        // const UserLeaderBoardDetails = [];
        // users.forEach((user) => {
        //     UserLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] || 0 });
        // });

        // UserLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
                
        
    

module.exports = {
    getUserLeaderBoard
};