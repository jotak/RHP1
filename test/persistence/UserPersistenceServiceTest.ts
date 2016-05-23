/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/mongoose/index.d.ts" />
/// <reference path="../../typings/globals/q/index.d.ts" />

import MongoClient from '../../persistence/mongoClient';
import User from '../../data-model-api/user';
import UserPersistenceService from '../../persistence/userPersistenceService';
import UsersTestDataSet from '../UsersTestDataSet';

describe('UserPersistenceService', () => {
    var userPersistenceService: UserPersistenceService;

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
        done();
    });

    beforeEach(done => {
        // Reset database to hard-coded set
        userPersistenceService.reset(UsersTestDataSet.INITIAL_USERS).then(() => done()).fail(err => done(err));
    });

    describe('#count', () => {
        it('should count users', done => {
            userPersistenceService.count()
                .then(count => {
                    if (count != 5) {
                        done(new Error('Expecting 5 results but got ' + count));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#getByUsername', () => {
        it('should get user by username', done => {
            userPersistenceService.getByUsername("redlion798")
                .then(user => {
                    if (user.email !== "florence.fowler@example.com") {
                        done(new Error('Expecting email ' + user.email + ' to be florence.fowler@example.com'));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#all', () => {
        it('should get all users', done => {
            userPersistenceService.all()
                .then(users => {
                    if (users.length != 5) {
                        done(new Error('Expecting 5 items, got ' + users.length));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#search', () => {
        it('should search users from Alaska', done => {
            userPersistenceService.search({"user.location.state": "alaska"})
                .then(users => {
                    if (users.length != 2) {
                        done(new Error('Expecting 2 items, got ' + users.length));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#delete', () => {
        it('should delete user', done => {
            userPersistenceService.delete("redlion798")
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(count => {
                    if (count != 4) {
                        done(new Error('Expecting 4 items, got ' + count));
                        return;
                    }
                })
                .then(() => userPersistenceService.getByUsername("redlion798"))
                .then(user => {
                    if (user !== null) {
                        done(new Error('Expecting null user'));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#create', () => {
        it('should create user', done => {
            userPersistenceService.create(UsersTestDataSet.FLENN_FLORES)
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(count => {
                    if (count != 6) {
                        done(new Error('Expecting 6 items, got ' + count));
                        return;
                    }
                })
                .then(() => userPersistenceService.getByUsername("blackfrog555"))
                .then(user => {
                    if (user === null) {
                        done(new Error('Expecting non null user'));
                        return;
                    }
                    done();
                })
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });

    describe('#update', () => {
        it('should update user', done => {
            userPersistenceService.update(UsersTestDataSet.UPDATED_ANDY_ADAMS)
                .then(userPersistenceService.count.bind(userPersistenceService))
                .then(count => {
                    if (count != 5) {
                        done(new Error('Expecting 5 items, got ' + count));
                        return;
                    }
                })
                .then(() => userPersistenceService.getByUsername("beautifulfish360"))
                .then(user => {
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
                .catch(err => {
                    done(new Error('Error: ' + err));
                });
        });
    });
});
