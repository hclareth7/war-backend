import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const activitySchema = new mongoose.Schema({
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
}, {timestamps: true});

activitySchema.plugin(mongoosePaginate);
activitySchema.plugin(aggregatePaginate);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;