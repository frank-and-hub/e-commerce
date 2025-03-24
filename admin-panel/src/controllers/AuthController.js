const mongoose = require('mongoose');

const User = require('../models/user');
const Token = require('../models/token');
const SocialDetail = require('../models/social_detail');

const AuthServices = require('../services/AuthServices');

const helper = require('../utils/helper');
const url = require('../config/url');

const RoleController = require('./RoleController');
const baseurl = `${url.apiUrl}`;
const unauthorized = `${process.env.UNAUTHORIZED}`;
const error_code = `${process.env.ERROR_CODES}`;
const status_active = `${process.env.STATUS_ACTIVE}`;

exports.getSignIn = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Sign in form`,
            body: {
                'email': 'String',
                'password': 'String',
            }
        });
    } catch (err) { next(err)  }
}

exports.signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // get login user ip address
        let ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        if (ip.includes("::ffff:")) {
            ip = ip.split("::ffff:")[1];
        }
        // fetch user data
        const userData = await User.findOne({ email: email, status: status_active })
            .select('_id name email phone password password_text role image gender address about city state zipcode terms status updated_by')
            .populate('role', '_id name')
            .populate('updated_by', '_id name.first_name name.middle_name name.last_name')
            .populate('image', '_id name path');
        // check user data
        if (!userData) return res.status(401).json({ message: `User not found!` });
        // check password validation
        const isPasswordValid = await AuthServices.comparePasswords(password, userData.password);
        // check password
        const checkPasswordMatch = (password === userData.password_text);
        //
        if (!isPasswordValid && !checkPasswordMatch) return res.status(401).json({ message: unauthorized });
        // generate token
        const token = await AuthServices.generateToken(userData);
        // generate a new token 
        const newToken = await Token({
            _id: new mongoose.Types.ObjectId(),
            user: userData?._id,
            token: token,
            loginTime: new Date().toISOString(),
            ip_address: ip,
        });
        // store new token
        const tokenResult = await newToken.save();

        const social_details = await SocialDetail.find({ 'user': userData?._id })
            .select('_id name url icon')
            .sort({ _id: -1 });

        const userWithDetails = {
            ...userData.toObject(),
            social_details,
        };

        // update token into user schema
        const result = await User.updateOne({ _id: userData._id }, { $push: { token: tokenResult?._id } });
        // conferm modification
        if (result.modifiedCount === 0 || !token) return res.status(401).json({ message: unauthorized });
        // result
        return res.status(200).json({ message: `User sign-in 👍`, user: userWithDetails, token: token });
    } catch (err) { next(err)  }
}

exports.getSignUp = (req, res, next) => {
    try {
        res.status(200).json({
            message: `Sign up form`,
            body: {
                'name': 'String',
                'phone': 'Number',
                'email': 'String',
                'password': 'String'
            }
        });
    } catch (err) { next(err)  }
}

exports.signUp = async (req, res, next) => {
    const { name, phone, email, password, terms } = req.body;
    try {
        const existsUser = await User.findOne({ email: email });
        if (existsUser) return res.status(409).json({ message: `User already exists` });

        const roleResponse = await RoleController.getGuestRole('guest-user');
        const guestRoleId = roleResponse?.roleId ?? roleResponse;

        const hashPassword = await AuthServices.hashPassword(password);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name,
            phone,
            email,
            password: hashPassword,
            password_text: password,
            terms,
            role: guestRoleId
        });
        await user.save();

        res.status(201).json({ message: `Successfully sign up 👍`, request: { method: 'GET', url: `${baseurl}/sign-in/` } });
    } catch (err) { next(err)  }
}

exports.signOut = async (req, res, next) => {
    let userId = req?.userData?.id;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'JWT must be provided' });

        const token = authHeader.split(' ')[1];

        const tokenData = await Token.findOne({ user: userId, token: token }).select('_id user token');
        if (!tokenData) return res.status(401).json({ message: 'Invalid token' });

        const deletedToken = await Token.deleteOne({ _id: tokenData?._id });

        if (deletedToken.deletedCount === 0) return res.status(400).json({ message: 'Failed to delete token' });

        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(401).json({ message: 'Unauthorized User' });

        await User.updateOne({ _id: user._id }, { $pull: { token: tokenData?._id } });
        res.status(200).json({ message: 'Successfully logged out 👍', status: 200 });
    } catch (err) {
        next(err);
    }
}
