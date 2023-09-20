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
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    municipality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality',
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    participatingAssociations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Association',
    }],
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
    }],
}, {timestamps: true});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;