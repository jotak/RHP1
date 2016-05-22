import mongoose = require('mongoose');
import q = require('q');
import MongoClient from './mongoClient';
import User from '../data-model-api/user';
import UserModel from './model/userModel';
import UserSchema from './model/userSchema';

export default class UserPersistenceService {
    private userModel: mongoose.Model<UserModel>;

    public constructor(mongoClient: MongoClient) {
        this.userModel = mongoClient.buildModel("users", UserSchema.build());
    }

    public create(user: User) {
        // TODO
    }

    public update(user: User) {
        // TODO
    }

    public delete(username: string) {
        // TODO
    }

    public getByUsername(username: string): q.Promise<User> {
        var deferred: q.Deferred<User> = q.defer<User>();
        this.userModel.findOne({"user.username": username}, (err, res) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res.user);
            }
        }).lean();
        return deferred.promise;
    }

    public search(filters: any): q.Promise<User[]> {
        var deferred: q.Deferred<User[]> = q.defer<User[]>();
        this.userModel.find(filters, (err, res) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res.map(m => m.user));
            }
        }).lean();
        return deferred.promise;
    }

    public all(): q.Promise<User[]> {
        return this.search({});
    }

    public count(): q.Promise<number> {
        var deferred: q.Deferred<number> = q.defer<number>();
        this.userModel.count({}, (err, count) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(count);
            }
        });
        return deferred.promise;
    }
}
