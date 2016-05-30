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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NameInfoSchema;
