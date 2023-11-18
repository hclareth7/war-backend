import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    execution_date: {
        type: Date,
        required: true,
    },
    estimate_attendance:{
        type: Number
    },
    participatingAssociations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Association',
    }],
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
    }],
    associated_winery: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Winerie'
    },
    status:{
        type: String,
        enum: ['enabled', 'disabled'],
        default: 'enabled'
    },
}, {timestamps: true});

eventSchema.plugin(mongoosePaginate)
eventSchema.plugin(aggregatePaginate)
const Event = mongoose.model('Event', eventSchema);

export default Event;