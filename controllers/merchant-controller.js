
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')


const { validationResult } = require('express-validator')
const  Merchant = require('../models/merchant-schema')

const HttpError = require('../models/http-error');

const {  sendEmail  ,sendEmailOtpLink } = require('../services/mail.service');


//merchant signup

const createMerchant = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { name, email, password , businessName , countryCode , phoneNumber } = req.body;
   
     
    let existingUser
    try{
         existingUser = await Merchant.findOne({ email : email })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a user failed",500)
        return next(error)
    }
    if(existingUser){
        const error = new HttpError("user already exists",422)
        return next(error)
    }
  

         
    let existingPhoneNum
    try{
         existingPhoneNum = await Merchant.findOne({ phoneNumber : phoneNumber })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a user failed",500)
        return next(error)
    }
    if(existingPhoneNum){
        const error = new HttpError("Phone number already exists",422)
        return next(error)
    }
    
    let hashedPassword;
  
   try{
    hashedPassword = await bcrypt.hash(password, 12)
   } 
   catch(err){
       const error = new HttpError("cold not create mearchant",500);
       return next(error)
   }


    const createdMerchant = new Merchant({
        name,
        email,
        password: hashedPassword,
        businessName,
        countryCode,
        phoneNumber,
     
    })

    try {
        await createdMerchant.save();
      } catch (err) {
        const error = new HttpError(
          'Creating user failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

      let token;
      try{
        token = await jwt.sign({
            userId : createMerchant.id,
            email : createdMerchant.email,
            businessName: createdMerchant.businessName },
            process.env.JWT_KEY,
            {expiresIn :'1h'}
            )

      }
     catch (err) {
        const error = new HttpError(
          'CreatingMerchant failed, please try again.',
          500
        );
        return next(error);
      }
    
     
    res.status(201).json({ userId : createdMerchant.id,email : createdMerchant.email ,countrycode :createdMerchant.countryCode , phoneNumber :createdMerchant.phoneNumber, businessName : createdMerchant.businessName, token: token})
}


//Merchant login 
const  merchantLogin = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }

    const { email,password } = req.body;

    let merchant
    try{
         merchant = await Merchant.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,logging in failed",500)
        return next(error)
    }

    if(!merchant){
        const error = new HttpError("invalid credentials could not log in",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(password, merchant.password)
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
      userId : merchant.id,
      email : merchant.email },
      process.env.JWT_KEY,
      {expiresIn :'1100h'}
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
    message : 'merchant logged in successful' , 
    userId : merchant.id,
    email : merchant.email , 
    token: token})

}


//update merchant password 
const  updateMerchantPassword = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { email, oldpassword , newpassword } = req.body;

    let merchant
    try{
         merchant = await Merchant.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,update password in failed",500)
        return next(error)
    }

    if(!merchant){
        const error = new HttpError("merchant not found could not update password",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(oldpassword, merchant.password)
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
 let foundMerchant;
 foundMerchant = await Merchant.findOne({ email : email  })
  
 var updatedRecord = {
     password: hashedPassword
 }

 Merchant.findByIdAndUpdate(foundMerchant, { $set: updatedRecord },{new:true}, (err, docs) => {
    if (!err) res.json({mesage : "password updated sucessfully"})
    else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
 })
} 
catch(err){
    const error = new HttpError("cold boom updated hash mearchant",500);
    return next(error)
}


}


