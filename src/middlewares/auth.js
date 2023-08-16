const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.generateAuthToken = async (req, res, next) => {
    // Generate an auth token for the user
    const token = jwt.sign({ _id: User._id }, process.env.JWT_KEY);
    User.token = token;
    //User.tokens = User.tokens.concat({ token });
    await User.save();
    return token;

};

exports.checkAuthToken = async (req, res, next) => {
    try {
        if (req.headers["x-access-token"]) {
            const accessToken = req.headers["x-access-token"];
            const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_KEY);
            // Check if token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
            }
            res.locals.loggedInUser = await User.findById(userId);

            next();
        } else {
            console.log("[x-access-token] header not provided")
            next();
        }
    } catch (error) {
        console.log(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        console.log(req.body)
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



