import express = require('express');
import bodyParser = require('body-parser');
import UserPersistenceService from '../persistence/userPersistenceService';

"use strict";

export default class RestServer {

    private userPersistenceService: UserPersistenceService;

    public constructor(userPersistenceService: UserPersistenceService) {
        this.userPersistenceService = userPersistenceService;
    }

    public start(port: number) {
        let app = express();
        app.use(bodyParser.json());
        app.listen(port);
        this.registerRoutes(app);
    }

    private registerRoutes(app: express.Application) {
        // Register CRUDL routes
        this.registerListAll(app);
        this.registerGetByUsername(app);
        this.registerCreate(app);
        this.registerUpdate(app);
        this.registerDelete(app);
        this.registerCustomSearch(app);
        this.registerSearchByCity(app);
        this.registerSearchByGender(app);
        // ... and so on
    }

    private registerListAll(app: express.Application) {
        var self = this;
        // full list here but we may want partial list, or paginated... depends on usage
        app.get("/users", (req, res) => {
            // TODO: hide passwords??
            self.userPersistenceService.all()
                .then(users => res.json(users))
                .fail(reason => {
                    console.error("Application error: " + reason.message);
                    // TODO: more accurate error codes depending on error (503...)
                    res.status(500).send(String(reason));
                })
                .done();
        });
    }

    private registerGetByUsername(app: express.Application) {
        var self = this;
        app.get("/users/:username", (req, res) => {
            self.userPersistenceService.getByUsername(req.params.username)
                .then(user => {
                    // TODO: hide passwords??
                    if (user === null) {
                        res.status(404).send("User " + req.params.username + " not found");
                    } else {
                        res.json(user);
                    }
                })
                .fail(reason => {
                    console.error("Application error: " + reason.message);
                    // TODO: more accurate error codes depending on error (503...)
                    res.status(500).send(String(reason));
                })
                .done();
        });
    }

    private registerCreate(app: express.Application) {
        var self = this;
        app.post("/users/", (req, res) => {
            self.userPersistenceService.create(req.body)
                .then(result => {
                    if (result.conflict) {
                        res.status(409).send("User " + req.body.username + " already exists.");
                        return;
                    }
                    res.send("OK");
                })
                .fail(reason => {
                    console.error("Application error: " + reason.message);
                    // TODO: more accurate error codes depending on error (503...)
                    res.status(500).send(String(reason));
                })
                .done();
        });
    }

    private registerUpdate(app: express.Application) {
        var self = this;
        app.post("/users/:username", (req, res) => {
            if (req.body.username !== req.params.username) {
                // Bad request
                res.status(400).send("The username cannot be changed.");
                return;
            }
            self.userPersistenceService.update(req.body)
                .then(nbUpdated => {
                    if (nbUpdated === 0) {
                        res.status(404).send("User " + req.params.username + " not found");
                        return;
                    }
                    res.send("OK");
                })
                .fail(reason => {
                    console.error("Application error: " + reason.message);
                    // TODO: more accurate error codes depending on error (503...)
                    res.status(500).send(String(reason));
                })
                .done();
        });
    }

    private registerDelete(app: express.Application) {
        var self = this;
        app.delete("/users/:username", (req, res) => {
            self.userPersistenceService.delete(req.params.username)
                .then(nbDeleted => {
                    if (nbDeleted === 0) {
                        res.status(404).send("User " + req.params.username + " not found");
                        return;
                    }
                    res.send("OK");
                })
                .fail(reason => {
                    console.error("Application error: " + reason.message);
                    // TODO: more accurate error codes depending on error (503...)
                    res.status(500).send(String(reason));
                })
                .done();
        });
    }

    private searchAndAnswer(searchQuery, res) {
        // TODO: protect against injections?
        this.userPersistenceService.search(searchQuery)
            .then(users => res.json(users))
            .fail(reason => {
                console.error("Application error: " + reason.message);
                // TODO: more accurate error codes depending on error (503...)
                res.status(500).send(String(reason));
            })
            .done();
    }

    private registerCustomSearch(app: express.Application) {
        var self = this;
        app.post("/searches/custom", (req, res) => self.searchAndAnswer(req.body, res));
    }

    private registerSearchByCity(app: express.Application) {
        var self = this;
        app.get("/searches/users/city/:city", (req, res) => self.searchAndAnswer({"user.location.city": req.params.city}, res));
    }

    private registerSearchByGender(app: express.Application) {
        var self = this;
        app.get("/searches/users/gender/:gender", (req, res) => self.searchAndAnswer({"user.gender": req.params.gender}, res));
    }
}
