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
    knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id'),
  ]).then(function(data) {
    console.log(data)
  res.render('books', { book_data: data[0] });
  })
});

router.get('/authors', function(req, res, next) {
  res.render('authors');
})

router.get('/add', function(req, res, next) {
  res.render('addBook');
})

router.post('/add', function(req, res, next) {
      knex('book').insert(req.body).then(function(data) {
          return knex('book').where('book.title', req.body.title).then(function(data) {
              knex('book_author').insert({book_id: data[0].id}).then(function() {
                  res.redirect('books');
            })
        })
    })
})

router.get('/:id/delete', function(req, res, next) {
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id').where('book.id', req.params.id).then(function(data) {
    res.render('delete', { deleteBook: data[0] });
  })
})

router.post('/delete', function(req, res, next) {
  return Promise.all([
    knex('book_author').del().where('book_author.book_id', req.body.id),
    knex('book').del().where('book.id', req.body.id)
  ]).then(function() {
  res.redirect('books')
  })
})

router.get('/:id/edit', function(req, res, next) {
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id').where('book.id', req.params.id).then(function(data) {
    res.render('edit', { editBook: data[0] });
  })
})

router.post('/edit', function(req, res, next) {
  console.log(req.body.id)
    return knex('book').select().update(req.body).where('book.id', req.body.id)
  .then(function() {
  res.redirect('books')
  })
})



module.exports = router;
