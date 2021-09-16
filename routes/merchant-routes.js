const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const merchantController = require('../controllers/merchant-controller')

const fileUpload =require('../middleware/fileUpload')

const checkAuth = require('../middleware/authService');
const multiFileUpload = require('../middleware/multiFile-upload');

router.get('/', (req, res, next) => {
 
  res.json({message: 'merchant page routes'});
});

//merchant signup
//for creating a new user
router.post('/signup',
[ check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 6}),
  check('countryCode').isLength({min :2 , max:4}),
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
router.post('/bankDetails', [ check('accountNumber').not().isEmpty(),check('swiftCode').not().isEmpty(),check('bankName').not().isEmpty()] ,merchantController.bankDetails)

//Remaing Balance
router.get('/remainingBalance', checkAuth ,merchantController.getRemainingBalance);

//get merchant bank Details
router.get('/getMerchantBankDetails/:id',merchantController.getMerchantBankDetails);

//update merchant profile
router.post('/profile' , multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), merchantController.updateMerchantProfile);

//get full merchant details 
router.get('/completeProfile',checkAuth ,merchantController.getCompleteMerchantDetails);

router.get('/getListOfPayments', checkAuth ,merchantController.getListofPayments);

module.exports = router;