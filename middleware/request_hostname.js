var url = require('url');

// return the hostname with protocol for the request
// @param {Request} req is an http server client request
function hostname(req) {
    var host_header = req.headers.host;
    return url.format({
        protocol: req.protocol,
        slashes: true,
        host: host_header,
    });
};

module.exports = function(req, res, next) {
    req.href = hostname(req);
    next();
};