//forget merchant password  SENDING RESET LINK
const  forgetMerchantPassword = async(req, res, next) => {
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
        Merchant.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
          
           sendEmailOtpLink(
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
    //  const test = req.params.token;
    //  console.log(test);
    
        const newPassword = req.body.password
        const sentToken = req.params.token
        Merchant.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
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

//update BankDetails of Merchant 
const bankDetails = async(req,res,next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { accountNumber , bankName, swiftCode , email} = req.body;
    // const userId = req.userData.userId;

    let merchant
    try{
         merchant = await Merchant.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong, in failed",500)
        return next(error)
    }

    if(!merchant){
        const error = new HttpError("merchant not found could not update bank details",401)
        return next(error)
    }

    //updating
    let user
    try {
     user = await Merchant.updateOne(
        { email: email },
        {
          accountNumber, 
          bankName,
          swiftCode   
        }
      );
    }
    catch(err){
        const error = await new HttpError("something went wrong, in failed",500)
        return next(error)
      }
      if(!user){
        const error = new HttpError("merchant not found could not update bank details",401)
        return next(error)
      }
 
     res.json({message : "updated bankdetails sucessfully"})
}

//showing remaing Balance of Merchant
const getRemainingBalance = async(req,res ,next) => {
    const userId = req.userData.userId;
    let merchant
    try{
         merchant = await Merchant.findOne({ _id : userId  })
    }
    catch(err){
        const error = await new HttpError("something went wrong, request failed",500)
        return next(error)
    }

    if(!merchant){
        const error = new HttpError("merchant not found could not get remaing balance",401)
        return next(error)
    }

    res.json({ message : "remaingBalance of merchant", Balance : merchant.Balance , email : merchant.email })
}

//get Merchant Bank Details
const getMerchantBankDetails = async(req,res ,next) => {
   // const userId = req.userData.userId;
   const userEmail = req.params.id;
    let merchant
    try{
         merchant = await Merchant.findOne({ email : userEmail  })
    }
    catch(err){
        const error = await new HttpError("something went wrong, request failed",500)
        return next(error)
    }

    if(!merchant){
        const error = new HttpError("merchant not found could not get bank details",401)
        return next(error)
    }

    if(merchant.accountNumber === 'null')
    {
       res.json({message : "empty"}) 
    }
    res.json({ message : "BankDetails of merchant", accountNumber : merchant.accountNumber , bankName : merchant.bankName, swiftCode : merchant.swiftCode })
}


//profile updated 
const updateMerchantProfile = async (req,res,next) => {
    let SingleFilePath ;
    let imgPath ;
    console.log("image work", "image")

    const fileSingle = req.files.image;
    console.log(fileSingle)
  

    //const userEmail = req.params.id;

    // const userId = req.userId;
   // console.log("userid",userId)
    const { accountNumber, bankName,businessName, name ,swiftCode  , email ,phoneNumber } = req.body;
    
    console.log("gmail", email)

    let existingUser
    try{
         existingUser = await Merchant.findOne({ email: email })
    }
    catch(err){
        const error = await new HttpError("something went wrong, updating failed",500)
        return next(error)
    }
    if(!existingUser){
        const error = new HttpError("usver not exists",422)
        return next(error)
    }

    const userImage =  await existingUser.profilePic;
    console.log(userImage)
    
    if(!userImage){
        const error = new Error("please single choose files");
        return next(error)
      }

      if(!fileSingle) {
        SingleFilePath = userImage
      }

      if(fileSingle) {

      fileSingle.forEach(img => {
        console.log(img.path)
         imgPath = img.path;
         SingleFilePath = imgPath
      })
    }
      //updating
      let user
      try {
       user = await Merchant.updateOne(
          { email: email },
          {
            businessName,
            accountNumber, 
            bankName,
            swiftCode ,
            name,
            phoneNumber,
            profilePic : SingleFilePath
          }
        );
      }
      catch(err){
          console.log("error",err)
          const error = await new HttpError("something went wrong, in failed",500)
          return next(error)
        }
        if(!user){
          const error = new HttpError("merchant not found could not update profile details",401)
          return next(error)
        }

 res.json({message :" profile updated "})

   
}

//images api
// get complete merchant details 
const getCompleteMerchantDetails = async (req, res, next) => {
   const userId = req.userId;

    let merchant
    try{
         merchant = await Merchant.findOne({ _id : userId })
    }
    catch(err){
        const error = await new HttpError("something went wrong, updating failed",500)
        return next(error)
    }
    if(!merchant){
        const error = new HttpError("user not exists",422)
        return next(error)
    }

   

    res.json({ message : " complete details of merchant", name : merchant.name, email : merchant.email , businessName : merchant.businessName, countryCode : merchant.countryCode , phoneNumber : merchant.phoneNumber , accountNumber : merchant.accountNumber, swiftCode :merchant.swiftCode ,bankName : merchant.bankName , profilePic : merchant.profilePic})
}



//get list of payments 
const getListofPayments = async (req , res ,next) => {

    const userId = req.userId;

    let userWithPayments;
    try {
      userWithPayments = await Merchant.findById(userId).populate('payments');
    } catch (err) {
      const error = new HttpError(
        'Fetching Payments failed, please try again later',
        500
      );
      return next(error);
    }
    // if (!payments || payments.length === 0) {
    if (!userWithPayments || userWithPayments.payments.length === 0) {
      return next(
        new HttpError('Could not find payments for the provided user id.', 404)
      );
    }
  
    res.json({
      payments: userWithPayments.payments.map(payment =>
        payment.toObject({ getters: true })
      )
    });
}

exports.createMerchant =    createMerchant;
exports.merchantLogin = merchantLogin;
exports.updateMerchantPassword = updateMerchantPassword;
exports.forgetMerchantPassword = forgetMerchantPassword;
exports.newPasswordReset = newPasswordReset;
exports.bankDetails = bankDetails;
exports.getRemainingBalance = getRemainingBalance;
exports.getMerchantBankDetails = getMerchantBankDetails;
exports.updateMerchantProfile = updateMerchantProfile;
exports.getCompleteMerchantDetails = getCompleteMerchantDetails;
exports.getListofPayments = getListofPayments;