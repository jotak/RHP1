/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/mongoose/index.d.ts" />
/// <reference path="../../typings/globals/q/index.d.ts" />
"use strict";
var mongoClient_1 = require('../../persistence/mongoClient');
describe('MongoClient', function () {
    describe('#constructor', function () {
        it('should connect', function (done) {
            var client = new mongoClient_1["default"]("localhost", 27017, "rhp1");
            var statusNow = client.statusNow();
            if (statusNow !== 2) {
                throw new Error('Expecting status connecting (2) but got ' + statusNow);
            }
            client.status().then(function (statusAfterConn) {
                if (statusAfterConn !== 1) {
                    throw new Error('Expecting status connected (1) but got ' + statusAfterConn);
                }
                done();
            });
        });
    });
});
