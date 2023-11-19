import mongoose from 'mongoose';
import validator from 'validator';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
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

lifeWellnessCenterSchema.plugin(mongoosePaginate);
lifeWellnessCenterSchema.plugin(aggregatePaginate);
const LifeWellnessCenter = mongoose.model('LifeWellnessCenter', lifeWellnessCenterSchema);

export default LifeWellnessCenter;
