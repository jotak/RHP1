"use strict";
var mongoClient_1 = require('../../persistence/mongoClient');
var userPersistenceService_1 = require('../../persistence/userPersistenceService');
var UsersTestDataSet_1 = require('../UsersTestDataSet');
describe('UserPersistenceService', function () {
    var userPersistenceService;
    before(function (done) {
        var mongoClient = new mongoClient_1.default("localhost", 27017, "rhp1_test");
        mongoClient.status().then(function (status) {
            if (status !== 1) {
                done(new Error("Could not connect to DB. Connection status is " + status));
                return;
            }
        })
            .catch(function (err) {
            done(new Error('Error: ' + err));
        });
        userPersistenceService = new userPersistenceService_1.default(mongoClient);
        done();
    });
    beforeEach(function (done) {
        userPersistenceService.reset(UsersTestDataSet_1.default.INITIAL_USERS).then(function () { return done(); }).fail(function (err) { return done(err); });
    });
    describe('#count', function () {
        it('should count users', function (done) {
            userPersistenceService.count()
                .then(function (count) {
                if (count != 5) {
                    done(new Error('Expecting 5 results but got ' + count));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#getByUsername', function () {
        it('should get user by username', function (done) {
            userPersistenceService.getByUsername("redlion798")
                .then(function (user) {
                if (user.email !== "florence.fowler@example.com") {
                    done(new Error('Expecting email ' + user.email + ' to be florence.fowler@example.com'));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#all', function () {
        it('should get all users', function (done) {
            userPersistenceService.all()
                .then(function (users) {
                if (users.length != 5) {
                    done(new Error('Expecting 5 items, got ' + users.length));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#search', function () {
        it('should search users from Alaska', function (done) {
            userPersistenceService.search({ "user.location.state": "alaska" })
                .then(function (users) {
                if (users.length != 2) {
                    done(new Error('Expecting 2 items, got ' + users.length));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#delete', function () {
        it('should delete user', function (done) {
            userPersistenceService.delete("redlion798")
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(function (count) {
                if (count != 4) {
                    done(new Error('Expecting 4 items, got ' + count));
                    return;
                }
            })
                .then(function () { return userPersistenceService.getByUsername("redlion798"); })
                .then(function (user) {
                if (user !== null) {
                    done(new Error('Expecting null user'));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#create', function () {
        it('should create user', function (done) {
            userPersistenceService.create(UsersTestDataSet_1.default.FLENN_FLORES)
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(function (count) {
                if (count != 6) {
                    done(new Error('Expecting 6 items, got ' + count));
                    return;
                }
            })
                .then(function () { return userPersistenceService.getByUsername("blackfrog555"); })
                .then(function (user) {
                if (user === null) {
                    done(new Error('Expecting non null user'));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
    describe('#update', function () {
        it('should update user', function (done) {
            userPersistenceService.update(UsersTestDataSet_1.default.UPDATED_ANDY_ADAMS)
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(function (count) {
                if (count != 5) {
                    done(new Error('Expecting 5 items, got ' + count));
                    return;
                }
            })
                .then(function () { return userPersistenceService.getByUsername("beautifulfish360"); })
                .then(function (user) {
                if (user === null) {
                    done(new Error('Expecting non null user'));
                    return;
                }
                if (user.gender === "male") {
                    done(new Error('Expecting gender to be female now'));
                    return;
                }
                done();
            })
                .catch(function (err) {
                done(new Error('Error: ' + err));
            });
        });
    });
});
