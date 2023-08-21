import mongoose from 'mongoose';

const rolesAndPermissionsSchema = new mongoose.Schema({
  role: String,
  permissions: [{
    section: String,
    actions: [String]
  }],
});

const RolesAndPermissions = mongoose.model('RolesAndPermissions', rolesAndPermissionsSchema);

export default RolesAndPermissions;