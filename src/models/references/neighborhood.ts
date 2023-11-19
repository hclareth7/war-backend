import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const neighborhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});

neighborhoodSchema.plugin(mongoosePaginate);
neighborhoodSchema.plugin(aggregatePaginate);

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

export default Neighborhood;