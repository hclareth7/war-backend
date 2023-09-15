import mongoose from 'mongoose';
import validator from 'validator';
const mongoosePaginate = require('mongoose-paginate-v2');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address')
            }
        }
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

userSchema.plugin(mongoosePaginate)
const User = mongoose.model('User', userSchema);

export default User;