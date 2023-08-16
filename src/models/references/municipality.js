const mongoose = require('mongoose');

const municipalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

const Municipality = mongoose.model('Municipality', municipalitySchema);

module.exports = Municipality;