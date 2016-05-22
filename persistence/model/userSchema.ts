import mongoose = require('mongoose');
import NameInfoSchema from './nameInfoSchema';
import LocationSchema from './locationSchema';
import PictureSchema from './pictureSchema';
import UserModel from './userModel';

"use strict";

// Unfortunately it looks like this kind of duplication is necessary for mongoose; cannot use the typescript interfaces definition at runtime.
// Maybe if this persistence layer was used in an extensive way, we should build some automatic Schema code generator from the typescript interface.
export default class UserSchema {
    public static build(): mongoose.Schema {
        var nameInfoSchema = NameInfoSchema.build();
        var locationSchema = LocationSchema.build();
        var pictureSchema = PictureSchema.build();
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
    }
}
