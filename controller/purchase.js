const Razorpay=require('razorpay')
const Order=require('../models/orders')
const usercontroller=require('./user')
const purchasepremium = async(req,res)=>{
    try{
        const rzp=new Razorpay({
            key_id: "rzp_test_oPoXYZfEdkItf5",
            key_secret:"pNlFM8vpD5pmpicVKbs6eSph"
        })//it means razpay knows ysah compny creat an order

        const amount=2500//its charge for premium membership
//order.creat this is mtd
        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error('this is errr>>....',JSON.stringify(err))
            }
            //order.id =it is razorpay order id
            req.user.createOrder({orderid:order.id,status:"PENDING"}).then(()=>{
                return res.status(201).json({order,key_id:rzp.key_id})
            })
            .catch(err=>{
                throw new Error('this is errr333>>....',err)
            })
          
        })
        
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message:"something went wrong",error:err})
    }
}
const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user.id;
        const { payment_id, order_id} = req.body;
        const order  = await Order.findOne({where : {orderid : order_id}})
        console.log("orderid>>>>", order_id)
        
        if(!order){
            return res.status(404).json({ message: "Order not found" })
        }
        const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
        const promise2 =  req.user.update({ ispremiumuser: true }) 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({sucess: true, message:"Transaction Successful",token:usercontroller.genrateAccessToken(userId,undefined,true) });
        }).catch((error ) => {
            throw new Error("err during promise.all",error)
        })

       } catch (err) {
        console.log("Error in updateTransactionStatus:",err);
        res.status(403).json({ error: err, message: 'Sometghing went wrong',error:err })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}