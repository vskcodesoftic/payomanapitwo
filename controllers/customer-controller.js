
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


const { validationResult } = require('express-validator')
const  Customer = require('../models/customer-schema')

const HttpError = require('../models/http-error');

const {  sendEmail  ,sendEmailOtpLink, sendEmailOtpLinktoCustomer } = require('../services/mail.service');


//Customer signup

const createCustomer = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { name, email, password , pin , countryCode , phoneNumber } = req.body;
   
     
    let existingUser
    try{
         existingUser = await Customer.findOne({ email : email })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a user failed",500)
        return next(error)
    }
    if(existingUser){
        const error = new HttpError("user already exists",422)
        return next(error)
    }
  
    
    let hashedPassword;
  
   try{
    hashedPassword = await bcrypt.hash(password, 12)
   } 
   catch(err){
       const error = new HttpError("could not create customer",500);
       return next(error)
   }


    const createdCustomer = new Customer({
        name,
        email,
        password: hashedPassword,
        pin,
        countryCode,
        phoneNumber,
     
    })

    try {
        await createdCustomer.save();
      } catch (err) {
        const error = new HttpError(
          'Creating Customer failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

      let token;
      try{
        token = await jwt.sign({
            userId : createdCustomer.id,
            email : createdCustomer.email 
             },
            process.env.JWT_KEY,
            {expiresIn :'1h'}
            )

      }
     catch (err) {
        const error = new HttpError(
          'CreatingCustomer failed, please try again.',
          500
        );
        return next(error);
      }
    
     
    res.status(201).json({ userId : createdCustomer.id,email : createdCustomer.email ,countrycode :createdCustomer.countryCode , phoneNumber :createdCustomer.phoneNumber, token: token})
}


//Customer login 
const  customerLogin = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }

    const { email,password } = req.body;

    let customer
    try{
         customer = await Customer.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,logging in failed",500)
        return next(error)
    }

    if(!customer){
        const error = new HttpError("invalid credentials could not log in",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(password, customer.password)
   }
   catch(err){
    const error = await new HttpError("invalid credentials try again",500)
    return next(error)
}

if(!isValidPassword){
    const error = new HttpError("invalid credentials could not log in",401)
    return next(error)
}

let token;
try{
  token = await jwt.sign({
      userId : customer.id,
      email : customer.email },
      process.env.JWT_KEY,
      {expiresIn :'1h'}
      )

}
catch (err) {
  const error = new HttpError(
    'LogIn failed, please try again.',
    500
  );
  return next(error);
} 

res.json({ 
    message : 'customer logged in successful' , 
    userId : customer.id,
    email : customer.email , 
    token: token})

}


//update customer password 
const  updateCustomerPassword = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { email, oldpassword , newpassword } = req.body;

    let customer
    try{
         customer = await Customer.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,update password in failed",500)
        return next(error)
    }

    if(!customer){
        const error = new HttpError("customer not found could not update password",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(oldpassword, customer.password)
   }
   catch(err){
    const error = await new HttpError("invalid password try again",500)
    return next(error)
}


if(!isValidPassword){
    const error = new HttpError("invalid old password could not update newpassword",401)
    return next(error)
}

let hashedPassword;
  
try{
 hashedPassword = await bcrypt.hash(newpassword, 12)
 let foundcustomer;
 foundcustomer = await Customer.findOne({ email : email  })
  
 var updatedRecord = {
     password: hashedPassword
 }

 Customer.findByIdAndUpdate(foundcustomer, { $set: updatedRecord },{new:true}, (err, docs) => {
     if (!err) res.json({mesage : "password updated sucessfully"})
     else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
 })
} 
catch(err){
    const error = new HttpError("could not updated hash of customer ",500);
    return next(error)
}


}


//update customer Profile
const updateCustomerProfile = async(req, res, next) => {    
     const userId = req.userData.userId;

    let existingUser
    try{
         existingUser = await Customer.findOne({ _id : userId })
    }
    catch(err){
        const error = await new HttpError("something went wrong, updating failed",500)
        return next(error)
    }
    if(!existingUser){
        const error = new HttpError("user not exists",422)
        return next(error)
    }

      //updating customer profile pic
      let user
      try {
       user = await Customer.updateOne(
          { _id: userId },
          {
            profilePic : req.file.path 
          }
        );
      }
      catch(err){
          console.log("error",err)
          const error = await new HttpError("something went wrong, in failed",500)
          return next(error)
        }
        if(!user){
          const error = new HttpError("customer not found could not update profile details",401)
          return next(error)
        }

 res.json({message :" profile updated "})


}



//forget Customer Password   sending email with reset password Link
const forgetCustomerPassword = async (req, res ,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { email } = req.body;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        Customer.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
          
           sendEmailOtpLinktoCustomer(
                    user.email,
                    token 
                    
                )
                res.json({message:"check your email", token : token})
  
            })
           
  
        })
    })

}



// new password reset link when user clicks

const newPasswordReset = async(req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const {  password } = req.body;
        const newPassword = password
        const sentToken = req.params.token
        Customer.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"Try again session expired"})
            }
            bcrypt.hash(newPassword,12).then(hashedpassword=>{
               user.password = hashedpassword
               user.resetToken = undefined
               user.expireToken = undefined
               user.save().then((saveduser)=>{
                   res.json({message:"password updated success"})
               })
            })
        }).catch(err=>{
            console.log(err)
        })
    

}

//get profile details of customer
const getProfileDetails = async(req, res, next) => {
    const userId = req.userData.userId;
    let customer
    try{
         customer = await Customer.findOne({ _id : userId })
    }
    catch(err){
        const error = await new HttpError("something went wrong, updating failed",500)
        return next(error)
    }
    if(!customer){
        const error = new HttpError("user not exists",422)
        return next(error)
    }
    res.json({ message : " complete details of customer", name : customer.name, email : customer.email ,  countryCode : customer.countryCode , phoneNumber : customer.phoneNumber ,profilPic : customer.profilePic})
}



exports.createCustomer =  createCustomer;
exports.customerLogin = customerLogin;
exports.updateCustomerPassword = updateCustomerPassword; 
exports.updateCustomerProfile = updateCustomerProfile;
exports.forgetCustomerPassword = forgetCustomerPassword;
exports.newPasswordReset = newPasswordReset;
exports.getProfileDetails = getProfileDetails;

