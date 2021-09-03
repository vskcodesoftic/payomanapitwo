# APIDocs PayOman

PayOman Api Routes

## Installation

OS X & Linux:

```sh
npm install
```
## Open Endpoints
Open endpoints require no Authentication.

* [HomePage](login.md) : `POST /`

## Merchant Routes

* [merchantLogin] : `POST /api/merchant/login`

fields:

```sh
email :
password :
```

 

* [merchantSignup] : `POST /api/merchant/signup`

  merchant signup:

```sh
name:
email:
password:
countryCode:
businessName:
```


* [updatePassword] : `POST /api/merchant/updatePassword`

update password fields:

```sh
name:
email:
oldpassword:
newpassword:
```


* [forgetPassword] : `POST /api/merchant/forgotPassword`

forget password fields:
user will recive resetPassword Link
```sh
email:
```
      

* [resetPasswordLink] : `POST /api/merchant/resetPasswordLink/:token`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

forget password fields:
when user clicks on resetPassword Link , he can enter the new password of his choice
```sh
password:
```
      


* [bankDetails] :     `POST /api/merchant//bankDetails`
     
merchant bank details fields:
type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

if token is invalid 
error message : invalid auth
on valid token 
```sh
accountNumber:
bankName :
swiftCode :
```



* [remainingBalance] : `GET /api/merchant/remainingBalance`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

   Response

default : 00

```sh
balance : 
```



* [getMerchantBankDetails] : `GET /api/merchant/resetPasswordLink/getMerchantBankDetails`  

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

   Response :

```sh
accountNumber : 
bankName :
swiftCode :
```

* [profile] : `POST /api/merchant/profile`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

```sh
accountNumber : 
bankName :
swiftCode :
profilePic : req.file.path (pic a file)
```

* [completeProfile] : `GET /api/merchant/completeProfile`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

   Response

```sh
name : 
email :
businessName :
countryCode : 
phoneNumber:
accountNumber:
swiftCode:
```



## Customer Routes

* [login] : `POST /api/customer/login`

```sh
email :
password :
```

* [signup] : `POST /api/customer/signup`

```sh
name :
email :
password :
countryCode :
phoneNumber :
pin :

```


* [updatePassword] : `POST /api/customer/updatePassword`

update password fields:

```sh
name:
email:
oldpassword:
newpassword:
```

* [forgetPassword] : `POST /api/customer/forgotPassword`

forget password fields:
user will recive resetPassword Link
```sh
email:
````


* [resetPasswordLink] : `POST /api/customer/resetPasswordLink/:token`

forget password fields:
when user clicks on resetPassword Link , he can enter the new password of his choice
```sh
password:
```
      

* [profile] : `GET /api/customer/profile`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'

```sh
name : 
email :
countryCode : 
phoneNumber:
profilePic:
```

* [profile] : `POST /api/customer/profile`

type : protected Route (require a bearer Token while testing on postman )
pass token : 'tokenValue'


```sh
profiePic :
```


do replace server with actual production url   >env>server


## DevelopedByCodeSoftic
