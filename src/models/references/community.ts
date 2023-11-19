import mongoose from 'mongoose';
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");


const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    municipality: {
        type: String
    },
    municipality_id: {
        type: String 
    },
});
communitySchema.plugin(mongoosePaginate)
communitySchema.plugin(aggregatePaginate)
const Community = mongoose.model('Community', communitySchema);

export default Community;