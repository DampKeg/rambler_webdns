var _dns = require('dns');

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var rambler =  rambler || {};

var dns = {
    whitelists: {
        SRV: {
            services: ['xmpp-client', 'xmpp-server', 'minecraft'],
            protocols: ['tcp', 'udp']
        },
        names: null
    },
    errorCodes: {
        SERVICE_NOT_ALLOWED: 0,
        PROTOCOL_NOT_ALLOWED: 1,
        NAME_NOT_ALLOWED: 2,
        BIG_ERROR: 9001
    },

    resolveMX: function(name, callback) {
        if (dns.whitelists.names && dns.whitelists.names.filter(function(value, index, array) {
            return '.' + name.toLowerCase().endsWith(value.toLowerCase());
        }).length == 0) {
            var err = new Error("MX requests for that name are not allowed: " + name, dns.errorCodes.NAME_NOT_ALLOWED);
            return callback(err, null);
        }

        _dns.resolveMx(name, function(err, addresses) {
            if(err) {
                if (err.code == _dns.NOTFOUND) {
                    return callback(null, []);
                }

                err = new Error("It's over 9000! There's no way that could be right!", dns.errorCodes.BIG_ERROR);
                return callback(err, null);
            } else {
                return callback(null, addresses);
            }
        });
    },

    resolveSRV: function(service, protocol, name, callback) {
        var err = null;

        if (dns.whitelists.SRV.services && dns.whitelists.SRV.services.filter(function(value, index, array) {
            return service.toLowerCase() == value.toLowerCase();
        }).length == 0) {
            err = new Error("SRV requests for that service are not allowed: " + service, dns.errorCodes.SERVICE_NOT_ALLOWED);
            return callback(err, null);
        }

        if (dns.whitelists.SRV.protocols && dns.whitelists.SRV.protocols.filter(function(value, index, array) {
            return protocol.toLowerCase() == value.toLowerCase();
        }).length == 0) {
            err = new Error("SRV requests for that protocol are not allowed: " + protocol, dns.errorCodes.PROTOCOL_NOT_ALLOWED);
            return callback(err, null);
        }

        if (dns.whitelists.names && dns.whitelists.names.filter(function(value, index, array) {
            return ('.' + name.toLowerCase()).endsWith(value.toLowerCase());
        }).length == 0) {
            err = new Error("SRV requests for that name are not allowed: " + name, dns.errorCodes.NAME_NOT_ALLOWED);
            return callback(err, null);
        }

        var requestString = ["_" + service, "_" + protocol, name].join(".");

        _dns.resolveSrv(requestString, function(err, addresses) {
            if(err) {
                if (err.code == _dns.NOTFOUND) {
                    return callback(null, []);
                }

                err = new Error("It's over 9000! There's no way that could be right!", dns.errorCodes.BIG_ERROR);
                return callback(err, null);
            } else {
                return callback(null, addresses);
            }
        });
    },

    resolveTXT: function(name, callback) {
        if (dns.whitelists.names && dns.whitelists.names.filter(function(value, index, array) {
            return '.' + name.toLowerCase().endsWith(value.toLowerCase());
        }).length == 0) {
            var err = new Error("TXT requests for that name are not allowed: " + name, dns.errorCodes.NAME_NOT_ALLOWED);
            return callback(err, null);
        }

        _dns.resolveTxt(name, function(err, addresses) {
            if(err) {
                if (err.code == _dns.NOTFOUND) {
                    return callback(null, []);
                }

                err = new Error("It's over 9000! There's no way that could be right!", dns.errorCodes.BIG_ERROR);
                return callback(err, null);
            } else {
                return callback(null, addresses);
            }
        });
    }
};

rambler.dns = dns;
module.exports = rambler;