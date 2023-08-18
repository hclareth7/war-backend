// rolesAndPermissionsController.js
const RolesAndPermissions = require('../models/permissions');

exports.save = async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const newRoleAndPermissions = new RolesAndPermissions({ role, permissions });
    await newRoleAndPermissions.save();
    res.json({ message: 'Role and permissions created successfully.' });
} catch (error) {
    console.log(error)
    next(error)
}
};

exports.getAll = async (req, res, next) => {
    const roles = await RolesAndPermissions.find({});
    res.status(200).json({
        data: roles
    });
};

exports.get = async (req, res, next) => {
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

exports.update = async (req, res, next) => {
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

exports.delete = async (req, res, next) => {
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