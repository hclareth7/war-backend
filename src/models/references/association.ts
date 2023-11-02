import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

const associationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['CENTRO VIDA', 'Centro de bienestar', 'Municipio y Asociación', "VIDA/DÍA", "CENTRO DÍA"],
        required: true
    },
    address: String,
    coordinator_name: String,
    phones: {
        type: String
    },
    contanct_user_name: {
        type: String
    },
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
associationSchema.plugin(mongoosePaginate)
const Association = mongoose.model('Association', associationSchema);

export default Association;