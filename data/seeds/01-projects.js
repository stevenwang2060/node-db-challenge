exports.seed = function (knex) {
  return knex("projects").insert([
    { name: "Project 1", description: "project 1 description" },
    { name: "Project 2", description: "project 2 description" },
  ]);
};