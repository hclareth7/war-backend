import mongoose from 'mongoose';

const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const workshopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    execution_date: {
        type: Date,
        default: Date.now,
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
    }],
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

workshopSchema.plugin(mongoosePaginate);
workshopSchema.plugin(aggregatePaginate);

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;