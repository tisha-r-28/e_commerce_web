const Joi = require("joi");

const errors = {
  labels: true,
};

const validate = (schema) => (req, res, next) => {
  const validSchema = {};
  const object = {};

  // Check if schema includes 'params', 'query', and 'body'
  if (schema.params) {
    validSchema.params = schema.params;
    object.params = req.params;
  }
  if (schema.query) {
    validSchema.query = schema.query;
    object.query = req.query;
  }
  if (schema.body) {
    validSchema.body = schema.body;
    object.body = req.body;
  }

  // Validate the object against the schema
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object, errors);

  if (error) {
    return res.status(400).json({ message: error.details.map((ele) => ele.message).join(", ") });
  }

  // Merge the validated values back into req object
  if (value.params) req.params = value.params;
  if (value.query) req.query = value.query;
  if (value.body) req.body = value.body;

  return next();
};

module.exports = validate;