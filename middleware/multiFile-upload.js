const multer = require('multer');
const path = require('path');

const { v1: uuid } = require('uuid')


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const multiFileUpload = multer({
    limits: 500000,
     storage : multer.diskStorage({
      destination: (req, file, cb)=>{
          if(file.fieldname==="image")
          {
            cb(null, 'public/assets/images');
          }
         else if(file.fieldname==="imgOptOne")
         {
          cb(null, 'public/assets/images');
        }
     
      },
      filename:(req,file,cb)=>{
          if(file.fieldname==="image"){
              cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
          }
        else if(file.fieldname==="imgOptOne"){
          cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
        }

      }
  })
})


module.exports = multiFileUpload;

