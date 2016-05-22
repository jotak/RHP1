import mongoose = require('mongoose');

export default class PictureSchema {
    public static build(): mongoose.Schema {
        return new mongoose.Schema({
            large: String,
            medium: String,
            thumbnail: String
        });
    }
}
