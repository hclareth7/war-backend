import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import permissionHelper from '../helpers/permissions';

/*
export const generateAuthToken = async (req, res, next) => {
    // Generate an auth token for the user
    const token = jwt.sign({ _id: User._id }, process.env.JWT_KEY);
    User.token = token;
    //User.tokens = User.tokens.concat({ token });
    await User.save();
    return token;

};
*/

export const checkAuthToken = async (req, res, next) => {
    try {
        if (req.headers["x-access-token"]) {
            const accessToken = req.headers["x-access-token"];
            const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_KEY);
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
            }
            res.locals.loggedInUser = await User.findById(userId);

            res.locals.loggedInUser.abilities = await permissionHelper(res.locals.loggedInUser.role);
            
            next();
        } else {
            console.log("[x-access-token] header not provided")
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res, next) => {
    // #swagger.tags = ['Auth']
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            return next(new Error('Email does not exist'));
        }
        const validPassword = await validatePassword(password, user.password);

        if (!validPassword) {
            return next(new Error('Password is not correct'));
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
        await User.findByIdAndUpdate(user._id, { accessToken });
        res.locals.loggedInUser = user;
        res.locals.loggedInUser.abilities = await permissionHelper(user.role);
        console.log(user.role)

        res.status(200).json({
            user: { name: user.name, user_name: user.user_name, role: user.role, token: accessToken, abilities: res.locals.loggedInUser.abilities.A },
        });
    } catch (error) {
        console.log(error);
        next(error);
    };
};

export const allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route and needs abilities"
            });
        req.user = user;

        next();

    } catch (error) {
        next(error);
    }
}

export const grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            
            //console.log(roles.can(req.user.role)['readOwn']())
            const permission = res.locals.loggedInUser.abilities.can(action, resource);
            if (!permission) {
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

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}



