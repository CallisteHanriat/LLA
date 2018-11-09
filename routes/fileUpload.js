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
console.log(mongoose.mongo.Db);
//console.log(mongoose.connection.db);
let gfs = Grid(mongoose.mongo.Db);
// console.log(connection.db);
// let gfs=Grid(connection.db);
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
  root: 'LLAfichiersExcelleDeMots' // Root collection name
});

// Multer configuration for single file uploads
let upload = multer({
  storage: storage
}).single('fichierDeMots');

// Route for file upload
router.post('/upload', (req, res) => {
  // req.file est mon fichier excel.
  upload(req,res, (err) => {
      if(err){
           res.json({error_code:1,err_desc:err});
           return;
      }
      res.json({error_code:0, error_desc: null, file_uploaded: true});
  });
});


module.exports = router;