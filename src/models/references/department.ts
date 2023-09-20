import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;