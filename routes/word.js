var express = require('express');
var router = express.Router();
var Word = require('../models/Word');

// POST one word
router.post('/', function(req, res, next) {
  Word.create(req.body, function(err, post) {
    if (err) return next(err);
    res.json(post);
  })
})

// GET by ID
router.get('/:id', function(req, res, next) {
  Word.findById(id, function(err, word) {
    if (err) return next(err);
    res.json(word);
  })
})

/* GET ALL words */
router.get('/', function(req, res, next) {
  Word.find(function (err, words) {
    if (err) return next(err);
    res.json(words);
  });
});

module.exports = router;