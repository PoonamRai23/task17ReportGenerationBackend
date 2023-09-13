const express = require("express");
const user=require('../models/user')
const bcrypt=require('bcrypt')
const jwt =require('jsonwebtoken')
const database=require('../util/user')

const createSignupController=async(req,res)=>{
    try{
    const name=req.body.name
    const email=req.body.email
    const password=req.body.password

    console.log("this is req data>>>>>>>>>>>>>>>>>>>>",name, email,password)
       

    if(name===undefined||name.length===0 ||password===undefined||password.length=== 0||email===undefined||email.length===0){
        return res.status(400).json({err:'bad parameters something is missing'})
    }
//pwd encrypt
    let saltrounds=10
    bcrypt.hash(password,saltrounds,async(err,hash)=>{

    console.log("this is server end response",name,email,password)
    const data=await user.create({
        name:name,
        email:email,
        password:hash
    })
   return res.status(200).json({addexpense:data,message:"post data"})
})  
}
catch(error){
    console.log("failed",error)
    return res.status(500).json({error:"failed to post data"})
}

}

//function for authentication

function genrateAccessToken(id,name,ispremiumuser)
{
    return jwt.sign({userId:id,name:name,ispremiumuser},"poonam@233")
}



//login
const createloginController=async(req,res)=>{
    try{
      const{email,password}=req.body

      console.log('email>..>>>>>>>',email,password)

      if(email.length===undefined||email.length===0||password===undefined||password.length===0){
        return res.status(400).json({message:'emailID or pswd is missing'})
      }
      const User=await user.findAll({where:{email}})
      console.log('user>>>>>>>>>>>>>>>>>>>>>>>>',User)
      if(User.length>0){
        //Compare hashed password with provided password
        bcrypt.compare(password,User[0].password,(err,result)=>{
            if(err){
                console.log('bcrypt error')
            }

        if(result===true){
            return res.status(200).json({message:'user logged in successfully',token:genrateAccessToken(User[0].id,User[0].name,User[0].ispremiumuser)})
        }
        else{
            return res.status(400).json({message:'password is not correct'})
        }
    })
      }
      else{
        return res.status(400).json({message:'user doesnot exist'})
      }
    }
    catch(error){
        console.log('errrrrr',error
        )

    }
}

module.exports={ 
    genrateAccessToken ,
    createSignupController,
    createloginController,
}

