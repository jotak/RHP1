"use strict";
var mongoose = require('mongoose');
var q = require('q');
var MongoClient = (function () {
    function MongoClient(host, port, db) {
        this.connection = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + db);
        this.connection.on('error', console.error.bind(console, 'connection error:'));
        var deferred = q.defer();
        this.onReady = deferred.promise;
        this.connection.once('open', function () { return deferred.resolve(); });
    }
    MongoClient.prototype.status = function () {
        var self = this;
        return this.onReady.then(function () {
            return self.connection.readyState;
        });
    };
    MongoClient.prototype.statusNow = function () {
        return this.connection.readyState;
    };
    MongoClient.prototype.buildModel = function (collection, schema) {
        return this.connection.model(collection, schema);
    };
    return MongoClient;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MongoClient;
