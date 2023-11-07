import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');


const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    value: {
        type: String
    },
    isDefault: {
        type: Boolean
    }
},{
    timestamps:true
});

itemSchema.plugin(mongoosePaginate)
const Item = mongoose.model('Item', itemSchema);

export default Item;