var express = require('express');
var router = express.Router();
var rambler = require('../webdns')

var debug = require('debug')('rambler-webdns:server');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Web DNS' });
});

router.get('/SRV', function(request, response) {
    var service = request.query.service;
    var protocol = request.query.protocol;
    var name = request.query.name;

    if (service && protocol && name) {
        rambler.dns.resolveSRV(service, protocol, name, function(err, addresses) {
            if (err) {
                console.log(err)
                respondWithJSON(response, 500, err.toString());
            } else {
                respondWithJSON(response, 200, addresses);
            }
        });
    } else {
        respondWithJSON(response, 400, null);
    }

});

router.get('/MX', function(request, response) {
    var name = request.query.name;

    if (name) {
        rambler.dns.resolveMX(name, function(err, addresses) {
            if (err) {
                console.log(err)
                respondWithJSON(response, 500, err.toString());
            } else {
                respondWithJSON(response, 200, addresses);
            }
        });
    } else {
        respondWithJSON(response, 400, null);
    }

});

router.get('/TXT', function(request, response) {
    var name = request.query.name;

    if (name) {
        rambler.dns.resolveTXT(name, function(err, addresses) {
            if (err) {
                console.log(err)
                respondWithJSON(response, 500, err.toString());
            } else {
                respondWithJSON(response, 200, addresses);
            }
        });
    } else {
        respondWithJSON(response, 400, null);
    }

});

function respondWithJSON(response, status, data) {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = status;
    response.write(JSON.stringify(data, null, 2));
    response.end();
}

module.exports = router;
