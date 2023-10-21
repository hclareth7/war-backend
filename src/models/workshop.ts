import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    execution_date: {
        type: Date,
        required: true,
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
const mongoosePaginate = require('mongoose-paginate-v2');
workshopSchema.plugin(mongoosePaginate)
const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;