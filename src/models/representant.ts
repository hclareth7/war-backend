import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

const representantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    identification_type: {
        type: String, 
        required: true
    },
    identification: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    association: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Association',
        require: true
    },
},{
    timestamps:true
})

representantSchema.plugin(mongoosePaginate)
const Representant = mongoose.model('Representant', representantSchema);

export default Representant;
