const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // collect ALL errors, not just the first one
    stripUnknown: true, // silently drop fields not in the schema
  });

  if (error) {
    return res.status(400).json({
      success: false,
      errors: error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      })),
    });
  }

  req.body = value; // use the sanitized/normalized value (e.g. lowercased email)
  next();
};

export default validate;