const mongoose = require('mongoose');
const validator = require('validator')

const epsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
}, { timestamps: true });

const Eps = mongoose.model('Eps', epsSchema);

module.exports = Eps;   