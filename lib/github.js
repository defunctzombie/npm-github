var request = require('request');

module.exports.tags = function tags(user, repo, opt, cb) {
    var options = {
        url: 'https://api.github.com/repos/' + user + '/' + repo + '/tags',
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
