exports.up = function(knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('reference').notNullable();
    table.text('text').notNullable();
    table.string('version').notNullable();
  });
};
exports.down = function(knex) { return knex.schema.dropTable('favorites'); };