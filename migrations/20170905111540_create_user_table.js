
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users',(t)=>{
      t.text('id').notNull();
      t.string('first_name', 30).notNull();
      t.string('last_name', 30).notNull();
      t.string('email',255).notNull();
      t.boolean('active').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
