
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('book', function(table) {
    table.increments();
    table.string('genre')
    table.string('title', 255);
    table.text('description');
    table.string('image');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('book');
};
