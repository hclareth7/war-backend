import mongoose from 'mongoose';

const neighborhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});
const mongoosePaginate = require('mongoose-paginate-v2');
neighborhoodSchema.plugin(mongoosePaginate)
const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

export default Neighborhood;