
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('book_author', function(table) {
    table.increments();
    table.integer('book_id').references('id').inTable('book');
    table.integer('author_id').references('id').inTable('author');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('book_author');
};
