import User from '../models/user';
import bcrypt from 'bcrypt';
import * as service from '../services/s3Upload'
const { paginateModel} = require( '../middlewares/pagination')

export const save = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const { name, email, password, role } = req.body
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, email, password: hashedPassword, role: role || "supervisor" });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.log(error)
        next(error)
    }
};
export const getAll = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/

   const page = req.query.page
   const perPage  = req.query.perPage
   const user = await paginateModel(User, "role", page, perPage)
    res.status(200).json({
        data: user.docs,
        currentPage: user.page,
        itemsPerPage: user.limit,
        totalItems: user.total,
        totalPages: user.pages,
    });
};

export const get = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        const user = await User.findById(id).populate('role');
        if (!user) {
            return next(new Error('User does not exist'));
        }
        res.status(200).json({
            data: user
        });
    } catch (error) {
        console.log(error)
    }
};

export const update = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const update = req.body
        const id = req.params.id;
        await User.findByIdAndUpdate(id, update);
        const user = await User.findById(id)
        res.status(200).json({
            data: user,
            message: 'User has been updated'
        });
    } catch (error) {
        next(error)
    }
};

export const deleteItem = async (req, res, next) => {
    // #swagger.tags = ['Users']
    /*    
    #swagger.security = [{
               "apiKeyAuth": []
    }]*/
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
            message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
};

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}