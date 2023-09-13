const expense=require('../models/expense');
const Sequelize = require("../util/user");
const User=require('../models/user')
const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')

const createExpenseController=async(req,res)=>{
        console.log("id fetch>>>>>>>>>>"+ req.user) 
        const t=await Sequelize.transation()
    try{
       
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category
        

        if(amount===undefined||amount.length===0 ||description===undefined||description.length=== 0||category===undefined||category.length===0){
            return res.status(400).json({err:'bad parameters something is missing'})
        }
        
            console.log('this is postdata.............>>>>>>',amount,description)
            const data=await expense.create({
                amount:amount,
                description:description,
                category:category,
                userId:req.user.id
            },{
                transaction: t,
            })
            const user = await User.findByPk(req.user.id);
                if (!user) {
                     throw new Error("user not found")
                    }
                    const totalExpense = Number(user.totalExpense) + Number(amount)
                    console.log("totalExpense>>>", totalExpense)
                    await User.update(
                        {
                        totalExpense: totalExpense,
                        },
                        { where: { id: req.user.id }, transaction: t }
                    )
                    await t.commit()//this is fot updation of db
                    res.status(201).json({ Expense: totalExpense })
                    }
                    catch (err) {
                        console.log("error" + err);
                        await t.rollback()//for err
                        res.status(500).json({ error: err });
                    }
                }
    //         res.status(200).json({expensedata:data})
        
    //     }
    
    // catch(error){
    //     console.log("error..........>>>>>>>>>>",error)
    //     res.status(500).json({error:"failed to create expense"})
    // }


//getexpense
const getExpenseController=async(req,res)=>{
    try{
        const data =await expense.findAll({where:{userId:req.user.id}})
        console.log(req.user.id)
       return res.status(200).json({allexpensedata:data})

    }
    catch(err){
      console.log('get user is failing', JSON.stringify(err))
      res.status(500).json({error:err })
  }
}

//deltexpense
const deleteExpenseController=async(req,res)=>{
    try{
      const uId=req.params.id
        if(uId=='undefined'|| uId.length === 0){
            console.log('ID is missing')
            return res.status(400).json({success: false, })
        }

      const userTotalExpense= await  User.findAll({where:{id:req.user.id}})  
      let new_Expense
        try{
          console.log("Expenses >>>", userTotalExpense);
         
          userTotalExpense.forEach((expense) => {
            console.log("userTotalExpense >>>", expense.totalExpense);
            new_Expense=expense.totalExpense;
          });
        }     
        catch(error){
          console.error('Error fetching expenses:', error);
        };
       
        console.log("Expenses >>>", new_Expense);

        let deleteditemprice
        const getDeletedExpense= await  Expense.findOne({where:{id:uId,userId:req.user.id}})       
        try{         
         
          getDeletedExpense.forEach((expense) => {
            console.log("getDeletedExpense>>>", expense.amount);
            deleteditemprice=expense.amount
          })
        }     
        catch(error){
          console.error('Error fetching expenses:', error)
        };

       let updatedTotalExpense= new_Expense-deleteditemprice
       console.log("updatedTotalExpense>>>",updatedTotalExpense)

    
   const noofrows= await Expense.destroy({where:{id:uId,userId:req.user.id}})

    await User.update({totalExpense:updatedTotalExpense},{where:{id:req.user.id}})
   console.log("noofrows",noofrows)
   if(noofrows === 0){     
    return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
}
return res.status(200).json({ success: true, message: "Deleted Successfuly"})     

    }
    catch(err){
      console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    }
  }
 const downloadExpenses = async (req, res) => {
    try {
        if (!req.user.ispremiumuser) {
            return res.status(401).json({ success: false, message: 'User is not a premium User' });
        }

        
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });

        const s3 = new AWS.S3();

        const bucketName = 'subendhuexpensetracker'; 

        
        const objectKey = 'expenses' + uuidv1() + '.txt';

        
        const data = JSON.stringify(await req.user.getExpenses());

        const uploadParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: data
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        const fileUrl = uploadResult.Location;

        res.status(201).json({ fileUrl, success: true });
    } catch (err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
    }
}
 module.exports={createExpenseController,
  getExpenseController,
  deleteExpenseController,
  downloadExpenses
 }  

// second method**************
// exports.deleteExpense = async (req, res) => {
//   const t = await sequelize_db.transaction();
//   const uId = req.params.id;
//   try {
//     if (uId === undefined) {
//       console.log("id is missing");
//       res.status(400).json({ error: "ID is missing" });
//       return res.status(400).json({ success: false });
//     }
//     const noofrows = await Expense.destroy({
//       where: { id: uId, userId: req.user.id },
//     });
//     console.log("noofrows", noofrows);
//     // ****delete from user table
//     const user = await User.findOne({ where: { id: req.user.id } });
//     const expense = await Expense.findOne({
//       where: { id: uId, userId: req.user.id },
//     });
//     const totalExpense = user.totalExpense - user.amount;
//     await User.update(
//       {
//         totalExpense: totalExpense,
//       },
//       { where: { id: req.user.id }, transaction: t }
//     );
//     await t.commit();
//     await Expense.destroy({ where: { id: uId, userId: req.user.id } });
//     {
//       res.status(204).send();
//     }
//   } catch (error) {
//     await t.rollback();
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

//   if (noofrows === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "Expense doesnt belongs to the user",
//     });
//   }

//       return res
//     .status(200)
//     .json({ success: true, message: "Deleted Successfuly" });
// } catch (err) {
//   console.log(err);
//   return res.status(500).json({ success: true, message: "Failed" });
// }
// };

// ****delete from user table
//     const user = await User.findOne({ where: { id: req.user.id } });
//     const expense = await Expense.findOne({
//       where: { id: uId, userId: req.user.id },
//     });
//     const totalExpense = user.totalExpense - expense.amount;
//     await User.update(
//       {
//         totalExpense: totalExpense,
//       },
//       { where: { id: req.user.id }, transaction: t }
//     );
//     await t.commit();
//     await Expense.destroy({ where: { id: uId, userId: req.user.id } });
//     {
//       res.status(204).send();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };
