
exports.up = (knex, Promise) => {
    return knex.schema.createTableIfNotExists("attr", (t) => {
        t.text("id").notNull();
        t.text("tagElementID").notNull();
        t.text("name").notNull();
        t.text("value").nullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTableIfExists("attr");
};
