"use strict";
var mongoose = require('mongoose');
var LocationSchema = (function () {
    function LocationSchema() {
    }
    LocationSchema.build = function () {
        return new mongoose.Schema({
            street: String,
            city: String,
            state: String,
            zip: Number
        });
    };
    return LocationSchema;
}());
exports.__esModule = true;
exports["default"] = LocationSchema;
