var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();

var bcrypt=require('bcrypt');

var employees = require('./../../models/employees');
var oauth2 = require('./../../models/oauth2');

/* DELETE Employee . */
router.delete('/:id',oauth2.validate, function(req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req,res);

    if (!errors.isEmpty()) {

        return employees.sendErrorResponse(errors,req,res);
    }

    console.log("ID:"+req.params.id);
    return employees.delete(req,res);


});

module.exports = router;
