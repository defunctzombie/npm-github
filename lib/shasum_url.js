var crypto = require('crypto');
var request = require('request');
var debug = require('debug')('registry:shasum');

// TODO database cache for restart persistence
var cache = Object.create(null);

function shasum_url(url, opt, cb) {
    debug('shasum %s', url);
    var shasum = crypto.createHash('sha1');

    if (cache[url]) {
        return setImmediate(cb, null, cache[url]);
    }

    var options = {
        url: url,
        headers: {
            'User-Agent': 'npm-github-proxy'
        }
    };

    if (opt.token) {
        options.headers['Authorization'] = 'token ' + opt.token
    }

    request(options)
    .on('data', function(chunk) {
        shasum.update(chunk);
    })
    .on('error', cb)
    .on('end', function() {
        var hash = cache[url] = shasum.digest('hex');
        cb(null, hash);
    });
}

module.exports = shasum_url;
