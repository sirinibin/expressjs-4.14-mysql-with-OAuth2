var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();

var employees = require('./../../models/employees');
var oauth2 = require('./../../models/oauth2');

/* PUT update. */
router.put('/:id', oauth2.validate.concat(employees.validate), function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req, res);

    if (!errors.isEmpty()) {

        return employees.sendErrorResponse(errors, req, res);
    }

    console.log("ID:" + req.params.id);
    return employees.update(req, res);


});

module.exports = router;
