import mongoose = require('mongoose');
import User from '../../data-model-api/user';

interface UserModel extends mongoose.Document {
    user: User
} export default UserModel
