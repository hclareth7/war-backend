import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const municipalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
});
municipalitySchema.plugin(mongoosePaginate);
municipalitySchema.plugin(aggregatePaginate);

const Municipality = mongoose.model('Municipality', municipalitySchema);

export default Municipality;