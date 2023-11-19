import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});
departmentSchema.plugin(mongoosePaginate);
departmentSchema.plugin(aggregatePaginate)
const Department = mongoose.model('Department', departmentSchema);

export default Department;