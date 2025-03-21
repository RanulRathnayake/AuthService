const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true,'Email is required!'],
        trim: true,
        unique: [true, 'Email must be unique!'],
        minilength: [5, 'Email must have 5 characters!'],
        lowercase: true
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        trim: true,
        Select: false,
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCodeValidation:{
        type: Number,
        Select: false
    },
    forgotPasswordCode:{
        type: String,
        Select: false
    },
    forgotPasswordCodeValidation:{
        type: Number,
        Select: false
    }
},{
    timstamps: true
});

module.exports = mongoose.model("User", userSchema);
