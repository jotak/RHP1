import mongoose = require('mongoose');
import q = require('q');

export default class MongoClient {
    private connection: mongoose.Connection;
    private onReady: q.Promise<void>;

    constructor(host: String, port: Number, db: String) {
        this.connection = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + db);
        this.connection.on('error', console.error.bind(console, 'connection error:'));
        var deferred: q.Deferred<void> = q.defer<void>();
        this.onReady = deferred.promise;
        this.connection.once('open', () => deferred.resolve());
    }

    public status(): q.Promise<number> {
        var self = this;
        return this.onReady.then(() => {
            return self.connection.readyState;
        });
    }

    public statusNow(): number {
        return this.connection.readyState;
    }

    public buildModel(collection: string, schema: mongoose.Schema): mongoose.Model<any> {
        return this.connection.model<any>(collection, schema);
    }
}
