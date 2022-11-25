const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;
