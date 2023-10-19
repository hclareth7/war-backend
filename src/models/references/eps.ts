import mongoose from 'mongoose';

const epsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });
const mongoosePaginate = require('mongoose-paginate-v2');
epsSchema.plugin(mongoosePaginate)
const Eps = mongoose.model('Eps', epsSchema);

export default Eps;   