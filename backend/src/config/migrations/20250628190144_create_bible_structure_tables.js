exports.up = function(knex) {
  return knex.schema
    .createTable('books', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('abbreviation').notNullable().unique();
      table.integer('total_chapters').notNullable();
    })
    .createTable('chapters', (table) => {
      table.increments('id').primary();
      table.integer('book_id').unsigned().references('id').inTable('books').onDelete('CASCADE');
      table.integer('chapter_number').notNullable();
      table.integer('total_verses').notNullable();
      table.unique(['book_id', 'chapter_number']); 
    });
};
exports.down = function(knex) { return knex.schema.dropTable('chapters').dropTable('books'); };