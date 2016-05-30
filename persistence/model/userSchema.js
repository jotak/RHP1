"use strict";
var mongoose = require('mongoose');
var nameInfoSchema_1 = require('./nameInfoSchema');
var locationSchema_1 = require('./locationSchema');
var pictureSchema_1 = require('./pictureSchema');
"use strict";
// Unfortunately it looks like this kind of duplication is necessary for mongoose; cannot use the typescript interfaces definition at runtime.
// Maybe if this persistence layer was used in an extensive way, we should build some automatic Schema code generator from the typescript interface.
var UserSchema = (function () {
    function UserSchema() {
    }
    UserSchema.build = function () {
        var nameInfoSchema = nameInfoSchema_1["default"].build();
        var locationSchema = locationSchema_1["default"].build();
        var pictureSchema = pictureSchema_1["default"].build();
        return new mongoose.Schema({
            gender: String,
            name: nameInfoSchema,
            location: locationSchema,
            email: String,
            username: String,
            password: String,
            salt: String,
            md5: String,
            sha1: String,
            sha256: String,
            registered: Number,
            dob: Number,
            phone: String,
            cell: String,
            PPS: String,
            picture: pictureSchema
        });
    };
    return UserSchema;
}());
exports.__esModule = true;
exports["default"] = UserSchema;
