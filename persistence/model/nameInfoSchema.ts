import mongoose = require('mongoose');

export default class NameInfoSchema {
    public static build(): mongoose.Schema {
        return new mongoose.Schema({
            title: String,
            first: String,
            last: String
        });
    }
}
