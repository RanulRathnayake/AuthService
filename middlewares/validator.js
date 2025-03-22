const Joi = require('joi');

exports.signupValidator = Joi.object({
    email: Joi
        .string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net'] }
        }),
    password: Joi
        .string()
        .required()
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}'))
})

exports.signinValidator = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net'] }
        }),
    password: Joi.string()
    .required()
    .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}'))
})

exports.verificationCodeValidator = Joi.object({
    email: Joi.string()
        .min(6)
        .max(60)
        .required()
        .email({
            tlds: { allow: ['com', 'net'] }
        }),
        providedCode: Joi.number().required()
})

exports.changePasswordSchema = Joi.object({
    newpassword: Joi.string()
        .required()
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}')),
    oldpassword: Joi.string()
        .required()
        .pattern(new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!#.])[A-Za-z\d$@$!%*?&.]{8,20}'))
})

exports.acceptFPCodeSchema = Joi.object({
	email: Joi.string()
		.min(6)
		.max(60)
		.required()
		.email({
			tlds: { allow: ['com', 'net'] },
		}),
	providedCode: Joi.number().required(),
	newPassword: Joi.string()
		.required()
		.pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$')),
});