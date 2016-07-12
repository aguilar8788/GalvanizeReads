
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex.raw('TRUNCATE author RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE book RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE book_author RESTART IDENTITY CASCADE'),
    knex.raw('TRUNCATE genre RESTART IDENTITY CASCADE')

  ])
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('author').insert({first_name: "Kyle", last_name: "Simpson", bio: "Kyle Simpson is an Open Web Evangelist who's passionate about all things JavaScript. He's an author, workshop trainer, tech speaker, and OSS contributor/leader.", image: "https://s3-us-west-2.amazonaws.com/assessment-images/galvanize_reads/photos/kyle_simpson.jpg"}),
        knex('genre').insert({name:"Javascript"}),
        knex('book').insert({title: "You Don't Know JS", genre: "javascript", description: "No matter how much experience you have with JavaScript, odds are you don’t fully understand the language. As part of the \"You Don’t Know JS\" series, this compact guide focuses on new features available in ECMAScript 6 (ES6), the latest version of the standard upon which JavaScript is built." , image: "https://s3-us-west-2.amazonaws.com/assessment-images/galvanize_reads/photos/es6_and_beyond.jpg"})
      ]).then(function() {
        return knex('book_author').insert({book_id: 1, author_id: 1});
      });
    });
};
