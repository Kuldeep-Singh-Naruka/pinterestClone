const multer = require('multer');
const { v4:uuidv4 } = require('uuid');
const path = require("path");
// this will help us to upload file and give it a unique name
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./public/images/uploads/') //Folder location will provide here
    },
    filename: function(req, file,cb){
        const uniquename = uuidv4(); //generating filename
        cb(null, uniquename+path.extname(file.originalname)); //use the unique name
    }
})
  
  const upload = multer({ storage: storage })
  module.exports = upload;