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
           console.log('Error in upload : ' + err);
           return;
      }
      res.json({error_code:0, error_desc: null, file_uploaded: true});
      console.log('file path : ' + req.file.path);
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
     // console.log(detectLangColumn(workBook));
      rowOne = readRow(workBook, 1);
      console.log('Première ligne : ' + JSON.stringify(rowOne));

      columnOne = readColumn(workBook, 1, 100);
      console.log('First column : ' + JSON.stringify(columnOne));
     // columnToBrowse = detectLangColumn(workBook); // ex: [{val: 'français', adress: 'A1', column:'A', row:1}]
  });
});

// Retourne toutes les cases qui contiennet quelque chose pour une ligne donnée.
function readRow(workBook, rowNumber) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var concernedColumns = {};
  for (var i = 0; i<alphabet.length; i++) {
    var cell = workBook.Sheets.Feuil1[alphabet[i]+rowNumber+''];    
    if (cell !== undefined) { // si c'est different de rien
      concernedColumns[alphabet[i] + ''] = {val: cell.v,
                              adress: alphabet[i] + rowNumber,
                              column: alphabet[i],
                              row: rowNumber};
    }
  }
  return concernedColumns;
}

/**
 * 
 * @param {} workBook is the workbook necessary to do treatment
 * @param {*} columnNumber is the column number of the 
 * @param {*} rowLimit the limit of the number of rows we want
 */
function readColumn(workBook, columnNumber, rowLimit) {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var concernedRows = {};
  for (var i = 1; i<rowLimit; i++) {
    var cell = workBook.Sheets.Feuil1[alphabet[columnNumber] + i];

    console.log('readColumn : cell[' + alphabet[columnNumber] + i + '] : ' + cell);
    if(cell !== undefined) {
      concernedRows[i + ''] = {val: cell.v,
        adress: alphabet[columnNumber] + i,
        column: alphabet[columnNumber],
        row: i};
    }
    return concernedRows;
  }
}


module.exports = router;