import express = require('express');
import bodyParser = require('body-parser');

"use strict";

export default class RestServer {
    public constructor(port: number) {
        let app = express();
        app.use(bodyParser.json());
        app.listen(port);

        this.registerRoutes(app);
    }

    private registerRoutes(app: express.Application) {
        // Register CRUDL routes

        // TODO: hide password??
    }
}
