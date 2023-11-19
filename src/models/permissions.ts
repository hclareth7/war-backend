import mongoose from 'mongoose';

const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const rolesAndPermissionsSchema = new mongoose.Schema({
  role: String,
  permissions: [{
    section: String,
    actions: [String]
  }],
});
rolesAndPermissionsSchema.plugin(mongoosePaginate);
rolesAndPermissionsSchema.plugin(aggregatePaginate);
const RolesAndPermissions = mongoose.model('RolesAndPermissions', rolesAndPermissionsSchema);

export default RolesAndPermissions;