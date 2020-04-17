exports.up = function (knex) {
    return knex.schema
        .createTable("projects", (projects) => {
            projects.increments();

            projects.string("name", 128).notNullable();
            projects.text("description").notNullable();
            projects.boolean("completed").defaultTo(false);
        })
        .createTable("tasks", (actions) => {
            actions.increments();

            actions
                .integer("project_id")
                .unsigned()
                .notNullable()
                .references("projects.id");

            actions.string("description", 128).notNullable();
            actions.text("notes");
            actions.boolean("completed").defaultTo(false);
        })
        .createTable("resources", (resources) => {
            resources.increments();

            resources
                .integer("project_id")
                .unsigned()
                .notNullable()
                .references("projects.id");
            resources.string("name", 128).notNullable();
            resources.text("description");
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("resources")
        .dropTableIfExists("tasks")
        .dropTableIfExists("projects");
};