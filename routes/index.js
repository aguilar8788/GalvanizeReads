var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var queries = require('../db/queries');



var filter = function(data){
  var newObj = [];
  var arr = [];
  counter = 0;
  data[0].forEach(function(data) {
    newObj.push(data)
    counter++
  })

for(var keys in newObj){
  counter2 = 0;
  arr = [];
  data[1].forEach(function(data){

    if(newObj[keys].last_name == data.last_name){
      arr.push({title: data.title, id: data.book_id})
      newObj[keys].book = arr;
    }
  })
}
return newObj
}

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books', function(req, res, next) {
  return Promise.all([
    knex('book').select(),
  ]).then(function(data) {
  res.render('books', { book_data: data[0] });
  })
});

router.get('/books/:id', function(req, res, next) {
  console.log(req.params.id)
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'author.id as authorId','book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id').where('book.id', req.params.id).then(function(data) {
    res.render('readMore', { ReadMore: data[0], authors: data});
  })
})

router.get('/authors', function(req, res, next) {
  return Promise.all([
knex('author').select(),
knex('book_author').select().join('book', 'book_author.book_id', 'book.id').join('author', 'book_author.author_id', 'author.id')
  ]).then(function(data) {
    var data = filter(data);
    console.log(data)
  res.render('authors', { author_data: data, book: data[1]});
  })
});

router.get('/authors/:id', function(req, res, next) {
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'author.id as authorId', 'author.bio', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id').where('author.id', req.params.id).then(function(data) {
    res.render('moreInfo', { ReadMore: data[0], books: data });
  })
})

router.get('/addAuthor', function(req, res, next) {
  res.render('addAuthor');
})

router.post('/addAuthor', function(req, res, next) {
  knex('author').insert(req.body).then(function(data) {
    res.redirect('authors');
  })
})

router.get('/:id/deleteAuthor', function(req, res, next) {
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'author.id as authorId', 'author.bio', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').rightJoin('book', 'book_author.book_id', 'book.id').rightJoin('author', 'book_author.author_id', 'author.id').where('author.id', req.params.id).then(function(data) {
    res.render('deleteAuthor', { deleteAuthor: data[0], books: data });
  })
})

router.post('/deleteAuthor', function(req, res, next) {
  return Promise.all([
    knex('book_author').del().where('book_author.author_id', req.body.id),
    knex('author').del().where('author.id', req.body.id)
  ]).then(function() {
  res.redirect('authors')
  })
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
  knex('book_author').select('author.first_name', 'author.last_name', 'author.image as authorImage', 'author.id as authorId', 'book.title', 'book.image as bookImage', 'book.description', 'book.genre', 'book.id').leftJoin('book', 'book_author.book_id', 'book.id').leftJoin('author', 'book_author.author_id', 'author.id').where('book.id', req.params.id).then(function(data) {
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
    return knex('book').select().update(req.body).where('book.id', req.body.id)
  .then(function() {
  res.redirect('books')
  })
})

router.get('/:id/editAuthor', function(req, res, next) {
  return Promise.all([
  knex('author').select().where('author.id', req.params.id),
  knex('book').select()
  ]).then(function(data) {
    res.render('editAuthor', { editAuthor: data[0][0], addBook: data[1] });
  })
})

router.post('/editAuthor', function(req, res, next) {
    return knex('author').select().update(req.body).where('author.id', req.body.id)
  .then(function() {
  res.redirect('authors')
  })
})

router.post('/authorsBooks', function(req, res, next) {
  return knex('book_author').insert({book_id: req.body.book_id, author_id: req.body.id}).then(function() {
    res.redirect('authors/' + req.body.id)
  })
})

router.get('/filtered/:genre', function(req, res, next) {
  console.log(req.params)
  if(req.params.genre == "all"){
    knex('book').select().then(function(data) {
        res.render('books', {book_data: data});
    })
  }else{
  knex('book').select().where('genre', req.params.genre).then(function(data) {
      res.render('books', {book_data: data});
  })
  }
})





module.exports = router;
