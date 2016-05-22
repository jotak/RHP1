import mongoose = require('mongoose');
import q = require('q');

export default class MongoClient {
    private dbHandle: mongoose.Mongoose;
    private onReady: q.Promise<void>;

    constructor(host: String, port: Number, db: String) {
        this.dbHandle = mongoose.connect('mongodb://' + host + ':' + port + '/' + db);
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
        var deferred: q.Deferred<void> = q.defer<void>();
        this.onReady = deferred.promise;
        mongoose.connection.once('open', () => deferred.resolve());
    }

    public status(): q.Promise<number> {
        return this.onReady.then(() => {
            return mongoose.connection.readyState;
        });
    }

    public statusNow(): number {
        return mongoose.connection.readyState;
    }
}
