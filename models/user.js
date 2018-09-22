const { check }  = require('express-validator/check');
var bcrypt=require('bcrypt');

var user={};

user.validate = [
    check('email').isEmail().withMessage('Must be a Valid E-mail'),
    check('email').custom((value, { req }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Email is required'),



    check('username').custom((value, { req }) => {
        return new Promise(function(resolve, reject){

            if(value.trim()){
                resolve(true);
            }else {
                reject(false);
            }
        });

}).withMessage('Username is required'),

check('password').custom((value, { req }) => {
    return new Promise(function(resolve, reject){

        if(value.trim()){
            resolve(true);
        }else {
            reject(false);
        }
    });

}).withMessage('Password is required'),


check('username').custom((value, { req }) => {


    if(!value){
    return true;
    }
console.log("Username:"+value);

return new Promise(function(resolve, reject){

    value=value.trim();
    //console.log("Username:"+value);

    connection.query('SELECT username FROM users WHERE username = ?'
        , [value], function(error, results, fields) {

            if (results.length > 0&&value==results[0].username) {
                //console.log("U:"+results[0].username);
                reject(false);

            }else {
                resolve(true);
            }

        }
    );

});



}).withMessage('Username already in use'),



check('email').custom((value, { req }) => {

    return new Promise(function(resolve, reject){

        connection.query('SELECT email FROM users WHERE email = ?'
            , [req.body.email], function(error, results, fields) {

                if (results.length > 0&&value==results[0].email) {
                    // console.log(results[0].email);
                    reject(false);

                }else {
                    resolve(true);
                }

            }
        );

    });

}).withMessage('E-mail already in use'),


];

user.sendErrorResponse=function(errors,req,res) {

        var error_response={
            "status":0,
            "errors":{}
        };
        errors=errors.array();

        for(var i=0;i<errors.length;i++){
            error_response.errors[errors[i].param]=[errors[i].msg];
        }

        return  res.status(400).end(JSON.stringify(error_response,null, 3));
};

user.parseAttributes=function(req){

    //Mondatory fields
    var attributes={
        'username':req.body.username.trim(),
        'email':req.body.email.trim(),
        'password':req.body.password.trim()
    };

    //Optional Fields
    if(req.body.name){
        attributes['name']=req.body.name.trim();
    }
    return attributes;
};

user.create=function(req,res,attributes) {


    var attributes=this.parseAttributes(req);

    bcrypt.hash(attributes['password'], 10, function (err,   hash) {

        attributes['password']=hash; //Note:Bcrypt with 10 rounds is the default for Laravel Hash:make()

        connection.query('INSERT INTO users SET created_at = now(),updated_at = now(), ?',attributes, function (error, results, fields) {
            if (error) {
                return  res.end(JSON.stringify(error,null, 3));
            }

            connection.query('SELECT * from users where id=?', results.insertId, function (error, results, fields) {
                if (error) {
                    return  res.end(JSON.stringify(error,null, 3));
                }

                let response={
                    'status':1,
                    'data':{}
                };


                response['data']=results[0];

                return res.end(JSON.stringify(response,null, 3));


            });

        });


    });





}
module.exports = user;
