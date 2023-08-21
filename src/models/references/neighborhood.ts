import mongoose from 'mongoose';

const neighborhoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

export default Neighborhood;