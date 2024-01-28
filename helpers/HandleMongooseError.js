export const HandleMongooseError = (error, data, next) => {
    error.status = 400;
    next();
};
