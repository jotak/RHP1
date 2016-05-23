/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/supertest/index.d.ts" />
/// <reference path="../../typings/globals/superagent/index.d.ts" />
/// <reference path="../../typings/globals/express/index.d.ts" />
/// <reference path="../../typings/globals/serve-static/index.d.ts" />
/// <reference path="../../typings/globals/express-serve-static-core/index.d.ts" />
/// <reference path="../../typings/globals/body-parser/index.d.ts" />
/// <reference path="../../typings/modules/mime/index.d.ts" />

import request = require('supertest');

import UserPersistenceService from '../../persistence/userPersistenceService';
import MongoClient from '../../persistence/mongoClient';
import RestServer from '../../rest-api/restServer';
import UsersTestDataSet from '../UsersTestDataSet';

describe('RestServer', () => {
    var restServer: RestServer;
    var userPersistenceService: UserPersistenceService;
    let url = "http://localhost:8081";

    before(done => {
        // Initiate mongo client on test database
        let mongoClient = new MongoClient("localhost", 27017, "rhp1_test");
        mongoClient.status().then(status => {
            if (status !== 1) {
                done(new Error("Could not connect to DB. Connection status is " + status));
                return;
            }
        })
        .catch(err => {
            done(new Error('Error: ' + err));
        });
        // Instanciate the service to test
        userPersistenceService = new UserPersistenceService(mongoClient);
        restServer = new RestServer(userPersistenceService);
        restServer.start(8081);
        done();
    });

    beforeEach(done => {
        // Reset database to hard-coded set
        userPersistenceService.reset(UsersTestDataSet.INITIAL_USERS).then(() => done()).fail(err => done(err));
    });

    describe('GET /users/', () => {
        it('should get all users', done => {
            request(url).get('/users/')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    if (res.body.length !== 5) {
                        done(new Error('Expecting 5 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
        });
    });

    describe('GET /users/tinywolf709', () => {
        it('should get user tinywolf709', done => {
            request(url).get('/users/tinywolf709')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
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

    describe('GET /users/unknown', () => {
        it('should not get user unknown', done => {
            request(url).get('/users/unknown')
                .expect(404, done)
        });
    });

    describe('GET /searches/users/city/Westport', () => {
        it('should get 2 users in Westport', done => {
            request(url).get('/searches/users/city/Westport')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    if (res.body.length !== 2) {
                        done(new Error('Expecting 2 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
        });
    });

    describe('GET /searches/users/city/marseille', () => {
        it('should not get any user in Marseille', done => {
            request(url).get('/searches/users/city/marseille')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    if (res.body.length !== 0) {
                        done(new Error('Expecting 0 result but got ' + res.body.length));
                        return;
                    }
                    done();
                });
        });
    });

    describe('GET /searches/users/gender/female', () => {
        it('should get 3 female users', done => {
            request(url).get('/searches/users/gender/female')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    if (res.body.length !== 3) {
                        done(new Error('Expecting 3 results but got ' + res.body.length));
                        return;
                    }
                    done();
                });
        });
    });

    describe('POST /users/', () => {
        it('should create user', done => {
            request(url).post('/users/')
                .send(UsersTestDataSet.FLENN_FLORES)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    // Check it was added
                    request(url).get('/users/')
                        .end((err, res) => {
                            if (err) throw err;
                            if (res.body.length !== 6) {
                                done(new Error('Expecting 6 results but got ' + res.body.length));
                                return;
                            }
                            done();
                        });
                });
        });
    });

    describe('POST /users/', () => {
        it('should not create conflicting user', done => {
            request(url).post('/users/')
                .send(UsersTestDataSet.UPDATED_ANDY_ADAMS)
                .expect(409, done);
        });
    });

    describe('POST /users/beautifulfish360', () => {
        it('should update user', done => {
            request(url).post('/users/beautifulfish360')
                .send(UsersTestDataSet.UPDATED_ANDY_ADAMS)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    // Check it was added
                    request(url).get('/users/')
                        .end((err, res) => {
                            if (err) throw err;
                            if (res.body.length !== 5) {
                                done(new Error('Expecting 5 results but got ' + res.body.length));
                                return;
                            }
                            done();
                        });
                });
        });
    });

    describe('POST /users/blackfrog555', () => {
        it('should not update user not found', done => {
            request(url).post('/users/blackfrog555')
                .send(UsersTestDataSet.FLENN_FLORES)
                .expect(404, done);
        });
    });

    describe('POST /users/beautifulfish360', () => {
        it('should not update wrong user', done => {
            request(url).post('/users/tinywolf709')
                .send(UsersTestDataSet.UPDATED_ANDY_ADAMS)
                .expect(400, done);
        });
    });

    describe('DELETE /users/beautifulfish360', () => {
        it('should delete user', done => {
            request(url).delete('/users/beautifulfish360')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    // Check it was deleted
                    request(url).get('/users/')
                        .end((err, res) => {
                            if (err) throw err;
                            if (res.body.length !== 4) {
                                done(new Error('Expecting 4 results but got ' + res.body.length));
                                return;
                            }
                            done();
                        });
                });
        });
    });

    describe('DELETE /users/blackfrog555', () => {
        it('should not delete user not found', done => {
            request(url).delete('/users/blackfrog555')
                .expect(404, done);
        });
    });
});
