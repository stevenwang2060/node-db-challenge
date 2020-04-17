const db = require("../data/dbConfig");
const mappers = require("./mappers");

module.exports = {
    get,
    getAll,
    insert,
    update,
    remove,
    getProjectTasks,
    getTaskById,
    findTasks,
    addTask,
    getResourceById,
    findResources,
    addResource,
};

function getAll() {
    return db("projects");
}

function get(id) {
    let query = db("projects as p");

    if (id) {
        query.where("p.id", id).first();

        const promises = [query, getProjectTasks(id)];

        return Promise.all(promises).then(function (results) {
            let [project, actions] = results;

            if (project) {
                project.actions = actions;

                return mappers.projectToBody(project);
            } else {
                return null;
            }
        });
    } else {
        return query.then((projects) => {
            return projects.map((project) => mappers.projectToBody(project));
        });
    }
}

function insert(project) {
    return db("projects")
        .insert(project, "id")
        .then(([id]) => get(id));
}

function update(id, changes) {
    return db("projects")
        .where("id", id)
        .update(changes)
        .then((count) => (count > 0 ? get(id) : null));
}

function remove(id) {
    return db("projects").where("id", id).del();
}

function getProjectTasks(projectId) {
    return db("tasks")
        .where("project_id", projectId)
        .then((actions) => actions.map((action) => mappers.actionToBody(action)));
}

function getTaskById(id) {
    return db("tasks").where({ id }).first();
}

function getResourceById(id) {
    return db("resources").where({ id }).first();
}

function findTasks(project_id) {
    return db("tasks as t")
        .join("projects as p", "t.project_id", "p.id")
        .select("t.description", "t.notes")
        .where({ project_id });
}

function addTask(task) {
    return db("tasks")
        .insert(task)
        .then((ids) => {
            return getTaskById(ids[0]);
        });
}
function findResources(project_id) {
    return db("resources as r")
        .join("projects as p", "r.project_id", "p.id")
        .select("r.name", "r.description")
        .where({ project_id });
}
function addResource(resource) {
    return db("resources")
        .insert(resource)
        .then((ids) => {
            return getResourceById(ids[0]);
        });
}