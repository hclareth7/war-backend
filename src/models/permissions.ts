import mongoose from 'mongoose';

const rolesAndPermissionsSchema = new mongoose.Schema({
  role: String,
  permissions: [{
    section: String,
    actions: [String]
  }],
});
const mongoosePaginate = require('mongoose-paginate-v2');
rolesAndPermissionsSchema.plugin(mongoosePaginate)
const RolesAndPermissions = mongoose.model('RolesAndPermissions', rolesAndPermissionsSchema);

export default RolesAndPermissions;