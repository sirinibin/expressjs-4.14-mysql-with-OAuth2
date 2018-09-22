var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();

var employees = require('./../../models/employees');
var oauth2 = require('./../../models/oauth2');

/* GET / . */
router.get('/', oauth2.validate, function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req, res);

    if (!errors.isEmpty()) {

        return employees.sendErrorResponse(errors, req, res);
    }
    return employees.findAll(req, res);


});

module.exports = router;
