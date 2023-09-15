// authorizationMiddleware.js
import { AbilityBuilder, SubjectType, createMongoAbility } from '@casl/ability';
import RolesAndPermissions from '../models/permissions';


async function permissionHelper(role) {
  //const user = req.user; // Obtén el usuario de la sesión o del token

  // Obtén roles y permisos del usuario desde la base de datos
  const rolesAndPermissions = await RolesAndPermissions.findOne({ _id: role });
  // Crea la Ability basada en roles y permisos
  const { can, build } = new AbilityBuilder(createMongoAbility);
  rolesAndPermissions?.permissions.forEach((permission) => {
    can(permission?.actions, permission?.section as SubjectType); // Define los permisos que aplican para dicho rol
  });

  return build(); // Agrega la Ability al objeto de solicitud

}
 
export default permissionHelper;
