import mongoose from 'mongoose';

const municipalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});
const mongoosePaginate = require('mongoose-paginate-v2');
municipalitySchema.plugin(mongoosePaginate)
const Municipality = mongoose.model('Municipality', municipalitySchema);

export default Municipality;