import mongoose from 'mongoose';

const associationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: String,
    representative: String,
    coordinator: String,
    phones: [String],
    neighborhood: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Neighborhood',
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    membersCount: Number
});

const Association = mongoose.model('Association', associationSchema);

export default Association;