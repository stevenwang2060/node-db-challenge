exports.seed = function (knex) {
  return knex("resources").insert([
    { project_id: 1, name: "resource for project 1", description: "description" },
    { project_id: 2, name: "resource for project 2", description: "description" },
  ]);
};