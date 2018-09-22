var express = require('express');
const { validationResult }  = require('express-validator/check');
var router = express.Router();


var me = require('./../../models/me');
var oauth2 = require('./../../models/oauth2');

/* GET me/ . */
router.get('/', oauth2.validate, function (req, res, next) {


    res.setHeader('Content-Type', 'application/json');

    let errors = validationResult(req, res);

    if (!errors.isEmpty()) {

        return me.sendErrorResponse(errors, req, res);
    }
    console.log("USER ID:" + oauth2.user_id);

    return me.getInfo(req, res, oauth2.user_id);


});

module.exports = router;
