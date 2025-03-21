const transport = require("../middlewares/sendVerification");
const { signupValidator, signinValidator } = require("../middlewares/validator");
const User = require('../models/userModel');
const { doHash, doHashValidatoin, hmacprocess } = require("../utils/hashing");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signupValidator.validate({ email, password });

        if (error) {
            return res.status(401).json({ success: false, message: error.details[0].message });
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(401).json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword
        })

        const result = await newUser.save();
        result.password = undefined;
        res.status(201).json({
            success: true,
            message: "Your account has been created successfully.",
            result
        })
    } catch (error) {
        console.log(error);
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinValidator.validate({ email, password });
        if (error) {
            return res
                .status(401)
                .json({ success: false, message: error.details[0].message })
        }
        const existingUser = await User.findOne({ email }).select('password');
        if (!existingUser) {
            return res
                .status(401)
                .json({ success: false, message: 'User does not exists' });
        }
        const result = await doHashValidatoin(password, existingUser.password);
        if (!result) {
            return res
                .status(401)
                .json({ success: false, message: 'Invalid credential' });
        }
        const token = jwt.sign({
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified
            }, process.env.TOKEN_SECRET,{
                expiresIn: '4h'
            }
        );
        res.cookie('Authorization','Bearer' + token,{expires: new Date(Date.now()+4*3600000),
            httpOnly: proccess.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            success: true,
            token,
            message: 'Logged in sucessfully'
        })
    } catch (error) {
        console.log(error);
    }
}

exports.signout = async (req, res) => {
    res
        .clearCookie('Authoriztion')
        .status(200)
        .json({success: true, message: 'Logout Successfully'})
}

exports.sendVerificationCode = async (req, res) => {
    const {email} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res
            .status(401)
            .json({ success: false, message: 'User does not exists' });
        }
        if(!existingUser.verified) {
            return res
            .status(401)
            .json({ success: false, message: 'User already verified' });
        }
        const codeValue = Math.floor(Math.random()*1000000).toString();
        let info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: 'Verification Code',
            html: '<h1>'+codeValue+'</h1>'
        })
        if(info.accepted[0] === existingUser.email) {
            const hashedCodeValue = hmacprocess(codeValue, process.env.MAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save()
            return res.status(200).json({success: true, message:'Code sent!'});
        }
        res.status(400).json({success: false, message: 'Code sent failed'});
    } catch (error){
        console.log(error)
    }
}