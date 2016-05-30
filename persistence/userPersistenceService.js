"use strict";
var mongoose = require('mongoose');
var q = require('q');
var userSchema_1 = require('./model/userSchema');
var UserPersistenceService = (function () {
    function UserPersistenceService(mongoClient) {
        this.userModel = mongoClient.buildModel("users", new mongoose.Schema({ "user": userSchema_1["default"].build() }));
    }
    UserPersistenceService.prototype.create = function (user) {
        var deferred = q.defer();
        this.userModel.create({ "user": user }, function (err) {
            if (err) {
                if (err.code == 11000) {
                    // Duplicate key => conflict
                    deferred.resolve({ conflict: true });
                }
                else {
                    deferred.reject(err);
                }
            }
            else {
                deferred.resolve({});
            }
        });
        return deferred.promise;
    };
    UserPersistenceService.prototype.update = function (user) {
        var deferred = q.defer();
        this.userModel.update({ "user.username": user.username }, { "user": user }, function (err, nbUpdates) {
            if (err) {
                deferred.reject(err);
            }
            else {
                // Note: outdated typescript definition here; quick workaround
                var cast = nbUpdates;
                deferred.resolve(cast.n);
            }
        });
        return deferred.promise;
    };
    UserPersistenceService.prototype.delete = function (username) {
        var deferred = q.defer();
        // Note: outdated typescript definition here; quick workaround
        var func = function (err, result) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(result.result.n);
            }
        };
        this.userModel.remove({ "user.username": username }, func);
        return deferred.promise;
    };
    UserPersistenceService.prototype.getByUsername = function (username) {
        var deferred = q.defer();
        this.userModel.findOne({ "user.username": username }, function (err, res) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(res ? res.user : null);
            }
        }).lean();
        return deferred.promise;
    };
    UserPersistenceService.prototype.search = function (filters) {
        var deferred = q.defer();
        this.userModel.find(filters, function (err, res) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(res.map(function (m) { return m.user; }));
            }
        }).lean();
        return deferred.promise;
    };
    UserPersistenceService.prototype.all = function () {
        return this.search({});
    };
    UserPersistenceService.prototype.count = function () {
        var deferred = q.defer();
        this.userModel.count({}, function (err, count) {
            if (err) {
                deferred.reject(err);
            }
            else {
                deferred.resolve(count);
            }
        });
        return deferred.promise;
    };
    // For testing only
    UserPersistenceService.prototype.reset = function (users) {
        var deferred = q.defer();
        var Model = this.userModel;
        var collection = users.map(function (u) {
            return new Model({ "user": u });
        });
        this.userModel.remove({}, function (err) {
            if (err) {
                deferred.reject(err);
            }
            else {
                Model.create(collection, function (err) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve();
                    }
                });
            }
        });
        return deferred.promise;
    };
    return UserPersistenceService;
}());
exports.__esModule = true;
exports["default"] = UserPersistenceService;
