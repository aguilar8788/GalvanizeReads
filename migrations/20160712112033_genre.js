exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('genre', function(table) {
    table.increments();
    table.string('name', 255);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('genre');
};
