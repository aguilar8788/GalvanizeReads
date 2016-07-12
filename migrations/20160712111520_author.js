
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('author', function(table) {
    table.increments();
    table.string('first_name', 255);
    table.string('last_name', 255);
    table.text('bio');
    table.string('image');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('author');
};
