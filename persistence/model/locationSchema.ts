import mongoose = require('mongoose');

export default class LocationSchema {
    public static build(): mongoose.Schema {
        return new mongoose.Schema({
            street: String,
            city: String,
            state: String,
            zip: Number
        });
    }
}
