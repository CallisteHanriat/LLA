var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let multer = require('multer');
let XLSX = require('xlsx');
const path = require('path');
const mongo = require('mongodb');
let fs = require('fs');
let Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

let gfs=Grid(mongoose.mongo.Db, mongoose.mongo);

let GridFsStorage = require('multer-gridfs-storage');

let currentFileName = "";

// Muelter storage for disk
let multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads')
  },
  filename: (req, file, cb) => {
    console.log('diskstorage file : ' + file.originalname);
    cb(null, path.parse(file.originalname).name + '-' + Date.now() + '.xlsx');
  }
});


// Setting up the storage element
let multerMongo = GridFsStorage({
  gfs : gfs,    
  file: (req, file) => {
    let date = Date.now();
    currentFileName = file.originalname + '-' + date + '.xlsx';
    return {
      filename: file.originalname + '-' + date + '.xlsx'
    };
  },  
  // Additional Meta-data that you want to store
  metadata: function(req, file, cb) {
    cb(null, { originalname: file.originalname });
  },
  bucketName: 'LLAFiles',  
  url: 'mongodb://localhost/LLA',
});

// Multer configuration for single file uploads
let uploadFile = multer({
  storage: multerStorage
}).single('file');

var uploadMongo = multer({
  storage: multerMongo
}).single('file');

// Route for file upload
router.post('/upload', (req, res) => {  
  uploadFile(req,res, (err) => {
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
      // console.log(workBook);
      // console.log('--------------------');
      // console.log(workBook.Sheets.Feuil1['A1']);
      // console.log('----------------------');
     // console.log(detectLangColumn(workBook));
      rowOne = readRow(workBook, 1);
      // console.log('Première ligne : ' + JSON.stringify(rowOne));

      columnOne = readColumn(workBook, 1, 100);
      // console.log('First column : ' + JSON.stringify(columnOne));
     // columnToBrowse = detectLangColumn(workBook); // ex: [{val: 'français', adress: 'A1', column:'A', row:1}]
  });

  uploadMongo(req, res, (err) => {
    if(err) {
      res.json({error_code:1,err_desc:err});
      console.log('Error in upload in Mongo: ' + err);
      return;
    }

    console.log('current record in mongodb : ' + currentFileName);    


    // var col = mongoose.mongo.Db.prototype.collection("fs.files()");

    var db = new mongo.Db('LLA', new mongo.Server("127.0.0.1", 27017));
    var grfs = Grid(db, mongo);

    // console.dir(grfs);


    var readStream = grfs.createReadStream({ filename: "Boîte à mots.xlsx-1548283270159.xlsx" });
    // fs.createReadStream('Boîte à mots.xlsx-1548283270159.xlsx').pipe(writeStream);

    //error handling, e.g. file does not exist
    readStream.on('error', function (err) {
       console.log('An error occurred!', err);
       throw err;
    });
    console.dir(readStream);
    // readStream.pipe(response);

    //console.dir(col);
    /*var readstream = gfs.createReadStream({
      filename: currentFileName
    });
    
    //error handling, e.g. file does not exist
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      throw err;
    });
    
    readstream.pipe(response);*/
  })
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