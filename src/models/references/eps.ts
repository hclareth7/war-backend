import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const epsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });
epsSchema.plugin(mongoosePaginate);
epsSchema.plugin(aggregatePaginate);

const Eps = mongoose.model('Eps', epsSchema);

export default Eps;   