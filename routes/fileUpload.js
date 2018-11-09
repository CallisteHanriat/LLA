var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let multer = require('multer');

/*mongoose.connect('mongodb://localhost/LLA', { promiseLibrary: require('bluebird') })
   .then(()=>console.log('Connection to the database sucessful'))
   .catch((err) => console.log('err')); */
  
var connection = mongoose.connection;
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let gfs=Grid(mongoose.mongo.Db);
let GridFsStorage = require('multer-gridfs-storage');


// Setting up the storage element
let storage = GridFsStorage({
  gfs : gfs,

  url: 'mongodb://localhost/LLA',

  filename: (req, file, cb) => {
      let date = Date.now();
      // The way you want to store your file in database
      cb(null, file.fieldname + '-' + date + '.'); 
  },
  
  // Additional Meta-data that you want to store
  metadata: function(req, file, cb) {
      cb(null, { originalname: file.originalname });
  },
  bucketName: 'LLAFiles',
  // root: 'LLAfichiersExcelleDeMots' // Root collection name
});

// Multer configuration for single file uploads
let upload = multer({
  storage: storage
}).single('file');

// Route for file upload
router.post('/upload', (req, res) => {
  // req.file est mon fichier excel.
  // console.log(req);
  // console.log(req.file);
  upload(req,res, (err) => {
      if(err){
           res.json({error_code:1,err_desc:err});
           console.log('erreur');
           return;
      }
      res.json({error_code:0, error_desc: null, file_uploaded: true});
      console.log(req.file);
      console.log('collection added');
  });
});

/*router.post('/upload', upload.single('file'), function(req, res, next) {
  console.log(req);
})*/


module.exports = router;