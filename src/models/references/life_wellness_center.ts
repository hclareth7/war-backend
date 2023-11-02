import mongoose from 'mongoose';
import validator from 'validator';

const lifeWellnessCenterSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    director: String,
    beneficiariesCount: Number,
    maleBeneficiariesCount: Number,
    femaleBeneficiariesCount: Number,
    entityType: {
        type: String,
        default: 'public',
        enum: ["public", "private"]
    },
    address: String,
    municipality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Municipality',
    },
    type: String,
    phone: String,
    email: {
        type: String,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address')
            }
        }
    },
    legalized: Boolean
});
const mongoosePaginate = require('mongoose-paginate-v2');
lifeWellnessCenterSchema.plugin(mongoosePaginate)
const LifeWellnessCenter = mongoose.model('LifeWellnessCenter', lifeWellnessCenterSchema);

export default LifeWellnessCenter;
