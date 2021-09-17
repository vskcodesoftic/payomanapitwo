const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const customerController = require('../controllers/customer-controller')

const checkAuth = require('../middleware/authService');

const fileUpload = require('../middleware/fileUpload');

const multiFileUpload = require('../middleware/multiFile-upload');


router.get('/', (req, res, next) => {
 
  res.json({message: 'customer page routes'});
});

//customer signup
//for creating a new customer
router.post('/signup',
[ check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 6}).withMessage('Password must be at least 6 chars long')
  ,
  check('countryCode').isLength({min :2 , max:4}),
  check('phoneNumber').isLength({min :6 , max:10}).withMessage('Phone number must be valid 8 -10 number '),
  check('pin').isLength({min:4, max:4}).withMessage('Pin must be a four digit number ')

  
],customerController.createCustomer);


//customerlogin
router.post('/login' ,[ check('email').isEmail(), check('password').not().isEmpty()], customerController.customerLogin)

//update CustomerPassword 
router.post('/updatePassword'  ,[ check('email').isEmail(), check('oldpassword').not().isEmpty(),check('newpassword').not().isEmpty()], customerController.updateCustomerPassword)

//update Profile (picture)
 router.post('/profile',  multiFileUpload.fields([{
  name: 'image', maxCount: 1
}]), customerController.updateCustomerProfile);

//Forget Customer Password
router.post('/forgetPassword' ,[ check('email').isEmail()], customerController.forgetCustomerPassword);

//newPassword Reset after reciving resetLink on email
router.post('/resetPasswordLink/:token', customerController.newPasswordReset);

// get profile details of customer 
router.get('/profile', checkAuth ,customerController.getProfileDetails);


router.post('/payToMerchant' , checkAuth ,customerController.payToMerchant);

router.get('/getListOfPayments', checkAuth ,customerController.getListofPayments);

router.get('/getCompleteProfile', checkAuth ,customerController.getCompleteCustomerDetails);


module.exports = router