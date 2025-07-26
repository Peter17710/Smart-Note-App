import appError from '../utils/appError.js';

export const handleAsyncError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => {
            if (err instanceof appError || err.name === "appError") {
                next(err);
            } else {
                next(new appError(err.message || err, 422));
            }
        });
    };
}