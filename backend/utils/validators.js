const { body, query } = require('express-validator');
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const registerRules = [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').matches(/^01\d{9}$/).withMessage('Use a valid Bangladesh mobile number'),
  body('gender').isIn(['male', 'female', 'other']),
  body('password').isLength({ min: 6, max: 72 }),
  body('isDonor').optional().isBoolean(),
  body('bloodGroup').optional({ values: 'falsy' }).isIn(bloodGroups),
  body('age').optional({ values: 'falsy' }).isInt({ min: 18, max: 65 }),
  body('weight').optional({ values: 'falsy' }).isFloat({ min: 40, max: 250 })
];
const loginRules = [body('email').isEmail().normalizeEmail(), body('password').notEmpty()];
const requestRules = [
  body('patientName').trim().isLength({ min: 2, max: 100 }),
  body('bloodGroup').isIn(bloodGroups),
  body('units').isInt({ min: 1, max: 20 }),
  body('hospital').trim().isLength({ min: 2, max: 150 }),
  body('location').trim().isLength({ min: 2, max: 150 }),
  body('neededAt').isISO8601(),
  body('urgency').isIn(['normal', 'urgent', 'critical']),
  body('contactPhone').matches(/^01\d{9}$/)
];
const donorQueryRules = [
  query('bloodGroup').optional({ values: 'falsy' }).isIn(bloodGroups),
  query('available').optional().isIn(['true', 'false']),
  query('lat').optional().isFloat({ min: -90, max: 90 }),
  query('lon').optional().isFloat({ min: -180, max: 180 }),
  query('maxDistance').optional().isFloat({ min: 0, max: 1000 })
];
module.exports = { bloodGroups, registerRules, loginRules, requestRules, donorQueryRules };
