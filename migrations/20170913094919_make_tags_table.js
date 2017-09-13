
exports.up = (knex, Promise) => {
    return knex.schema.createTableIfNotExists("tags", (t) => {
            t.text("id").notNull();
            t.text("parent").nullable();
            t.text("name").notNull();
            t.boolean("list").nullable();
            t.text("value").nullable();
  });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTableIfExists("tags");
};
