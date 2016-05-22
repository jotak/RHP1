import Gender from './gender';
import NameInfo from './nameInfo';
import Location from './location';
import Picture from './picture';

"use strict";

interface User {
    gender: Gender,
    name: NameInfo,
    location: Location,
    email: string,
    username: string,
    password: string,
    salt: string,
    md5: string,
    sha1: string,
    sha256: string,
    registered: number,
    dob: number,
    phone: string,
    cell: string,
    PPS: string,
    picture: Picture
} export default User
