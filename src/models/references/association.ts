import mongoose from 'mongoose';

const associationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Centro de vida', 'Centro de bienestar', 'Municipio y Asociación'],
        required: true
    },
    address: String,
    coordinator_name: String,
    phones: [String],
    department: {
        type: String
    },
    municipality: {
        type: String
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    membersCount: Number
});

const Association = mongoose.model('Association', associationSchema);

export default Association;