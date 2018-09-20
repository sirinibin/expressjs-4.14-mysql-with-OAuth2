var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();

var bcrypt=require('bcrypt');

var user = require('./../../models/user');

/* POST user create. */
router.post('/',user.validate, function(req, res, next) {

    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req,res);

    if (!errors.isEmpty()) {

        return user.sendErrorResponse(errors,req,res);
    }

    return user.create(req,res);


});

module.exports = router;
