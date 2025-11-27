import * as Joi from 'joi';

export default Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  INVITATION_EXPIRY_HOURS: Joi.number().integer().positive().default(48),
  APP_URL: Joi.string().uri().required(),
  MOBILE_APP_URL: Joi.string().required(),
  SENDGRID_API_KEY: Joi.string().optional(),
  PORT: Joi.number().integer().positive().default(4000)
});

