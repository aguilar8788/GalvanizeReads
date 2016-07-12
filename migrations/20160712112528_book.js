
exports.up = function(knex, Promise) {
  return knex.schema.table('book', function(table) {
    table.integer('genre_id').references('id').inTable('genre');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('book', function(table) {
    table.dropColumn('genre_id');
  })
};
