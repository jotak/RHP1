/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/mongoose/index.d.ts" />
/// <reference path="../../typings/globals/q/index.d.ts" />

import MongoClient from '../../persistence/mongoClient';
import UserPersistenceService from '../../persistence/userPersistenceService';

describe('UserPersistenceService', () => {
    var userPersistenceService: UserPersistenceService;

    before((done) => {
        var mongoClient = new MongoClient("localhost", 27017, "rhp1");
        mongoClient.status().then(status => {
            if (status !== 1) {
                done(new Error("Could not connect to DB. Connection status is " + status));
                return;
            }
            done();
        })
        .catch(err => {
            done(new Error('Error: ' + err));
        });
        userPersistenceService = new UserPersistenceService(mongoClient);
    });

    describe('#count', () => {
        it('should count users', (done) => {
            userPersistenceService.count()
                .then(count => {
                    if (count != 100) {
                        done(new Error('Expecting 100 results but got ' + count));
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
        it('should get user by username', (done) => {
            userPersistenceService.getByUsername("tinymouse123")
                .then(user => {
                    if (user.email !== "susie.wade@example.com") {
                        done(new Error('Expecting email ' + user.email + ' to be susie.wade@example.com'));
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
        it('should get all users', (done) => {
            userPersistenceService.all()
                .then(users => {
                    if (users.length != 100) {
                        done(new Error('Expecting 100 items, got ' + users.length));
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
        it('should search users from Louisiana', (done) => {
            userPersistenceService.search({"user.location.state": "louisiana"})
                .then(users => {
                    if (users.length != 3) {
                        done(new Error('Expecting 3 items, got ' + users.length));
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
