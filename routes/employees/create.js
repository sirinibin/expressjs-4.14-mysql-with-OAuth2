var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();

var bcrypt=require('bcrypt');

var employees = require('./../../models/employees');
var oauth2 = require('./../../models/oauth2');

/* POST user create. */
router.post('/',oauth2.validate.concat(employees.validate), function(req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req,res);

    if (!errors.isEmpty()) {

        return employees.sendErrorResponse(errors,req,res);
    }

    return employees.create(req,res);


});

module.exports = router;
