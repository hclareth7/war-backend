const mongoose = require('mongoose');

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
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    legalized: Boolean
});

const LifeWellnessCenter = mongoose.model('LifeWellnessCenter', lifeWellnessCenterSchema);

module.exports = LifeWellnessCenter;
