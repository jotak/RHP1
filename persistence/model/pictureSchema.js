"use strict";
var mongoose = require('mongoose');
var PictureSchema = (function () {
    function PictureSchema() {
    }
    PictureSchema.build = function () {
        return new mongoose.Schema({
            large: String,
            medium: String,
            thumbnail: String
        });
    };
    return PictureSchema;
}());
exports.__esModule = true;
exports["default"] = PictureSchema;
