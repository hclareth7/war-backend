import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});
const mongoosePaginate = require('mongoose-paginate-v2');
departmentSchema.plugin(mongoosePaginate)
const Department = mongoose.model('Department', departmentSchema);

export default Department;