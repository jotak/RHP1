/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/node/index.d.ts" />
/// <reference path="../../typings/globals/mongoose/index.d.ts" />
/// <reference path="../../typings/globals/q/index.d.ts" />

import MongoClient from '../../persistence/mongoClient';
import UserSchema from '../../persistence/model/userSchema';

describe('UserModel', () => {
    var userModel;

    before(() => {
        userModel = UserSchema.toModel();
    });

    describe('#count', () => {
        it('should build user model then count', (done) => {
            userModel.count({}, (err, count) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }
                if (count != 100) {
                    throw new Error('Expecting 100 results but got ' + count);
                }
                done();
            });
        });
    });

    describe('#getByName', () => {
        it('should get user by name', (done) => {
            userModel.findOne({"user.username": "tinymouse123"}, (err, res) => {
                if (err) {
                    throw new Error('Error: ' + err);
                }
                if (res.user.email !== "susie.wade@example.com") {
                    throw new Error('Expecting email ' + res.user.email + ' to be susie.wade@example.com');
                }
                done();
            }).lean();
        });
    });
});
