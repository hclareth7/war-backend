import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');

const deliverySchema = new mongoose.Schema({
    beneficiary: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Beneficiary'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Event'   
    },
    itemsList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps:true
})

deliverySchema.plugin(mongoosePaginate)
const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
