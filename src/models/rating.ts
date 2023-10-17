import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    rating_type: {
        type: String,
        enum: ['Fisioterapia', 'otros'],
        required: true
    },
    observations: {
        type: String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beneficiary',
    },
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;