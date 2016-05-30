"use strict";
var express = require('express');
var bodyParser = require('body-parser');
"use strict";
var RestServer = (function () {
    function RestServer(userPersistenceService) {
        this.userPersistenceService = userPersistenceService;
    }
    RestServer.prototype.start = function (port) {
        var app = express();
        app.use(bodyParser.json());
        app.listen(port);
        this.registerRoutes(app);
    };
    RestServer.prototype.registerRoutes = function (app) {
        this.registerListAll(app);
        this.registerGetByUsername(app);
        this.registerCreate(app);
        this.registerUpdate(app);
        this.registerDelete(app);
        this.registerCustomSearch(app);
        this.registerSearchByCity(app);
        this.registerSearchByGender(app);
    };
    RestServer.prototype.registerListAll = function (app) {
        var self = this;
        app.get("/users", function (req, res) {
            self.userPersistenceService.all()
                .then(function (users) { return res.json(users); })
                .fail(function (reason) {
                console.error("Application error: " + reason.message);
                res.status(500).send(String(reason));
            })
                .done();
        });
    };
    RestServer.prototype.registerGetByUsername = function (app) {
        var self = this;
        app.get("/users/:username", function (req, res) {
            self.userPersistenceService.getByUsername(req.params.username)
                .then(function (user) {
                if (user === null) {
                    res.status(404).send("User " + req.params.username + " not found");
                }
                else {
                    res.json(user);
                }
            })
                .fail(function (reason) {
                console.error("Application error: " + reason.message);
                res.status(500).send(String(reason));
            })
                .done();
        });
    };
    RestServer.prototype.registerCreate = function (app) {
        var self = this;
        app.post("/users/", function (req, res) {
            self.userPersistenceService.create(req.body)
                .then(function (result) {
                if (result.conflict) {
                    res.status(409).send("User " + req.body.username + " already exists.");
                    return;
                }
                res.send("OK");
            })
                .fail(function (reason) {
                console.error("Application error: " + reason.message);
                res.status(500).send(String(reason));
            })
                .done();
        });
    };
    RestServer.prototype.registerUpdate = function (app) {
        var self = this;
        app.post("/users/:username", function (req, res) {
            if (req.body.username !== req.params.username) {
                res.status(400).send("The username cannot be changed.");
                return;
            }
            self.userPersistenceService.update(req.body)
                .then(function (nbUpdated) {
                if (nbUpdated === 0) {
                    res.status(404).send("User " + req.params.username + " not found");
                    return;
                }
                res.send("OK");
            })
                .fail(function (reason) {
                console.error("Application error: " + reason.message);
                res.status(500).send(String(reason));
            })
                .done();
        });
    };
    RestServer.prototype.registerDelete = function (app) {
        var self = this;
        app.delete("/users/:username", function (req, res) {
            self.userPersistenceService.delete(req.params.username)
                .then(function (nbDeleted) {
                if (nbDeleted === 0) {
                    res.status(404).send("User " + req.params.username + " not found");
                    return;
                }
                res.send("OK");
            })
                .fail(function (reason) {
                console.error("Application error: " + reason.message);
                res.status(500).send(String(reason));
            })
                .done();
        });
    };
    RestServer.prototype.searchAndAnswer = function (searchQuery, res) {
        this.userPersistenceService.search(searchQuery)
            .then(function (users) { return res.json(users); })
            .fail(function (reason) {
            console.error("Application error: " + reason.message);
            res.status(500).send(String(reason));
        })
            .done();
    };
    RestServer.prototype.registerCustomSearch = function (app) {
        var self = this;
        app.post("/searches/custom", function (req, res) { return self.searchAndAnswer(req.body, res); });
    };
    RestServer.prototype.registerSearchByCity = function (app) {
        var self = this;
        app.get("/searches/users/city/:city", function (req, res) { return self.searchAndAnswer({ "user.location.city": req.params.city }, res); });
    };
    RestServer.prototype.registerSearchByGender = function (app) {
        var self = this;
        app.get("/searches/users/gender/:gender", function (req, res) { return self.searchAndAnswer({ "user.gender": req.params.gender }, res); });
    };
    return RestServer;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RestServer;
