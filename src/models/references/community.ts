import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    municipality: {
        type: String
    },
});

const Community = mongoose.model('Community', communitySchema);

export default Community;