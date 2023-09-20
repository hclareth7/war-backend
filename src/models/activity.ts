import mongoose from 'mongoose';

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

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;