/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/supertest/index.d.ts" />
/// <reference path="../../typings/globals/superagent/index.d.ts" />
/// <reference path="../../typings/globals/express/index.d.ts" />
/// <reference path="../../typings/globals/serve-static/index.d.ts" />
/// <reference path="../../typings/globals/express-serve-static-core/index.d.ts" />
/// <reference path="../../typings/globals/body-parser/index.d.ts" />
/// <reference path="../../typings/modules/mime/index.d.ts" />
"use strict";
var request = require('supertest');
var userPersistenceService_1 = require('../../persistence/userPersistenceService');
var mongoClient_1 = require('../../persistence/mongoClient');
var restServer_1 = require('../../rest-api/restServer');
var UsersTestDataSet_1 = require('../UsersTestDataSet');
describe('RestServer', function () {
    var restServer;
    var userPersistenceService;
    var url = "http://localhost:8081";
    before(function (done) {
        // Initiate mongo client on test database
        var mongoClient = new mongoClient_1["default"]("localhost", 27017, "rhp1_test");
        mongoClient.status().then(function (status) {
            if (status !== 1) {
                done(new Error("Could not connect to DB. Connection status is " + status));
                return;
            }
        })
            .catch(function (err) {
            done(new Error('Error: ' + err));
        });
        // Instanciate the service to test
        userPersistenceService = new userPersistenceService_1["default"](mongoClient);
        restServer = new restServer_1["default"](userPersistenceService);
        restServer.start(8081);
        done();
    });
    beforeEach(function (done) {
        // Reset database to hard-coded set
        userPersistenceService.reset(UsersTestDataSet_1["default"].INITIAL_USERS).then(function () { return done(); }).fail(function (err) { return done(err); });
    });
    describe('GET /users/', function () {
        it('should get all users', function (done) {
            request(url).get('/users/')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                if (res.body.length !== 5) {
                    done(new Error('Expecting 5 results but got ' + res.body.length));
                    return;
                }
                done();
            });
        });
    });
    describe('GET /users/tinywolf709', function () {
        it('should get user tinywolf709', function (done) {
            request(url).get('/users/tinywolf709')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                if (res.body.username !== "tinywolf709") {
                    done(new Error('Expecting user tinywolf709 but got ' + res.body.username));
                    return;
                }
                if (res.body.phone !== "031-541-9181") {
                    done(new Error('Expecting phone 031-541-9181 but got ' + res.body.phone));
                    return;
                }
                done();
            });
        });
    });
    describe('GET /users/unknown', function () {
        it('should not get user unknown', function (done) {
            request(url).get('/users/unknown')
                .expect(404, done);
        });
    });
    describe('GET /searches/users/city/Westport', function () {
        it('should get 2 users in Westport', function (done) {
            request(url).get('/searches/users/city/Westport')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                if (res.body.length !== 2) {
                    done(new Error('Expecting 2 results but got ' + res.body.length));
                    return;
                }
                done();
            });
        });
    });
    describe('GET /searches/users/city/marseille', function () {
        it('should not get any user in Marseille', function (done) {
            request(url).get('/searches/users/city/marseille')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                if (res.body.length !== 0) {
                    done(new Error('Expecting 0 result but got ' + res.body.length));
                    return;
                }
                done();
            });
        });
    });
    describe('GET /searches/users/gender/female', function () {
        it('should get 3 female users', function (done) {
            request(url).get('/searches/users/gender/female')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                if (res.body.length !== 3) {
                    done(new Error('Expecting 3 results but got ' + res.body.length));
                    return;
                }
                done();
            });
        });
    });
    describe('POST /users/', function () {
        it('should create user', function (done) {
            request(url).post('/users/')
                .send(UsersTestDataSet_1["default"].FLENN_FLORES)
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                // Check it was added
                request(url).get('/users/')
                    .end(function (err, res) {
                    if (err)
                        throw err;
                    if (res.body.length !== 6) {
                        done(new Error('Expecting 6 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
            });
        });
    });
    describe('POST /users/', function () {
        it('should not create conflicting user', function (done) {
            request(url).post('/users/')
                .send(UsersTestDataSet_1["default"].UPDATED_ANDY_ADAMS)
                .expect(409, done);
        });
    });
    describe('POST /users/beautifulfish360', function () {
        it('should update user', function (done) {
            request(url).post('/users/beautifulfish360')
                .send(UsersTestDataSet_1["default"].UPDATED_ANDY_ADAMS)
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                // Check it was added
                request(url).get('/users/')
                    .end(function (err, res) {
                    if (err)
                        throw err;
                    if (res.body.length !== 5) {
                        done(new Error('Expecting 5 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
            });
        });
    });
    describe('POST /users/blackfrog555', function () {
        it('should not update user not found', function (done) {
            request(url).post('/users/blackfrog555')
                .send(UsersTestDataSet_1["default"].FLENN_FLORES)
                .expect(404, done);
        });
    });
    describe('POST /users/beautifulfish360', function () {
        it('should not update wrong user', function (done) {
            request(url).post('/users/tinywolf709')
                .send(UsersTestDataSet_1["default"].UPDATED_ANDY_ADAMS)
                .expect(400, done);
        });
    });
    describe('DELETE /users/beautifulfish360', function () {
        it('should delete user', function (done) {
            request(url).delete('/users/beautifulfish360')
                .expect(200)
                .end(function (err, res) {
                if (err)
                    throw err;
                // Check it was deleted
                request(url).get('/users/')
                    .end(function (err, res) {
                    if (err)
                        throw err;
                    if (res.body.length !== 4) {
                        done(new Error('Expecting 4 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
            });
        });
    });
    describe('DELETE /users/blackfrog555', function () {
        it('should not delete user not found', function (done) {
            request(url).delete('/users/blackfrog555')
                .expect(404, done);
        });
    });
});
