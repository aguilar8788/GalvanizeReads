var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var queries = require('../db/queries');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  return Promise.all([
    knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'book.title', 'book.image as bookImage', 'book.description').join('book', 'book_author.book_id', 'book.id').join('author', 'book_author.author_id', 'author.id'),
  ]).then(function(data) {
    console.log(data[0][0].author);
  res.render('books', { author_data: data[0], book_data: data[0][0] });
  })
});

router.get('/authors', function(req, res, next) {
  res.render('authors');
})

module.exports = router;
