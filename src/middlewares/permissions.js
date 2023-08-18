// authorizationMiddleware.js
const { AbilityBuilder } = require('@casl/ability');
const RolesAndPermissions = require('../models/permissions');

async function permissionMiddleware(req, res, next) {
  const user = req.user; // Obtén el usuario de la sesión o del token

  // Obtén roles y permisos del usuario desde la base de datos
  const rolesAndPermissions = await RolesAndPermissions.findOne({ role: user.role });

  // Crea la Ability basada en roles y permisos
  const { can, build } = new AbilityBuilder();
  rolesAndPermissions.permissions.forEach(permission => {
    can(permission.actions, permission.section); // Define los permisos que aplican para dicho rol
  });

  req.ability = build(); // Agrega la Ability al objeto de solicitud

  next();
}

module.exports = permissionMiddleware;
