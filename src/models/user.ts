import mongoose from 'mongoose';
import validator from 'validator';
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    role: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RolesAndPermissions'
    },
    accessToken: {
        type: String
    }
});

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const User = mongoose.model('User', userSchema);

export default User;