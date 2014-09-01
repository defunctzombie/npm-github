module.exports = function(req, res, next) {
    req.curry = function(fn) {
        return function(err, arg1) {
            if (err) {
                return next(err);
            }

            fn.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    };

    next();
};
