var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();


var authorize = require('./../../models/authorize');

/* POST authorize. */
router.post('/', authorize.validate, function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req, res);

    if (!errors.isEmpty()) {

        return authorize.sendErrorResponse(errors, req, res);
    }

    return authorize.generateAuthToken(req, res);


});

module.exports = router;
