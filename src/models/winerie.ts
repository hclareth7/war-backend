import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');


const winerieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Principal', 'Secundaria'],
        required: true,
    },
    associated_winery: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Winerie'
    },
},{
    timestamps:true
});

winerieSchema.plugin(mongoosePaginate)
const Winerie = mongoose.model('Winerie', winerieSchema);

export default Winerie;