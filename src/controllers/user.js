const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { roles } = require('../config/roles');


exports.save = async (req, res, next) => {
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
exports.getAll = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        data: users
    });
}

exports.get = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return next(new Error('User does not exist'));
        }
        res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
}

exports.update = async (req, res, next) => {
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
}

exports.delete = async (req, res, next) => {
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
}

exports.generateAuthToken = async (req, res, next) => {
    // Generate an auth token for the user
    const token = jwt.sign({ _id: User._id }, process.env.JWT_KEY);
    User.token = token;
    //User.tokens = User.tokens.concat({ token });
    await User.save();
    return token;

};

exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(new Error('Email does not exist'));
        }
        const validPassword = await validatePassword(password, user.password);

        if (!validPassword) {
            return next(new Error('Password is not correct'));
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
        await User.findByIdAndUpdate(user._id, { accessToken });

        res.status(200).json({
            user: { email: user.email, role: user.role, token: accessToken }
        });
    } catch (error) {
        console.log(error)
        next(error);
    };
};

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            console.log(action);
            //console.log(roles.can(req.user.role)['readOwn']())
            const permission = roles.can(req.user.role);
            console.log(permission[action]())
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}


