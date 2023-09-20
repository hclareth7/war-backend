import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
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

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;