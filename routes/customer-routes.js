const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const customerController = require('../controllers/customer-controller')

const checkAuth = require('../middleware/authService');

const fileUpload = require('../middleware/fileUpload');

router.get('/', (req, res, next) => {
 
  res.json({message: 'customer page routes'});
});

//customer signup
//for creating a new customer
router.post('/signup',
[ check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 6}),
  check('countryCode').isLength({min :2 , max:2}),
  check('phoneNumber').not().isEmpty(),
  check('pin').not().isEmpty()
  
],customerController.createCustomer);


//customerlogin
router.post('/login' ,[ check('email').isEmail(), check('password').not().isEmpty()], customerController.customerLogin)

//update CustomerPassword 
router.post('/updatePassword'  ,[ check('email').isEmail(), check('oldpassword').not().isEmpty(),check('newpassword').not().isEmpty()], customerController.updateCustomerPassword)

//update Profile (picture)
 router.post('/profile', checkAuth , fileUpload.single('profilePic'), customerController.updateCustomerProfile);

//Forget Customer Password
router.post('/forgetPassword' ,[ check('email').isEmail()], customerController.forgetCustomerPassword);

//newPassword Reset after reciving resetLink on email
router.post('/resetPasswordLink/:token', customerController.newPasswordReset);

// get profile details of customer 
router.get('/profile', checkAuth ,customerController.getProfileDetails);

module.exports = router;