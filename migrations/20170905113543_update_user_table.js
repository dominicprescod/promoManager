
exports.up = function(knex, Promise) {
  return knex.schema.table('users',(t)=>{
    t.boolean('active').notNull().alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users',(t)=>{
    t.boolean('active').nullable().alter();
  });
};
