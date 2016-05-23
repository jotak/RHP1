/// <reference path="typings/globals/node/index.d.ts" />
/// <reference path="typings/globals/mongoose/index.d.ts" />
/// <reference path="typings/globals/q/index.d.ts" />
/// <reference path="typings/globals/express/index.d.ts" />
/// <reference path="typings/globals/serve-static/index.d.ts" />
/// <reference path="typings/globals/express-serve-static-core/index.d.ts" />
/// <reference path="typings/globals/body-parser/index.d.ts" />

import UserPersistenceService from './persistence/userPersistenceService';
import MongoClient from './persistence/mongoClient';
import RestServer from './rest-api/restServer';

"use strict";

let mongoClient: MongoClient = new MongoClient("localhost", 27017, "rhp1");
let userPersistenceService: UserPersistenceService = new UserPersistenceService(mongoClient);
let restServer: RestServer = new RestServer(userPersistenceService);
let httpPort = 8080;

restServer.start(httpPort);
console.log("Server listening on port " + httpPort);
