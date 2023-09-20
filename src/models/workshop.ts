import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    execution_date: {
        type: Date,
        required: true,
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
    }],
}, { timestamps: true });

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;