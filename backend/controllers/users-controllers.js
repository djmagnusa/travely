// const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

const HttpError = require('../models/http-error');
const User = require('../models/user');

// const DUMMY_USERS = [
//     {
//         id: 'u1',
//         name: 'Pratush Bhandari',
//         email: 'test@test.com',
//         password: 'testers'
//     }
// ];

const getUsers = async (req, res, next) => {
    // res.json({ users: DUMMY_USERS })
    let users;
    try {
        users = await User.find({}, '-password'); //fetched everything except password
    } catch(err) {
        const error = new HttpError(
            'Fetching users failed. please try again later.',
            500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data', 422)
        );
    }

    const { name, email, password, } = req.body;

    // const hasUser = DUMMY_USERS.find(u => u.email === email);
    // if(hasUser) {
    //     throw new HttpError('Could not create user, email already exsists', 422);
    // }

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error)
    }

    if(existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch(err) {
        const error = new HttpError('Could not create user, please try again',
        500
      );
      return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    });

    //DUMMY_USERS.push(createdUser);

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true })});
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    // const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    // if(!identifiedUser || identifiedUser.password !== password) {
    //     throw new HttpError('Could not identify user, creadentials seem to be wrong', 401);
    // }

    let existingUser; 

    try {
        existingUser = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError(
            'Invalid creadetials, could not log you in',
            401
        );

        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch  (err) {
        const error = new HttpError('Could not log youo in, please check your credentials and try again.',
        500
      );
      return next(error);    
    };

    if(!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    res.json({message: 'Logged in', user: existingUser.toObject({getters: true})});
};


exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;