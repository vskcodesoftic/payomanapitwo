const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const merchantController = require('../controllers/merchant-controller')

const fileUpload =require('../middleware/fileUpload')

const checkAuth = require('../middleware/authService');

router.get('/', (req, res, next) => {
 
  res.json({message: 'merchant page routes'});
});

//merchant signup
//for creating a new user
router.post('/signup',
[ check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 6}),
  check('countryCode').isLength({min :2 , max:2}),
  check('businessName').not().isEmpty()
  
],merchantController.createMerchant);



//merchantlogin
router.post('/login' ,[ check('email').isEmail(), check('password').not().isEmpty()], merchantController.merchantLogin)

//update MERCHANT PASSWORD
router.post('/updatePassword' ,[ check('email').isEmail(), check('oldpassword').not().isEmpty(),check('newpassword').not().isEmpty()], merchantController.updateMerchantPassword)

//Forget Merchant Password
router.post('/forgetPassword' ,[ check('email').isEmail()], merchantController.forgetMerchantPassword)


//new password rest link , when user clicks link in the email
router.post('/resetPasswordLink/:token', merchantController.newPasswordReset);

// Reciveng BankDetails Of Merchant
router.post('/bankDetails', checkAuth , [ check('accountNumber').not().isEmpty(),check('swiftCode').not().isEmpty(),check('bankName').not().isEmpty()] ,merchantController.bankDetails)

//Remaing Balance
router.get('/remainingBalance', checkAuth ,merchantController.getRemainingBalance);

//get merchant bank Details
router.get('/getMerchantBankDetails',checkAuth ,merchantController.getMerchantBankDetails);

//update merchant profile
router.post('/profile',checkAuth ,fileUpload.single('profilePic'), merchantController.updateMerchantProfile);

//get full merchant details 
router.get('/completeProfile', checkAuth ,merchantController.getCompleteMerchantDetails);

module.exports = router;