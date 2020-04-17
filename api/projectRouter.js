const express = require("express");
const project = require("./projectModel");

const router = express.Router();

router.get("/", (req, res) => {
    project
        .getAll(req.query)
        .then((p) => {
            res.status(200).json(p);
        })
        .catch((err) => {
            res.status(500).json({ message: "cannot retrieve projects" });
        });
});

router.get("/:id", validateId, (req, res) => {
    res.status(200).json(req.p);
});

router.get("/:id/tasks", (req, res) => {
    project
        .findTasks(req.params.id)
        .then((task) => {
            if (task.length) {
                res.json(task);
            } else {
                res.status(404).json({ msg: "could not find tasks" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to get tasks", err });
        });
});

router.get("/:id/resources", (req, res) => {
    project
        .findResources(req.params.id)
        .then((resource) => {
            if (resource.length) {
                res.json(resource);
            } else {
                res.status(404).json({ msg: "could not find resources for project" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to get tasks", err });
        });
});

router.post("/", validateProject, (req, res) => {
    project
        .insert(req.body)
        .then(() => {
            res.status(201).json(req.body);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                messge: "There was an error saving the project to the database",
            });
        });
});

router.post("/:id/tasks", (req, res) => {
    const taskData = req.body;
    const { id } = req.params;
    project
        .get(id)
        .then((task) => {
            if (task) {
                project.addTask(taskData, id).then((task) => {
                    res.status(201).json(task);
                });
            } else {
                res
                    .status(404)
                    .json({ message: "Could not find project with given id." });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to create new task", err });
        });
});
router.post("/:id/resources", (req, res) => {
    const rData = req.body;
    const { id } = req.params;
    project
        .get(id)
        .then((task) => {
            if (task) {
                project.addResource(rData, id).then((task) => {
                    res.status(201).json(task);
                });
            } else {
                res
                    .status(404)
                    .json({ message: "Could not find resources with given id." });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "Failed to create new resource", err });
        });
});

router.put("/:id", validateProject, validateId, (req, res) => {
    project
        .update(req.params.id, req.body)
        .then(res.status(200).json(req.body))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Error processing request" });
        });
});

router.delete("/:id", validateId, (req, res) => {
    project
        .remove(req.params.id)
        .then((p) => res.status(200).json(p))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "error while deleting" });
        });
});

//middleware//

function validateId(req, res, next) {
    const { id } = req.params;
    project
        .get(id)
        .then((p) => {
            if (p) {
                req.p = p;
                next();
            } else {
                res.status(404).json({ message: "ID not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ message: "failed", err });
        });
}

function validateProject(req, res, next) {
    const body = req.body;
    !body || body === {}
        ? res.status(400).json({ message: "please include project body" })
        : !body.name
            ? res.status(400).json({ message: "missing name" })
            : next();
}

module.exports = router;