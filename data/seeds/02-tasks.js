exports.seed = function (knex) {
  return knex("tasks").insert([
    { project_id: 1, description: "start project", notes: "notes" },
    { project_id: 1, description: "finish project", notes: "notes" },
    { project_id: 2, description: "start project", notes: "notes" },
    { project_id: 2, description: "finish project", notes: "notes" },
  ]);
};