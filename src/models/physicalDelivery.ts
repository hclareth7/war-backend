import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const physicalDeliverySchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Event'   
    },
    itemsList: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps:true
})

physicalDeliverySchema.plugin(mongoosePaginate);
physicalDeliverySchema.plugin(aggregatePaginate);

const PhysicalDelivery = mongoose.model('PhysicalDelivery', physicalDeliverySchema);

export default PhysicalDelivery;
