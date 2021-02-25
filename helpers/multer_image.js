const multer = require('multer')
const path = require('path');


const multerImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024, // no larger than 5mb, you can change as needed.
      },
    fileFilter: function(_req, file, cb){
        checkFileType(_req, file, cb);
    }
})


function checkFileType(req, file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      cb(null,true);
    } else {
        const err = new Error('formato non supportato')
        err.status = 400
        return cb(err, false);
    }
}

module.exports = multerImage