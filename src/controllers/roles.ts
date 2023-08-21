// rolesAndPermissionsController.js
import RolesAndPermissions from '../models/permissions';

export const save = async (req, res, next) => {

    // #swagger.tags = ['Roles']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
  try {
    const { role, permissions } = req.body;
    const newRoleAndPermissions = new RolesAndPermissions({ role, permissions });
    await newRoleAndPermissions.save();
    res.json({ message: 'Role and permissions created successfully.' });
} catch (error) {
    console.log(error);
    next(error)
}
};

export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Roles']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    const roles = await RolesAndPermissions.find({});
    res.status(200).json({
        data: roles
    });
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Roles']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        const role = await RolesAndPermissions.findById(id);
        if (!role) {
            return next(new Error('Role does not exist'));
        }
        res.status(200).json({
            data: role
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Roles']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const update = req.body
        const id = req.params.id;
        await RolesAndPermissions.findByIdAndUpdate(id, update);
        const role = await RolesAndPermissions.findById(id)
        res.status(200).json({
            data: role,
            message: 'Role has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Roles']
    /*    
    #swagger.security = [{
        "apiKeyAuth": []
    }]
     */
    try {
        const id = req.params.id;
        await RolesAndPermissions.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
            message: 'Role has been deleted'
        });
    } catch (error) {
        next(error)
    }
};