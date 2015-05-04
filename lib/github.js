var request = require('request');

var GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
var GITHUB_URL = process.env.GITHUB_URL || 'https://www.github.com';

module.exports.tags = function tags(user, repo, opt, cb) {
    var options = {
        url: GITHUB_API_URL + '/repos/' + user + '/' + repo + '/tags',
        json: true,
        headers: {
            'User-Agent': 'npm-github-proxy',
            'Accepts': 'application/json'
        }
    };

    if (opt.token) {
        options.headers['Authorization'] = 'token ' + opt.token
    }

    request(options, function(err, res, body) {
        if (err) {
            return cb(err);
        }

        if (res.statusCode !== 200) {
            return cb(new Error('unable to get tags for repo ' + user + '/' + repo));
        }

        cb(null, body);
    });
};

module.exports.file = function tags(user, repo, tag, file, opt, cb) {
    var options = {
        url: GITHUB_URL + '/raw/' + user + '/' + repo + '/' + tag + '/' + file,
        json: true,
        headers: {
            'User-Agent': 'npm-github-proxy',
            'Accepts': 'application/json'
        }
    };

    if (opt.token) {
        options.headers['Authorization'] = 'token ' + opt.token
    }

    request(options, function(err, res, body) {
        if (err) {
            return cb(err);
        }

        if (res.statusCode !== 200) {
            return cb(new Error('unable to get file for repo ' + user + '/' + repo));
        }

        cb(null, body);
    });
};
