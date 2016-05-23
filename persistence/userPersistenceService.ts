import mongoose = require('mongoose');
import q = require('q');
import MongoClient from './mongoClient';
import User from '../data-model-api/user';
import UserModel from './model/userModel';
import UserSchema from './model/userSchema';

export default class UserPersistenceService {
    private userModel: mongoose.Model<UserModel>;

    public constructor(mongoClient: MongoClient) {
        this.userModel = mongoClient.buildModel(
            "users",
            new mongoose.Schema({"user": UserSchema.build()})
        );
    }

    public create(user: User): q.Promise<any> {
        var deferred: q.Deferred<any> = q.defer<any>();
        this.userModel.create({"user": user}, err => {
            if (err) {
                if (err.code == 11000) {
                    // Duplicate key => conflict
                    deferred.resolve({conflict: true})
                } else {
                    deferred.reject(err);
                }
            } else {
                deferred.resolve({});
            }
        })
        return deferred.promise;
    }

    public update(user: User): q.Promise<number> {
        var deferred: q.Deferred<number> = q.defer<number>();
        this.userModel.update({"user.username": user.username}, {"user": user}, (err, nbUpdates) => {
            if (err) {
                deferred.reject(err);
            } else {
                // Note: outdated typescript definition here; quick workaround
                let cast: any = nbUpdates;
                deferred.resolve(cast.n);
            }
        })
        return deferred.promise;
    }

    public delete(username: string): q.Promise<number> {
        var deferred: q.Deferred<number> = q.defer<number>();
        // Note: outdated typescript definition here; quick workaround
        let func: any = (err, result) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(result.result.n);
            }
        };
        this.userModel.remove({"user.username": username}, func);
        return deferred.promise;
    }

    public getByUsername(username: string): q.Promise<User> {
        var deferred: q.Deferred<User> = q.defer<User>();
        this.userModel.findOne({"user.username": username}, (err, res) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res ? res.user : null);
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

    // For testing only
    public reset(users: User[]): q.Promise<void> {
        var deferred: q.Deferred<void> = q.defer<void>();
        var Model = this.userModel;
        var collection = users.map(u => {
            return new Model({"user": u});
        });
        this.userModel.remove({}, err => {
            if (err) {
                deferred.reject(err);
            } else {
                Model.create(collection, err => {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
            }
        });
        return deferred.promise;
    }
}
