"use strict";
var mongoose = require('mongoose');
var NameInfoSchema = (function () {
    function NameInfoSchema() {
    }
    NameInfoSchema.build = function () {
        return new mongoose.Schema({
            title: String,
            first: String,
            last: String
        });
    };
    return NameInfoSchema;
}());
exports.__esModule = true;
exports["default"] = NameInfoSchema;
