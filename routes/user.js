const express=require('express')
const router=express.Router()
const path=require('path')
const user=require('../models/user')
const bcrypt=require('bcrypt')
const expense=require('../models/expense')
const expenseController=require('../controller/user')
const middleware=require('../middleware/auth')
const jwt=require('jsonwebtoken')
const cors=require('cors')
router.use(cors())
const bodyparser=require('body-parser')

router.use(bodyparser.urlencoded({extended:true}))
router.use(bodyparser.json())
 router.use(express.static(path.join(__dirname,'views')))



router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','html' ,'signup.html'))
    console.log("hhiii")
})

router.post('/sign-up',expenseController.createSignupController)

router.post('/login',expenseController.createloginController)

module.exports=router