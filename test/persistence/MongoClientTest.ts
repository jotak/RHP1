/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/mongoose/index.d.ts" />
/// <reference path="../../typings/globals/q/index.d.ts" />

import MongoClient from '../../persistence/mongoClient';

describe('MongoClient', () => {
    describe('#constructor', () => {
        it('should connect', (done) => {
            var client: MongoClient = new MongoClient("localhost", 27017, "rhp1");
            var statusNow: number = client.statusNow();
            if (statusNow !== 2) {
                throw new Error('Expecting status connecting (2) but got ' + statusNow);
            }
            client.status().then(statusAfterConn => {
                if (statusAfterConn !== 1) {
                    throw new Error('Expecting status connected (1) but got ' + statusAfterConn);
                }
                done();
            });
        });
    });
});
