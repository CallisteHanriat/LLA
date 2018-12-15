var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let multer = require('multer');
let XLSX = require('xlsx');
const path = require('path');

var connection = mongoose.connection;
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let gfs=Grid(mongoose.mongo.Db);
let GridFsStorage = require('multer-gridfs-storage');

let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + '.xlsx');
  }
});

var uploadMuelter = multer({storage: multerStorage});

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
});

// Multer configuration for single file uploads
let upload = multer({
  storage: multerStorage
}).single('file');

// Route for file upload
router.post('/upload', (req, res) => {  
  upload(req,res, (err) => {
      if(err){
           res.json({error_code:1,err_desc:err});
           console.log(err);
           return;
      }
      res.json({error_code:0, error_desc: null, file_uploaded: true});      
      var workBook = XLSX.readFile(req.file.path);

      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      /*for (var i = 0; i<alphabet.length; i++) { // lignes
        for (var j = 0; j<21; j++) { // colonnes

        }
      }*/
      console.log(workBook);
      console.log('--------------------');
      console.log(workBook.Sheets.Feuil1['A1']);
      console.log('----------------------');
      console.log(detectLangColumn(workBook));

      columnToBrowse = detectLangColumn(workBook); // ex: [{val: 'français', adress: 'A1', column:'A', row:1}]

  });
});

// Retourne toutes les cases qui contiennet quelque chose pour une ligne donnée.
function readRow(workBook, rowNumber) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var concernedColumns = [];
  for (var i = 0; i<alphabet.length; i++) {
    var cell = workBook.Sheets.Feuil1[alphabet[i]+rowNumber+''];
    if (cell !== undefined) { // si c'est different de rien
      concernedColumns.push({val: cell.v,
                              adress: alphabet[i] + rowNumber,
                              column: alphabet[i],
                              row: rowNumber});
    }
  }
  return concernedColumns;
}

function readColumn(workBook, rowLimit) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var concernedRows = [];
  for (var i = 0; i<rowLimit; i++) {
    
  }
}


module.exports = router;