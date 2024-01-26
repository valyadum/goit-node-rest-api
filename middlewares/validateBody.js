import  HttpError  from "../helpers/HttpError.js";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    
    const fieldsQty = Object.keys(req.body).length;
    if (!fieldsQty) {
      next(HttpError(400, "Body must have at least one field"));
    }
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateBody;
